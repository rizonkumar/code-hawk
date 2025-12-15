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
  getMonthlyActivity,
} from "@/module/dashboard/actions";
import ContributionGraph from "@/module/dashboard/components/contribution-graph";
import { StatCard } from "@/module/dashboard/components/stat-card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalRepositories: number;
  totalCommits: number;
  totalPullRequests: number;
  totalReviews: number;
}

interface MonthlyActivity {
  month: string;
  commits: number;
  pullRequests: number;
  reviews: number;
}

const ActivityChartSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-40" />
    <div className="grid grid-cols-12 gap-2 h-[220px] items-end">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-full"
          style={{ height: `${30 + Math.random() * 70}%` }}
        />
      ))}
    </div>
  </div>
);

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

  const { data: monthlyActivity, isLoading: isMonthlyLoading } = useQuery<
    MonthlyActivity[]
  >({
    queryKey: ["monthly-activity"],
    queryFn: async () => {
      const res = await getMonthlyActivity();
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

      {/* ================= Stats ================= */}
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

      <Card className="relative overflow-visible">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>
            Monthly breakdown of commits, pull requests, and reviews
          </CardDescription>
        </CardHeader>

        <CardContent className="overflow-visible">
          <div className="relative h-[260px] sm:h-[320px] lg:h-[360px] w-full">
            {isMonthlyLoading ? (
              <ActivityChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyActivity ?? []}
                  barGap={8}
                  barCategoryGap={24}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    wrapperStyle={{
                      zIndex: 9999,
                      pointerEvents: "none",
                    }}
                    cursor={{ fill: "transparent" }}
                    content={({ label, payload }) => {
                      if (!payload?.length) return null;
                      return (
                        <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-lg">
                          <p className="font-medium text-foreground">{label}</p>
                          {payload.map((item) => (
                            <div
                              key={item.name}
                              className="flex justify-between gap-4 text-muted-foreground"
                            >
                              <span>{item.name}</span>
                              <span className="font-medium text-foreground">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 12,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  />

                  <Bar
                    dataKey="commits"
                    name="Commits"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    activeBar={false}
                    isAnimationActive
                  />

                  <Bar
                    dataKey="pullRequests"
                    name="Pull Requests"
                    fill="hsl(var(--chart-2))"
                    radius={[6, 6, 0, 0]}
                    activeBar={false}
                    isAnimationActive
                  />

                  <Bar
                    dataKey="reviews"
                    name="Reviews"
                    fill="hsl(var(--chart-3))"
                    radius={[6, 6, 0, 0]}
                    activeBar={false}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

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
