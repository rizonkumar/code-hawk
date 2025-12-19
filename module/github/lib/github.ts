import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { Octokit } from "octokit";
import {
  ContributionData,
  ContributionCalendar,
} from "../types/contributionData";

export const getAuthenticatedGithubClient = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to access this resource");
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

  const octokit = new Octokit({ auth: account.accessToken });
  const { data: user } = await octokit.rest.users.getAuthenticated();

  return { octokit, user, token: account.accessToken };
};

export const getGithubToken = async () => {
  try {
    const { token } = await getAuthenticatedGithubClient();
    return token;
  } catch (error) {
    return error as Error;
  }
};

export const fetchUserContributions = async (
  octokit: Octokit,
  username: string,
  from?: string,
  to?: string
): Promise<ContributionCalendar | ContributionCalendar[] | undefined> => {
  const hasDateRange = from && to;
  const query = `
    query(${
      hasDateRange
        ? "$username: String!, $from: DateTime, $to: DateTime"
        : "$username: String!"
    }) {
      user(login: $username) {
        contributionsCollection${hasDateRange ? "(from: $from, to: $to)" : ""} {
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
    const variables = hasDateRange ? { username, from, to } : { username };
    const response = await octokit.graphql<ContributionData>(query, variables);
    const result = response.user?.contributionsCollection?.contributionCalendar;

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new Error("No contribution calendar data found in response");
    }

    return result;
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    throw new Error("Failed to fetch user contributions");
  }
};

export const getUserRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  const { octokit } = await getAuthenticatedGithubClient();
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    per_page: perPage,
    page: page,
  });
  return data;
};

export const createWebHooks = async (owner: string, repo: string) => {
  const { octokit } = await getAuthenticatedGithubClient();

  const webHookURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;
  console.log("Web hook ur", webHookURL);
  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  });
  const existingHook = hooks.find((hook) => hook.config.url === webHookURL);
  if (existingHook) {
    return existingHook;
  }
  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webHookURL,
      content_type: "json",
    },
    events: [
      "push",
      "pull_request",
      "issues",
      "pull_request_review",
      "pull_request_review_comment",
    ],
  });
  return data;
};

export const deleteWebHooks = async (owner: string, repo: string) => {
  const { octokit } = await getAuthenticatedGithubClient();
  const webHookURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;
  try {
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });
    const hookToDelete = hooks.find((hook) => hook.config.url === webHookURL);
    if (hookToDelete) {
      await octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookToDelete.id,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting webhook:", error);
    throw error;
  }
};
