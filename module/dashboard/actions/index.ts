"use server";

import { auth } from "@/lib/auth";
import {
  fetchUserContributions,
  getGithubToken,
} from "@/module/github/lib/github";
import { headers } from "next/headers";
import { Octokit } from "octokit";

const getAuthenticatedGithubClient = async () => {
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

    return { octokit, user };
  } catch (error) {
    console.error("Error authenticating with GitHub:", error as Error);
    return new Error("Failed to authenticate with GitHub");
  }
};

export const getDashboardStatus = async () => {
  try {
    const authResult = await getAuthenticatedGithubClient();
    if (authResult instanceof Error) {
      return authResult;
    }

    const { octokit, user } = authResult;

    // TODO: Fetch total connected repositories from DB;
    const totalRepositories = 30;
    const calendar = await fetchUserContributions(octokit, user.login);
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
    console.error("Error fetching dashboard status:", error as Error);
    return new Error("Failed to fetch dashboard status");
  }
};

export const generateSampleReviews = async (): Promise<
  Array<{ createdAt: Date }>
> => {
  const sampleReviews = [];
  const now = new Date();

  for (let i = 0; i < 45; i++) {
    const randomDayAgo = Math.floor(Math.random() * 180);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - randomDayAgo);
    sampleReviews.push({
      createdAt: reviewDate,
    });
  }
  return sampleReviews;
};

export const getMonthlyActivity = async () => {
  try {
    const authResult = await getAuthenticatedGithubClient();
    if (authResult instanceof Error) {
      return authResult;
    }

    const { octokit, user } = authResult;

    const calendar = await fetchUserContributions(octokit, user.login);

    if (!calendar) {
      return [];
    }

    const monthlyData: {
      [key: string]: { commits: number; pullRequests: number; reviews: number };
    } = {};

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = monthNames[date.getMonth()];
      monthlyData[monthKey] = { commits: 0, pullRequests: 0, reviews: 0 };
    }

    calendar[0]?.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const monthKey = monthNames[date.getMonth()];
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO: Review's Real Data
    const reviews = await generateSampleReviews();
    reviews.forEach((review) => {
      const monthKey = monthNames[review.createdAt.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews++;
      }
    });

    const { data: pullRequests } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr created:>${
          sixMonthsAgo.toISOString().split("T")[0]
        }`,
        per_page: 100,
      });

    pullRequests.items.forEach((pr) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].pullRequests++;
      }
    });

    return Object.keys(monthlyData).map((month) => ({
      month,
      ...monthlyData[month],
    }));
  } catch (error) {
    console.error("Error fetching monthly activity:", error as Error);
    return new Error("Failed to fetch monthly activity");
  }
};
