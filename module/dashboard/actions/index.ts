"use server";

import { auth } from "@/lib/auth";
import {
  fetchUserContributions,
  getGithubToken,
} from "@/module/github/lib/github";
import { headers } from "next/headers";
import { Octokit } from "octokit";

export const getDashboardStatus = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Error("You must be logged in to access this resource");
    }

    const token = await getGithubToken();
    if (token instanceof Error) {
      return new Error(token.message);
    }

    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    // TODO: Fetch total connected repositories from DB;
    const totalRepositories = 30;
    const calendar = await fetchUserContributions(token, user.login);
    const totalCommits = calendar?.[0]?.totalContributions || 0;
    const { data: pullRequests } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      });
    const totalPullRequests = pullRequests.total_count || 0;

    // TODO: COUNT AI REVIEW COUNT
    const totalReviews = 44;
    return {
      totalRepositories,
      totalCommits,
      totalPullRequests,
      totalReviews,
    };
  } catch (error) {
    return new Error("Failed to fetch dashboard status");
  }
};
