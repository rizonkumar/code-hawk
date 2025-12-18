import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../actions";
import { toast } from "sonner";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUserProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return await updateUserProfile(data);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["user-profile"],
        });
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  return {
    profile,
    isLoading,
    isError,
    error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
