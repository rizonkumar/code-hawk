"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

interface Contribution {
  date: string;
  count: number;
  level: number;
}

interface ContributionGraphProps {
  data?: {
    totalContributions: number;
    contributions: Contribution[];
  };
  isLoading?: boolean;
  error?: unknown;
}

const ContributionGraph = ({
  data,
  isLoading,
  error,
}: ContributionGraphProps) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-[140px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load contribution data.
      </p>
    );
  }

  if (data.contributions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No contribution data available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total contributions
        </span>
        <span className="text-sm font-medium">{data.totalContributions}</span>
      </div>

      <div className="overflow-x-auto">
        <ActivityCalendar
          data={data.contributions}
          blockSize={14}
          blockRadius={3}
          fontSize={12}
          showWeekdayLabels
          showMonthLabels
          colorScheme={theme === "dark" ? "dark" : "light"}
          theme={{
            light: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
        />
      </div>
    </div>
  );
};

export default ContributionGraph;
