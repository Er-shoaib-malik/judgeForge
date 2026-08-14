import { createContext, useContext } from "react";
import { useCurrentUser } from "../hooks/useAuth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useCurrentUser();

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: isLoading,
                isAuthenticated: !!user,
                isError,
                refetchUser: refetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};