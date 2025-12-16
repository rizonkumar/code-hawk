import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getUserRepositories } from "@/module/github/lib/github";
import { headers } from "next/headers";

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
