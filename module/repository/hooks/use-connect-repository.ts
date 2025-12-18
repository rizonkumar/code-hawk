"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepository } from "../actions";
import { toast } from "sonner";

export const useConnectRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      owner,
      repo,
      githubId,
      description,
      language,
    }: {
      owner: string;
      repo: string;
      githubId: number;
      description?: string;
      language?: string;
    }) => {
      return await connectRepository(
        owner,
        repo,
        githubId,
        description,
        language
      );
    },
    onSuccess: () => {
      toast.success("Repository connected successfully");
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
