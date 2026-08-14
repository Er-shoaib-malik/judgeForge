import { Link } from "react-router-dom";

const fontStack =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";

const Footer = () => {
    return (
        <footer
            className="border-t border-white/10 bg-black px-6 py-10 lg:px-10"
            style={{ fontFamily: fontStack }}
        >
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
                <Link to="/" className="flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-[9px]"
                        style={{
                            background: "linear-gradient(155deg, #34C7FF 0%, #0A84FF 55%, #0040DD 100%)",
                        }}
                    >
                        <span className="text-[13px] font-bold text-white">J</span>
                    </div>
                    <span className="text-[14px] font-semibold text-white">
                        JudgeForge
                    </span>
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-white/50">
                    <Link to="/problems" className="transition hover:text-white">
                        Problems
                    </Link>
                    <Link to="/submissions" className="transition hover:text-white">
                        Submissions
                    </Link>
                    <Link to="/profile" className="transition hover:text-white">
                        Profile
                    </Link>
                    <Link to="/login" className="transition hover:text-white">
                        Sign In
                    </Link>
                </div>

                <p className="text-[12.5px] text-white/35">
                    © {new Date().getFullYear()} JudgeForge
                </p>
            </div>
        </footer>
    );
};

export default Footer;