import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const login = useLogin();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const fontStack =
        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login.mutateAsync(formData);
            navigate("/");
        } catch (error) {}
    };

    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-black px-4 py-12"
            style={{ fontFamily: fontStack }}
        >
            {/* Soft ambient light, Apple keynote-style */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#0A84FF] opacity-[0.12] blur-[140px]" />

            <div className="relative w-full max-w-[380px]">
                {/* App-icon style brand mark */}
                <div className="mb-8 flex flex-col items-center">
                    <div
                        className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] shadow-lg shadow-black/40"
                        style={{
                            background:
                                "linear-gradient(155deg, #34C7FF 0%, #0A84FF 55%, #0040DD 100%)",
                        }}
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                    </div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#F5F5F7]">
                        CodeForge
                    </h1>
                    <p className="mt-1 text-[15px] text-white/50">
                        Sign in to continue
                    </p>
                </div>

                {/* Frosted glass card */}
                <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-[13px] font-medium text-white/50">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full rounded-xl border border-white/10 bg-[#1C1C1E] px-4 py-3 text-[15px] text-[#F5F5F7] placeholder-white/30 outline-none transition focus:border-[#0A84FF]/60 focus:ring-4 focus:ring-[#0A84FF]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[13px] font-medium text-white/50">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-white/10 bg-[#1C1C1E] px-4 py-3 pr-11 text-[15px] text-[#F5F5F7] placeholder-white/30 outline-none transition focus:border-[#0A84FF]/60 focus:ring-4 focus:ring-[#0A84FF]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/70"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.4 18.4 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="!mt-6 w-full rounded-full bg-[#0A84FF] py-3.5 text-[15px] font-semibold text-white transition active:scale-[0.98] active:bg-[#0A6FDB] disabled:cursor-not-allowed disabled:bg-[#0A84FF]/30"
                        >
                            {login.isPending ? "Signing In…" : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-[15px] text-white/50">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-[#0A84FF] transition hover:text-[#409CFF]">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;