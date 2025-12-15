"use server";

import {
  getAuthenticatedGithubClient,
  fetchUserContributions,
} from "@/module/github/lib/github";
import { ContributionCalendar } from "@/module/github/types/contributionData";

const MONTH_NAMES = [
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
] as const;

const MONTHS_TO_SHOW = 6;

const normalizeCalendarData = (
  calendar: ContributionCalendar | ContributionCalendar[] | undefined
): ContributionCalendar | null => {
  if (!calendar) return null;
  return Array.isArray(calendar) ? calendar[0] : calendar;
};

const initializeMonthlyData = (monthsBack: number = MONTHS_TO_SHOW) => {
  const monthlyData: Record<
    string,
    { commits: number; pullRequests: number; reviews: number }
  > = {};
  const currentDate = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthKey = MONTH_NAMES[date.getMonth()];
    monthlyData[monthKey] = { commits: 0, pullRequests: 0, reviews: 0 };
  }

  return monthlyData;
};

const processMonthlyCommits = (
  calendarData: ContributionCalendar,
  monthlyData: Record<
    string,
    { commits: number; pullRequests: number; reviews: number }
  >
) => {
  if (!calendarData?.weeks) return;

  calendarData.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      const date = new Date(day.date);
      const monthKey = MONTH_NAMES[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].commits += day.contributionCount;
      }
    });
  });
};

export const getContributionGraphData = async () => {
  try {
    const { octokit, user } = await getAuthenticatedGithubClient();
    const calendar = await fetchUserContributions(octokit, user.login);

    const calendarData = normalizeCalendarData(calendar);
    if (!calendarData?.weeks) {
      throw new Error("Invalid contribution data structure");
    }

    // Process contribution days with level calculation (0-4 scale for visualization)
    const contributions = calendarData.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      }))
    );

    return {
      contributions,
      totalContributions: calendarData.totalContributions,
    };
  } catch (error) {
    console.error("Error fetching contribution data:", error);
    return new Error("Failed to fetch contribution data");
  }
};

export const getDashboardStatus = async () => {
  try {
    const { octokit, user } = await getAuthenticatedGithubClient();

    // TODO: Fetch total connected repositories from DB;
    const totalRepositories = 30;

    // Fetch GitHub stats in parallel for better performance
    const [commitsResult, pullRequestsResult] = await Promise.all([
      octokit.rest.search.commits({
        q: `author:${user.login}`,
        per_page: 1,
      }),
      octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      }),
    ]);

    const totalCommits = commitsResult.data.total_count || 0;
    const totalPullRequests = pullRequestsResult.data.total_count || 0;

    // TODO: COUNT AI REVIEW COUNT
    const totalReviews = 44;

    return {
      totalRepositories,
      totalCommits,
      totalPullRequests,
      totalReviews,
    };
  } catch (error) {
    console.error("Error fetching dashboard status:", error);
    return new Error("Failed to fetch dashboard status");
  }
};

export const generateSampleReviews = async (): Promise<
  Array<{ createdAt: Date }>
> => {
  const now = new Date();
  const sampleReviews: Array<{ createdAt: Date }> = [];

  for (let i = 0; i < 45; i++) {
    const randomDayAgo = Math.floor(Math.random() * 180);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - randomDayAgo);
    sampleReviews.push({ createdAt: reviewDate });
  }

  return sampleReviews;
};

export const getMonthlyActivity = async () => {
  try {
    const { octokit, user } = await getAuthenticatedGithubClient();
    const calendar = await fetchUserContributions(octokit, user.login);

    if (!calendar) {
      return [];
    }

    const monthlyData = initializeMonthlyData();

    const calendarData = normalizeCalendarData(calendar);
    if (calendarData) {
      processMonthlyCommits(calendarData, monthlyData);
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO: Review's Real Data
    const reviews = await generateSampleReviews();
    reviews.forEach((review) => {
      const monthKey = MONTH_NAMES[review.createdAt.getMonth()];
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
      const monthKey = MONTH_NAMES[date.getMonth()];
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
