import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/Home";
import Problems from "../pages/Problems";
import ProblemDetails from "../pages/ProblemDetails";
import Profile from "../pages/Profile";
import Submissions from "../pages/Submissions";
import Admin from "../pages/Admin";
import SubmissionDetails from "@/pages/SubmissionDetails";

const AppRouter = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/problems/:problemId" element={<ProblemDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/submissions" element={<Submissions />} />
                    <Route path="/problems/:problemId/submissions-created" />
                    <Route path="/submissions/:submissionId" element={<SubmissionDetails/>}/>
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Route>

        </Routes>
    );
};

export default AppRouter;