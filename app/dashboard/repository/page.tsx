"use client";

import { useRepositories } from "@/module/repository/hooks/use-repository";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
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
  // Addd Skeleton loading and error handling
  return <div className="space-y-4"></div>;
};

export default RepositoryPage;
