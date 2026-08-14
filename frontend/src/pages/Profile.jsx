import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUpdateProfile, useUpdateAvatar } from "../hooks/useAuth";
import { useMySubmissions } from "../hooks/useSubmissions";

const fontStack =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";
const monoStack = "'SF Mono', 'JetBrains Mono', Menlo, monospace";

const BIO_MAX = 100;
const STATS_SAMPLE_SIZE = 100;
const HEATMAP_WEEKS = 17;

const getRatingTier = (rating = 0) => {
    if (rating >= 2300) return { label: "Grandmaster", color: "#FF453A" };
    if (rating >= 2100) return { label: "Master", color: "#FF9F0A" };
    if (rating >= 1900) return { label: "Candidate Master", color: "#BF5AF2" };
    if (rating >= 1600) return { label: "Expert", color: "#0A84FF" };
    if (rating >= 1400) return { label: "Specialist", color: "#5AC8FA" };
    if (rating >= 1200) return { label: "Pupil", color: "#30D158" };
    return { label: "Newbie", color: "#8B92A0" };
};

const statusConfig = {
    ACCEPTED: { label: "Accepted", color: "#30D158" },
    WRONG_ANSWER: { label: "Wrong Answer", color: "#FF453A" },
    TIME_LIMIT_EXCEEDED: { label: "Time Limit Exceeded", color: "#FF9F0A" },
    MEMORY_LIMIT_EXCEEDED: { label: "Memory Limit Exceeded", color: "#FF9F0A" },
    COMPILATION_ERROR: { label: "Compilation Error", color: "#BF5AF2" },
    RUNTIME_ERROR: { label: "Runtime Error", color: "#FF6482" },
    PENDING: { label: "Pending", color: "#8B92A0" },
    RUNNING: { label: "Running", color: "#0A84FF" },
};

const difficultyStyles = {
    Easy: { text: "text-[#30D158]", dot: "bg-[#30D158]" },
    Medium: { text: "text-[#FF9F0A]", dot: "bg-[#FF9F0A]" },
    Hard: { text: "text-[#FF453A]", dot: "bg-[#FF453A]" },
};

const RATING_MAX = 3000;
const RING_RADIUS = 42;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const dateKey = (d) => new Date(d).toISOString().slice(0, 10);

