import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useAuth";

const fontStack =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";

const Navbar = () => {
    const navigate = useNavigate();

    const { user, isAuthenticated } = useAuth();

    const logout = useLogout();

    const handleLogout = async () => {
        try {
            await logout.mutateAsync();
            navigate("/login");
        } catch {}
    };

    const navClass = ({ isActive }) =>
        `relative py-1 text-[14px] font-medium transition ${
            isActive
                ? "text-[#0A84FF]"
                : "text-white/55 hover:text-white"
        }`;

    const initials = user?.fullName
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <header
            className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/70 backdrop-blur-2xl"
            style={{ fontFamily: fontStack }}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Brand */}
                <NavLink to="/" className="flex items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] shadow-md shadow-black/40"
                        style={{
                            background:
                                "linear-gradient(155deg, #34C7FF 0%, #0A84FF 55%, #0040DD 100%)",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                    </div>

                    <div className="leading-tight">
                        <h1 className="text-[15px] font-semibold tracking-tight text-white">
                            CodeForge
                        </h1>
                        <p className="text-[11px] text-white/40">Online Judge</p>
                    </div>
                </NavLink>

                {/* Nav links */}
                <nav className="hidden items-center gap-7 md:flex">
                    <NavLink to="/" className={navClass} end>
                        Home
                    </NavLink>

                    <NavLink to="/problems" className={navClass}>
                        Problems
                    </NavLink>

                    {isAuthenticated && (
                        <>
                            <NavLink to="/submissions" className={navClass}>
                                Submissions
                            </NavLink>

                            <NavLink to="/profile" className={navClass}>
                                Profile
                            </NavLink>

                            {user?.role === "admin" && (
                                <NavLink to="/admin" className={navClass}>
                                    Admin
                                </NavLink>
                            )}
                        </>
                    )}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden items-center gap-2.5 sm:flex">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.fullName}
                                        className="h-8 w-8 rounded-full border border-white/10 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/80">
                                        {initials || "U"}
                                    </div>
                                )}
                                <div className="leading-tight">
                                    <h3 className="text-[13px] font-medium text-white">
                                        {user?.fullName}
                                    </h3>
                                    <p className="text-[11px] text-white/40">
                                        @{user?.username}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white/70 transition hover:border-[#FF453A]/40 hover:bg-[#FF453A]/10 hover:text-[#FF453A]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="rounded-full px-4 py-2 text-[13px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="rounded-full bg-[#0A84FF] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#409CFF]"
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;