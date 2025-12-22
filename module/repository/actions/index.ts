"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  createWebHooks,
  getUserRepositories,
} from "@/module/github/lib/github";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { inngest } from "@/inngest/client";
import {
  canConnectRepository,
  incrementRepositoryCount,
} from "@/module/payment/lib/subscription";

export const fetchUserRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("You must be logged in to access this resource");
  }

  try {
    const githubRepositories = await getUserRepositories(page, perPage);
    const dbRepositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });
    const connectedRepositoriesIds = new Set(
      dbRepositories.map((repository) => repository.githubId)
    );
    return githubRepositories.map((repository) => ({
      ...repository,
      isConnected: connectedRepositoriesIds.has(BigInt(repository.id)),
    }));
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    throw new Error("Failed to fetch user repositories");
  }
};

export const connectRepository = async (
  owner: string,
  repo: string,
  githubId: number,
  description?: string,
  language?: string
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("You must be logged in to access this resource");
  }

  try {
    const canConnect = await canConnectRepository(session.user.id);

    if (!canConnect) {
      throw new Error(
        "You have reached the limit of FREE version, please upgrade to PRO version"
      );
    }

    const webHook = await createWebHooks(owner, repo);
    if (webHook) {
      await prisma.repository.create({
        data: {
          id: randomUUID(),
          githubId: BigInt(githubId),
          name: repo,
          owner,
          fullName: `${owner}/${repo}`,
          userId: session.user.id,
          url: `https://github.com/${owner}/${repo}`,
          description: description || null,
          language: language || null,
        },
      });

      await incrementRepositoryCount(session.user.id);

      try {
        await inngest.send({
          name: "repository.connected",
          data: {
            owner,
            repo,
            userId: session.user.id,
          },
        });
      } catch (error) {
        console.error("Failed to send inngest event:", error);
      }
    }
    return webHook;
  } catch (error) {
    console.error("Error connecting repository:", error);
    throw new Error("Failed to connect repository. Please try again.");
  }
};
