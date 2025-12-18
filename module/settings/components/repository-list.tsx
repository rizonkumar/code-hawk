"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Trash2,
  AlertCircle,
  GitBranch,
  Github,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRepository } from "../hooks/use-repository";
import Link from "next/link";

export function RespositoryList() {
  const {
    repositories,
    isLoading,
    isError,
    error,
    disconnectRepository,
    isDisconnecting,
    disconnectAllRepositories,
    isDisconnectingAll,
  } = useRepository();

  const [disconnectAllOpen, setDisconnectAllOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-9 w-[100px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load connected repositories"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>
              Manage your connected GitHub repositories.
            </CardDescription>
          </div>
          {repositories && repositories.length > 0 && (
            <AlertDialog
              open={disconnectAllOpen}
              onOpenChange={setDisconnectAllOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4 cursor-pointer" />
                  Disconnect All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will disconnect all {repositories.length}{" "}
                    repositories from your account. You will rely on manual
                    steps to reconnect them later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      disconnectAllRepositories(undefined, {
                        onSuccess: () => setDisconnectAllOpen(false),
                      });
                    }}
                    disabled={isDisconnectingAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDisconnectingAll ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      "Disconnect All"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
        <CardContent>
          {!repositories || repositories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Github className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No repositories connected</p>
              <p className="text-sm max-w-sm mt-1 mb-4">
                Connect your GitHub repositories to start tracking issues and
                pull requests.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/repository">Connect Repository</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium hover:underline flex items-center gap-1"
                      >
                        {repo.fullName}
                      </a>
                      <Badge
                        variant="outline"
                        className="text-xs font-medium border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      >
                        Connected
                      </Badge>
                      {repo.language && (
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Connected{" "}
                          {format(new Date(repo.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <AlertDialog
                    open={repoToDelete === repo.id}
                    onOpenChange={(open) =>
                      open ? setRepoToDelete(repo.id) : setRepoToDelete(null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        disabled={isDisconnecting && repoToDelete === repo.id}
                      >
                        {isDisconnecting && repoToDelete === repo.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 cursor-pointer" />
                        )}
                        <span className="sr-only">Disconnect</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Disconnect Repository?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to disconnect{" "}
                          <span className="font-semibold text-foreground">
                            {repo.fullName}
                          </span>
                          ? We will stop tracking updates for this repository.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault();
                            disconnectRepository(repo.id, {
                              onSuccess: () => setRepoToDelete(null),
                            });
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDisconnecting}
                        >
                          {isDisconnecting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Disconnecting...
                            </>
                          ) : (
                            "Disconnect"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