const Profile = () => {
    const { user } = useAuth();

    const updateProfile = useUpdateProfile();
    const updateAvatar = useUpdateAvatar();

    const [editing, setEditing] = useState(false);
    const [tab, setTab] = useState("overview"); // "overview" | "submissions"

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        bio: user?.bio || "",
    });

    const [ringOffset, setRingOffset] = useState(RING_CIRCUMFERENCE);

    const rating = user?.rating || 0;
    const tier = getRatingTier(rating);

    const { data, isLoading: subsLoading } = useMySubmissions({
        page: 1,
        limit: STATS_SAMPLE_SIZE,
    });

    const submissions = data?.submissions ?? [];
    const totalSubmissions = data?.pagination?.totalSubmissions ?? submissions.length;
    const isTruncated = totalSubmissions > submissions.length;

    const stats = useMemo(() => {
        const accepted = submissions.filter((s) => s.status === "ACCEPTED");
        const solvedIds = new Set(accepted.map((s) => s.problemId?._id));
        const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
        accepted.forEach((s) => {
            const d = s.problemId?.difficulty;
            if (d && solvedIds.has(s.problemId._id)) {
                // count each solved problem once per difficulty (dedupe below)
            }
        });
        // dedupe solved problems by id, keep their difficulty
        const seen = new Set();
        accepted.forEach((s) => {
            const id = s.problemId?._id;
            if (id && !seen.has(id)) {
                seen.add(id);
                if (s.problemId?.difficulty) byDifficulty[s.problemId.difficulty]++;
            }
        });

        const acceptanceRate =
            submissions.length > 0
                ? Math.round((accepted.length / submissions.length) * 100)
                : 0;

        return {
            acceptedCount: accepted.length,
            solvedCount: solvedIds.size,
            acceptanceRate,
            byDifficulty,
        };
    }, [submissions]);

    const heatmap = useMemo(() => {
        const counts = {};
        submissions.forEach((s) => {
            const key = dateKey(s.createdAt);
            counts[key] = (counts[key] || 0) + 1;
        });

        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalDays = HEATMAP_WEEKS * 7;

        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = dateKey(d);
            days.push({ date: d, key, count: counts[key] || 0 });
        }

        // group into weeks (columns), starting on Sunday
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    }, [submissions]);

    const heatColor = (count) => {
        if (count === 0) return "rgba(255,255,255,0.06)";
        if (count === 1) return "#0A84FF33";
        if (count <= 3) return "#0A84FF77";
        return "#0A84FF";
    };

    useEffect(() => {
        const progress = Math.min(rating / RATING_MAX, 1);
        const target = RING_CIRCUMFERENCE * (1 - progress);
        const t = setTimeout(() => setRingOffset(target), 200);
        return () => clearTimeout(t);
    }, [rating]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "bio" && value.length > BIO_MAX) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(formData);
            setEditing(false);
        } catch (err) {}
    };

    const handleAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append("avatar", file);
        try {
            await updateAvatar.mutateAsync(form);
        } catch (err) {}
    };

    const handleCancel = () => {
        setFormData({ fullName: user?.fullName || "", bio: user?.bio || "" });
        setEditing(false);
    };

    const initials = user?.fullName
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
          })
        : null;

    return (
        <div
            className="min-h-screen bg-black px-6 py-16 text-[#F5F5F7] lg:px-10"
            style={{ fontFamily: fontStack }}
        >
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { opacity: 0; animation: fadeUp 0.6s ease forwards; }
            `}</style>

            <div className="mx-auto max-w-5xl space-y-6">
                <div className="fade-up">
                    <h1 className="text-4xl font-semibold tracking-tight">My Profile</h1>
                    <p className="mt-2 text-[15px] text-white/50">
                        Manage your account and track your progress.
                    </p>
                </div>

                {/* Avatar + rating card */}
                <div
                    className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl"
                    style={{ animationDelay: "0.05s" }}
                >
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <svg
                                width="140"
                                height="140"
                                viewBox="0 0 100 100"
                                className="absolute -left-2 -top-2 -rotate-90"
                            >
                                <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={RING_RADIUS}
                                    fill="none"
                                    stroke={tier.color}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={RING_CIRCUMFERENCE}
                                    strokeDashoffset={ringOffset}
                                    style={{ transition: "stroke-dashoffset 1.1s ease-out" }}
                                />
                            </svg>

                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="relative h-32 w-32 rounded-full border border-white/10 object-cover shadow-lg shadow-black/40"
                                />
                            ) : (
                                <div
                                    className="relative flex h-32 w-32 items-center justify-center rounded-full text-3xl font-semibold text-white shadow-lg shadow-black/40"
                                    style={{ background: "linear-gradient(155deg, #34C7FF 0%, #0A84FF 55%, #0040DD 100%)" }}
                                >
                                    {initials || "U"}
                                </div>
                            )}

                            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-[#0A84FF] transition hover:bg-[#409CFF]">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                <input type="file" hidden accept="image/*" onChange={handleAvatar} />
                            </label>
                        </div>

                        {updateAvatar.isPending && (
                            <p className="mt-3 text-[12px] text-white/40">Uploading…</p>
                        )}

                        <h2 className="mt-5 text-2xl font-semibold tracking-tight">{user?.fullName}</h2>
                        <p className="mt-1 text-[14px] text-white/50">@{user?.username}</p>
                        <p className="mt-0.5 text-[13px] text-white/35">{user?.email}</p>

                        {user?.bio && (
                            <p className="mt-3 max-w-md text-center text-[14px] leading-relaxed text-white/60">
                                {user.bio}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            <span
                                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                                style={{ color: tier.color, backgroundColor: `${tier.color}1A`, border: `1px solid ${tier.color}4D` }}
                            >
                                {tier.label} · {rating}
                            </span>

                            {user?.role === "admin" && (
                                <span className="rounded-full border border-[#0A84FF]/30 bg-[#0A84FF]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0A84FF]">
                                    Admin
                                </span>
                            )}

                            {memberSince && (
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/50">
                                    Member since {memberSince}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div
                    className="fade-up grid grid-cols-2 gap-4 sm:grid-cols-4"
                    style={{ animationDelay: "0.08s" }}
                >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-[12px] text-white/40">Total Submissions</p>
                        <p className="mt-1 text-3xl font-semibold">{totalSubmissions}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-[12px] text-white/40">Problems Solved</p>
                        <p className="mt-1 text-3xl font-semibold text-[#30D158]">{stats.solvedCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-[12px] text-white/40">Acceptance Rate</p>
                        <p className="mt-1 text-3xl font-semibold text-[#0A84FF]">{stats.acceptanceRate}%</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-[12px] text-white/40">By Difficulty</p>
                        <div className="mt-2 flex gap-3">
                            {["Easy", "Medium", "Hard"].map((d) => (
                                <span key={d} className={`flex items-center gap-1 text-[13px] font-semibold ${difficultyStyles[d].text}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${difficultyStyles[d].dot}`} />
                                    {stats.byDifficulty[d]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {isTruncated && (
                    <p className="fade-up -mt-2 text-[12px] text-white/30" style={{ animationDelay: "0.1s" }}>
                        Solved/rate stats are based on your last {STATS_SAMPLE_SIZE} submissions, not your full history.
                    </p>
                )}

                {/* Activity heatmap */}
                <div
                    className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
                    style={{ animationDelay: "0.12s" }}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-[15px] font-semibold text-white/70">Submission Activity</h2>
                        <span className="text-[12px] text-white/35">Last {HEATMAP_WEEKS} weeks</span>
                    </div>

                    {subsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
                        </div>
                    ) : (
                        <div className="flex gap-[3px] overflow-x-auto pb-1">
                            {heatmap.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((day) => (
                                        <div
                                            key={day.key}
                                            title={`${day.count} submission${day.count !== 1 ? "s" : ""} on ${day.date.toLocaleDateString()}`}
                                            className="h-[13px] w-[13px] rounded-[3px] transition"
                                            style={{ backgroundColor: heatColor(day.count) }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="fade-up flex gap-6 border-b border-white/10" style={{ animationDelay: "0.14s" }}>
                    {[
                        { key: "overview", label: "Personal Information" },
                        { key: "submissions", label: `Recent Submissions${submissions.length ? ` (${submissions.length})` : ""}` },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`relative pb-3 text-[14px] font-medium transition ${
                                tab === t.key ? "text-white" : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            {t.label}
                            {tab === t.key && (
                                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#0A84FF]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Personal info / edit */}
                {tab === "overview" && (
                    <div
                        className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl sm:p-8"
                        style={{ animationDelay: "0.16s" }}
                    >
                        <div className="mb-7 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="rounded-full bg-[#0A84FF] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#409CFF]"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {!editing ? (
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-[12px] font-medium text-white/40">FULL NAME</p>
                                    <p className="mt-1.5 text-[15px] text-white/90">{user?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-medium text-white/40">USERNAME</p>
                                    <p className="mt-1.5 text-[15px] text-white/90">@{user?.username}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-medium text-white/40">EMAIL</p>
                                    <p className="mt-1.5 text-[15px] text-white/90">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-medium text-white/40">ROLE</p>
                                    <p className="mt-1.5 text-[15px] capitalize text-white/90">{user?.role}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[12px] font-medium text-white/40">BIO</p>
                                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/90">
                                        {user?.bio || <span className="text-white/30">No bio added yet.</span>}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-[13px] font-medium text-white/50">Full Name</label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-[#1C1C1E] px-4 py-3 text-[15px] text-[#F5F5F7] outline-none transition focus:border-[#0A84FF]/60 focus:ring-4 focus:ring-[#0A84FF]/20"
                                    />
                                </div>

                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label className="block text-[13px] font-medium text-white/50">Bio</label>
                                        <span className={`text-[12px] ${formData.bio.length >= BIO_MAX ? "text-[#FF453A]" : "text-white/30"}`}>
                                            {formData.bio.length}/{BIO_MAX}
                                        </span>
                                    </div>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tell other solvers a bit about yourself…"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-[#1C1C1E] px-4 py-3 text-[15px] text-[#F5F5F7] placeholder-white/30 outline-none transition focus:border-[#0A84FF]/60 focus:ring-4 focus:ring-[#0A84FF]/20"
                                    />
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                                    <p className="text-[12px] text-white/40">
                                        Username and email can't be changed from here.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={updateProfile.isPending}
                                        className="rounded-full bg-[#0A84FF] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#409CFF] disabled:cursor-not-allowed disabled:bg-[#0A84FF]/30"
                                    >
                                        {updateProfile.isPending ? "Saving…" : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-full border border-white/10 px-6 py-2.5 text-[14px] font-medium text-white/70 transition hover:bg-white/[0.06]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* Recent submissions */}
                {tab === "submissions" && (
                    <div className="fade-up space-y-3" style={{ animationDelay: "0.16s" }}>
                        {subsLoading && (
                            <div className="flex justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-16">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
                            </div>
                        )}

                        {!subsLoading && submissions.length === 0 && (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
                                <p className="text-[15px] font-medium text-white/70">No submissions yet</p>
                                <p className="mt-1 text-[13px] text-white/40">
                                    Solve a problem to see it show up here.
                                </p>
                            </div>
                        )}

                        {!subsLoading &&
                            submissions.slice(0, 15).map((sub) => {
                                const cfg = statusConfig[sub.status] || statusConfig.PENDING;
                                return (
                                    <Link
                                        key={sub._id}
                                        to={`/submissions/${sub._id}`}
                                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.05]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                                                style={{ color: cfg.color, backgroundColor: `${cfg.color}1A` }}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                                                {cfg.label}
                                            </span>
                                            <span className="text-[14px] font-medium text-white/90">
                                                {sub.problemId?.title}
                                            </span>
                                        </div>
                                        <span className="text-[12px] text-white/35">
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </span>
                                    </Link>
                                );
                            })}

                        {submissions.length > 0 && (
                            <Link
                                to="/submissions"
                                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.02] py-3.5 text-[13.5px] font-medium text-[#0A84FF] transition hover:bg-white/[0.05]"
                            >
                                View all submissions
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;