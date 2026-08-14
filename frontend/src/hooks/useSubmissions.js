import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { submissionApi } from "../api";

export const useSubmit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ problemId, data }) =>
            submissionApi.submit(problemId, data),

        onSuccess: () => {
            // Refetch "My Submissions"
            queryClient.invalidateQueries({
                queryKey: ["mySubmissions"],
            });

            // Refetch submissions of this problem
            queryClient.invalidateQueries({
                queryKey: ["problemSubmissions"],
            });

            toast.success("Submission created");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Submission failed"
            );
        },
    });
};

export const useRunCode = () => {
    return useMutation({
        mutationFn: ({ problemId, data }) =>
            submissionApi.run(problemId, data),

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Execution failed"
            );
        },
    });
};

export const useMySubmissions = (params = {}) => {
    return useQuery({
        // params in the key so status/language/page changes trigger a refetch
        // instead of silently serving a stale cached result
        queryKey: ["mySubmissions", params],

        queryFn: async () => {
            const res = await submissionApi.getMySubmissions(params);
            return res.data.data;
        },
    });
};

export const useProblemSubmissions = (problemId, params) => {
    return useQuery({
        queryKey: ["problemSubmissions", problemId, params],

        queryFn: async () => {
            const res = await submissionApi.getProblemSubmissions(
                problemId,
                params
            );
            return res.data.data;
        },

        enabled: !!problemId,
    });
};

export const useSubmission = (submissionId) => {
    return useQuery({
        queryKey: ["submission", submissionId],

        queryFn: async () => {
            const res = await submissionApi.getSubmission(submissionId);
            return res.data.data;
        },

        enabled: !!submissionId,

        retry: false,

        refetchInterval: (query) => {
            const status = query.state.data?.status;

            if (
                status === "PENDING" ||
                status === "RUNNING"
            ) {
                return 1000;
            }

            return false;
        },
    });
};