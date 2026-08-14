import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "../api";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            try {
                const res = await authApi.currentUser();
                return res.data.data;
            } catch (error) {
                if (error.response?.status === 401) {
                    return null;
                }

                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });
            toast.success("Login successful");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Login failed"
            );
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });
            toast.success("Registration successful");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Registration failed"
            );
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });
            toast.success("Logged out");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Logout failed"
            );
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.updateProfile,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });

            toast.success("Profile updated successfully");

        },

        onError: (error) => {

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        },
    });
};

export const useUpdateAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.updateAvatar,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });

            toast.success("Avatar updated successfully");

        },

        onError: (error) => {

            toast.error(
                error.response?.data?.message ||
                "Failed to update avatar"
            );

        },
    });
};