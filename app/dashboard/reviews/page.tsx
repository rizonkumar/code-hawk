"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ExternalLink,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  MessageSquareCode,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  GitBranch,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/module/review/actions";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface Review {
  id: string;
  repositoryId: string;
  pullRequestNumber: number;
  pullRequestTitle: string;
  pullRequestURL: string;
  review: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  repository: {
    id: string;
    name: string;
    owner: string;
    fullName: string;
    url: string;
  };
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle2,
        className:
          "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      };
    case "failed":
      return {
        label: "Failed",
        icon: XCircle,
        className:
          "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
      };
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        className:
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      };
    default:
      return {
        label: status,
        icon: Clock,
        className: "",
      };
  }
};

function ReviewSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-7 w-24 shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 border-t bg-muted/30 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-36" />
      </CardFooter>
    </Card>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(review.status);
  const StatusIcon = statusConfig.icon;

  // Check if review is long enough to need expansion
  const isLongReview = review.review.length > 500;
  const displayReview =
    isExpanded || !isLongReview
      ? review.review
      : review.review.substring(0, 500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-1.5 overflow-hidden">
              <CardTitle className="text-lg leading-snug line-clamp-2">
                {review.pullRequestTitle}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <GitBranch className="size-3.5" />
                  <span className="font-medium">
                    {review.repository.fullName}
                  </span>
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="inline-flex items-center gap-1">
                  <GitPullRequest className="size-3.5" />#
                  {review.pullRequestNumber}
                </span>
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 gap-1.5 px-3 py-1 text-xs font-medium ${statusConfig.className}`}
            >
              <StatusIcon className="size-3.5" />
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        {/* Review Content */}
        <CardContent className="border-t bg-muted/20 pt-4">
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0 prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-code:text-xs prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-muted-foreground/70">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayReview}
            </ReactMarkdown>
          </div>

          {/* Expand/Collapse Button */}
          {isLongReview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 w-full gap-2 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  Show Full Review
                </>
              )}
            </Button>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            Reviewed{" "}
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 transition-all group-hover:border-primary/50 group-hover:bg-primary/5"
          >
            <a
              href={review.pullRequestURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitPullRequest className="size-4" />
              View on GitHub
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function ReviewPage() {
  const {
    data: reviews,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await getReviews();
    },
  });

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review History</h1>
          <p className="text-muted-foreground">
            View all your code reviews by Code Hawk
          </p>
        </div>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <Card className="w-full max-w-md border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/15">
                <AlertTriangle className="size-7 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  Failed to load reviews
                </h2>
                <p className="text-muted-foreground text-sm">
                  We couldn&apos;t fetch your review history. This might be a
                  temporary issue.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="mt-2"
              >
                {isRefetching ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 size-4" />
                    Try Again
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review History</h1>
          <p className="text-muted-foreground">
            View all your code reviews by Code Hawk
          </p>
        </div>
        {reviews && reviews.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-2"
          >
            {isRefetching ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                Refresh
              </>
            )}
          </Button>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews?.length === 0 ? (
        // Empty state
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Empty>
              <EmptyMedia variant="icon">
                <MessageSquareCode className="size-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No reviews yet</EmptyTitle>
                <EmptyDescription>
                  Connect your repositories and open a pull request to get your
                  first AI-powered code review from Code Hawk.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <a href="/dashboard/repository">
                    <GitBranch className="mr-2 size-4" />
                    Connect Repository
                  </a>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        // Reviews list - single column for better readability
        <div className="space-y-4">
          {reviews?.map((review: Review, index: number) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
