"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useRepositories } from "@/module/repository/hooks/use-repository";
import {
  ExternalLink,
  GitBranch,
  Search,
  Star,
  Loader2,
  Check,
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useConnectRepository } from "@/module/repository/hooks/use-connect-repository";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  isConnected?: boolean;
}

const RepositoryPage = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();

  const { mutate: connectRepo } = useConnectRepository();

  const [searchQuery, setSearchQuery] = useState("");
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(
    null
  );

  const allRepositories = data?.pages.flatMap((page) => page) || [];
  const filteredRepositories = allRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (repo: Repository) => {
    setLocalConnectingId(Number(repo.id));
    connectRepo(
      {
        owner: repo.full_name.split("/")[0],
        repo: repo.name,
        githubId: Number(repo.id),
        description: repo.description || undefined,
        language: repo.language || undefined,
      },
      {
        onSettled: () => setLocalConnectingId(null),
      }
    );
  };

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">
          Failed to load repositories
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage and view all of your repositories
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="flex min-w-0 flex-col justify-between overflow-hidden"
            >
              <CardHeader>
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredRepositories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Empty>
            <EmptyMedia variant="icon">
              <GitBranch />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No repositories found</EmptyTitle>
              <EmptyDescription>
                {searchQuery
                  ? `No repositories matching "${searchQuery}"`
                  : "You don't have any repositories yet."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepositories.map((repo) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                key={repo.id}
                className="min-w-0"
              >
                <Card className="flex h-full min-w-0 flex-col overflow-hidden hover:border-sidebar-ring/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 truncate">
                        <CardTitle
                          className="truncate text-base"
                          title={repo.name}
                        >
                          {repo.name}
                        </CardTitle>
                        <p
                          className="text-muted-foreground text-xs truncate"
                          title={repo.full_name}
                        >
                          {repo.full_name}
                        </p>
                      </div>
                      {repo.language && (
                        <Badge variant="secondary" className="shrink-0">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {repo.description || "No description provided."}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="size-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="size-8"
                      >
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleConnect(repo)}
                        disabled={
                          localConnectingId === Number(repo.id) ||
                          repo.isConnected
                        }
                        variant={repo.isConnected ? "outline" : "default"}
                        className={
                          repo.isConnected
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                            : ""
                        }
                      >
                        {localConnectingId === Number(repo.id) ? (
                          <>
                            <Loader2 className="mr-2 size-3 animate-spin" />
                            Connecting
                          </>
                        ) : repo.isConnected ? (
                          <>
                            <Check className="mr-1 size-3" />
                            Connected
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {!searchQuery && hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RepositoryPage;
