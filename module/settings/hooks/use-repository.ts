import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConnectedRepositories,
  disconnectRepository,
  disconnectAllRepository,
} from "../actions";
import { toast } from "sonner";

export const useRepository = () => {
  const queryClient = useQueryClient();

  const {
    data: repositories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["connected-repositories"],
    queryFn: async () => await getConnectedRepositories(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  const disconnectMutation = useMutation({
    mutationFn: async (repositoryId: string) =>
      await disconnectRepository(repositoryId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Repository disconnected successfully");
        queryClient.invalidateQueries({
          queryKey: ["connected-repositories"],
        });
        queryClient.invalidateQueries({
          queryKey: ["dashboard-stats"],
        });
      } else {
        toast.error(result.error || "Failed to disconnect repository");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to disconnect repository");
    },
  });

  const disconnectAllMutation = useMutation({
    mutationFn: async () => await disconnectAllRepository(),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("All repositories disconnected successfully");
        queryClient.invalidateQueries({
          queryKey: ["connected-repositories"],
        });
        queryClient.invalidateQueries({
          queryKey: ["dashboard-stats"],
        });
      } else {
        toast.error(result.error || "Failed to disconnect all repositories");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to disconnect all repositories");
    },
  });

  return {
    repositories,
    isLoading,
    isError,
    error,
    disconnectRepository: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
    disconnectAllRepositories: disconnectAllMutation.mutate,
    isDisconnectingAll: disconnectAllMutation.isPending,
  };
};
