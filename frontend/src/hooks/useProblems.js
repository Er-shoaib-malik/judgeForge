import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { problemApi } from "../api";

export const useProblems = (params) => {
    return useQuery({
        queryKey: ["problems", params],

        queryFn: async () => {
            const res = await problemApi.getProblems(params);
            return res.data.data;
        },

        placeholderData: (previousData) => previousData,
    });
};

export const useProblem = (id) => {
    return useQuery({
        queryKey: ["problem", id],
        queryFn: async () => {
            const res = await problemApi.getProblem(id);
            return res.data.data;
        },
        enabled: !!id,
    });
};

export const useCreateProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: problemApi.createProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["problems"],
            });
            toast.success("Problem created");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to create problem"
            );
        },
    });
};

export const useUpdateProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: problemApi.updateProblem,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["problems"],
            });

            queryClient.invalidateQueries({
                queryKey: ["problem", variables.id],
            });

            toast.success("Problem updated");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to update problem"
            );
        },
    });
};

export const useDeleteProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: problemApi.deleteProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["problems"],
            });
            toast.success("Problem Deleted");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to delete problem"
            );
        },
    });
};