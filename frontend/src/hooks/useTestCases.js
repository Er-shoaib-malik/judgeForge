import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { testcaseApi } from "../api";

export const useProblemTestCases = (problemId) => {
    return useQuery({
        queryKey: ["testcases", problemId],
        queryFn: async () => {
            const res = await testcaseApi.getTestCases(problemId);
            return res.data.data;
        },
        enabled: !!problemId,
    });
};

export const useAddTestCase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ problemId, data }) =>
            testcaseApi.createTestCase(problemId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["testcases", variables.problemId],
            });

            toast.success("Test case added successfully");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to add test case"
            );
        },
    });
};

export const useUpdateTestCase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ testcaseId, data }) =>
            testcaseApi.updateTestCase(testcaseId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["testcases"],
            });

            toast.success("Test case updated successfully");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to update test case"
            );
        },
    });
};

export const useDeleteTestCase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (testcaseId) =>
            testcaseApi.deleteTestCase(testcaseId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["testcases"],
            });

            toast.success("Test case deleted successfully");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete test case"
            );
        },
    });
};