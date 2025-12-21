"use server";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { getPullRequestDiff } from "@/module/github/lib/github";

export const reviewPullRequest = async (
  owner: string,
  repoName: string,
  pullRequestNumber: number
) => {
  try {
    const repository = await prisma.repository.findFirst({
      where: {
        owner,
        name: repoName,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository) {
      throw new Error(
        `Repository ${owner}/${repoName} not found in database. Please reconnect the repository`
      );
    }

    const githubAccount = repository.user.accounts[0];

    if (!githubAccount?.accessToken) {
      throw new Error(
        `No access token found for user ${repository.user.name}. Please reconnect the repository`
      );
    }

    const token = githubAccount.accessToken;

    await getPullRequestDiff(token, owner, repoName, pullRequestNumber);

    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner,
        repoName,
        pullRequestNumber,
        userId: repository.userId,
      },
    });

    return { success: true, message: "Review Queued" };
  } catch (error) {
    console.error("Error in reviewPullRequest:", error);
    try {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repoName,
        },
      });
      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            pullRequestNumber,
            pullRequestTitle: "Failed to fetch PR",
            pullRequestURL: `https://github.com/${owner}/${repoName}/pull/${pullRequestNumber}`,
            status: "failed",
            review: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    } catch (innerError) {
      console.error("Error creating failed review record:", innerError);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
