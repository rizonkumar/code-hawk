"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

interface Contribution {
  date: string;
  count: number;
  level: number;
}

interface Props {
  data?: {
    totalContributions: number;
    contributions: Contribution[];
  };
  isLoading?: boolean;
  error?: unknown;
}

const ContributionGraph = ({ data, isLoading, error }: Props) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-[120px] w-full sm:h-[150px]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load contribution activity.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          Total contributions
        </span>
        <span className="text-sm font-medium">
          {data.totalContributions.toLocaleString()}
        </span>
      </div>

      <div className="relative -mx-2 overflow-x-auto px-2">
        <ActivityCalendar
          data={data.contributions}
          blockSize={12}
          blockRadius={3}
          fontSize={12}
          showWeekdayLabels={false}
          showMonthLabels
          colorScheme={theme === "dark" ? "dark" : "light"}
          theme={{
            light: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground sm:hidden">
        Scroll horizontally to view full activity
      </p>
    </div>
  );
};

export default ContributionGraph;
