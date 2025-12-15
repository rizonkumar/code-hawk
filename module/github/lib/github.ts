import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { Octokit } from "octokit";
import { ContributionData } from "../types/contributionData";

export const getGithubToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Error("You must be logged in to access this resource");
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account?.accessToken) {
    throw new Error("No github access token found");
  }

  return account.accessToken;
};

export const fetchUserContributions = async (
  octokit: Octokit,
  username: string,
  from?: string,
  to?: string
) => {
  const query = `
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
  `;

  try {
    const response = await octokit.graphql<ContributionData>(query, {
      username,
      from,
      to,
    });
    return response.user.contributionsCollection?.contributionCalendar;
  } catch (error) {
    console.error("Error fetching user contributions:", error as Error);
    throw new Error("Failed to fetch user contributions");
  }
};
