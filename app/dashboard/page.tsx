"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStatus,
  getContributionGraphData,
} from "@/module/dashboard/actions";
import ContributionGraph from "@/module/dashboard/components/contribution-graph";
import { StatCard } from "@/module/dashboard/components/stat-card";

interface DashboardStats {
  totalRepositories: number;
  totalCommits: number;
  totalPullRequests: number;
  totalReviews: number;
}

const MainPage = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await getDashboardStatus();
      if (res instanceof Error) throw res;
      return res;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: contributionData,
    isLoading: isContributionLoading,
    error: contributionError,
  } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => {
      const res = await getContributionGraphData();
      if (res instanceof Error) throw res;
      return res;
    },
    refetchOnWindowFocus: false,
  });

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your coding activity and AI reviews
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Repositories"
          value={stats?.totalRepositories ?? 0}
          description="Connected repositories"
          icon={GitBranch}
          isLoading={isLoading}
        />
        <StatCard
          title="Commits"
          value={stats?.totalCommits ?? 0}
          description="Total commits analyzed"
          icon={GitCommit}
          isLoading={isLoading}
        />
        <StatCard
          title="Pull Requests"
          value={stats?.totalPullRequests ?? 0}
          description="PRs reviewed"
          icon={GitPullRequest}
          isLoading={isLoading}
        />
        <StatCard
          title="AI Reviews"
          value={stats?.totalReviews ?? 0}
          description="Automated reviews generated"
          icon={MessageSquare}
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
          <CardDescription>
            Your GitHub contribution activity for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContributionGraph
            data={contributionData}
            isLoading={isContributionLoading}
            error={contributionError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
