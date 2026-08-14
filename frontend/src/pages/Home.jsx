import { Link } from "react-router-dom";

const stats = [
    { title: "Problems", value: "250+" },
    { title: "Languages", value: "3" },
    { title: "Submissions", value: "100K+" },
    { title: "Realtime Judge", value: "24/7" },
];

const features = [
    {
        title: "Docker Sandbox",
        description: "Secure execution of user code inside isolated Docker containers.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="7" height="7" rx="1" />
                <rect x="10.5" y="8" width="7" height="7" rx="1" />
                <rect x="10.5" y="1" width="7" height="7" rx="1" />
                <path d="M21 15.5c0 3-2.5 5.5-6 5.5H8c-3.5 0-6-2.5-6-5.5" />
            </svg>
        ),
    },
    {
        title: "Realtime Judging",
        description: "Instant verdicts with runtime and memory statistics.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 11 14 10 22 21 10 13 10 13 2" />
            </svg>
        ),
    },
    {
        title: "Multiple Languages",
        description: "Solve problems using C++, Java and Python.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        title: "Interview Ready",
        description: "Practice coding questions frequently asked in interviews.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        ),
    },
];

const fontStack =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";
const monoStack = "'SF Mono', 'JetBrains Mono', Menlo, monospace";

const Home = () => {
    return (
        <div className="bg-black text-[#F5F5F7]" style={{ fontFamily: fontStack }}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatY {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes nodePulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                @keyframes barPulse {
                    0%, 100% { transform: scaleY(0.4); }
                    50% { transform: scaleY(1); }
                }
                @keyframes blinkCursor {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
                .fade-up { opacity: 0; animation: fadeUp 0.7s ease forwards; }
                .graph-line {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    animation: drawLine 1s ease forwards;
                }
                .graph-node { animation: nodePulse 2.4s ease-in-out infinite; }
                .code-window { animation: floatY 6s ease-in-out infinite; }
                .array-bar { animation: barPulse 1.6s ease-in-out infinite; transform-origin: bottom; }
                .type-cursor { animation: blinkCursor 1s step-start infinite; }
            `}</style>

            {/* ===================== HERO ===================== */}
            <section className="relative overflow-hidden px-6 pb-28 pt-24 lg:px-12">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-y-1/3 rounded-full bg-[#0A84FF] opacity-[0.1] blur-[140px]" />

                <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
                    {/* Left: copy */}
                    <div className="fade-up" style={{ animationDelay: "0.05s" }}>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-white/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#30D158]" />
                            Judge online — instant verdicts
                        </div>

                        <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight lg:text-6xl">
                            Practice.
                            <span className="text-[#0A84FF]"> Code.</span>
                            <br />
                            Build your future.
                        </h1>

                        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/50">
                            JudgeForge is an online coding platform where you can solve
                            problems, execute code securely inside Docker containers, and
                            prepare for technical interviews.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                to="/problems"
                                className="rounded-full bg-[#0A84FF] px-7 py-3.5 text-[15px] font-semibold text-white transition active:scale-[0.98] hover:bg-[#409CFF]"
                            >
                                Start Solving
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/[0.08]"
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>

                    {/* Right: floating code window + graph */}
                    <div className="relative fade-up" style={{ animationDelay: "0.2s" }}>
                        {/* Faint binary-tree graph drawn behind the window */}
                        <svg
                            viewBox="0 0 300 220"
                            className="pointer-events-none absolute -right-6 -top-10 h-[260px] w-[320px] opacity-40"
                        >
                            <line className="graph-line" style={{ animationDelay: "0.3s" }} x1="150" y1="20" x2="80" y2="70" stroke="#0A84FF" strokeWidth="1.5" />
                            <line className="graph-line" style={{ animationDelay: "0.4s" }} x1="150" y1="20" x2="220" y2="70" stroke="#0A84FF" strokeWidth="1.5" />
                            <line className="graph-line" style={{ animationDelay: "0.5s" }} x1="80" y1="70" x2="40" y2="130" stroke="#0A84FF" strokeWidth="1.5" />
                            <line className="graph-line" style={{ animationDelay: "0.6s" }} x1="80" y1="70" x2="110" y2="130" stroke="#0A84FF" strokeWidth="1.5" />
                            <line className="graph-line" style={{ animationDelay: "0.7s" }} x1="220" y1="70" x2="190" y2="130" stroke="#0A84FF" strokeWidth="1.5" />
                            <line className="graph-line" style={{ animationDelay: "0.8s" }} x1="220" y1="70" x2="260" y2="130" stroke="#0A84FF" strokeWidth="1.5" />

                            <circle className="graph-node" cx="150" cy="20" r="5" fill="#0A84FF" style={{ animationDelay: "0s" }} />
                            <circle className="graph-node" cx="80" cy="70" r="5" fill="#0A84FF" style={{ animationDelay: "0.2s" }} />
                            <circle className="graph-node" cx="220" cy="70" r="5" fill="#0A84FF" style={{ animationDelay: "0.4s" }} />
                            <circle className="graph-node" cx="40" cy="130" r="4" fill="#30D158" style={{ animationDelay: "0.6s" }} />
                            <circle className="graph-node" cx="110" cy="130" r="4" fill="#30D158" style={{ animationDelay: "0.8s" }} />
                            <circle className="graph-node" cx="190" cy="130" r="4" fill="#30D158" style={{ animationDelay: "1s" }} />
                            <circle className="graph-node" cx="260" cy="130" r="4" fill="#30D158" style={{ animationDelay: "1.2s" }} />
                        </svg>

                        {/* Floating code editor mockup */}
                        <div className="code-window relative rounded-2xl border border-white/10 bg-[#0D0D0F]/90 shadow-2xl shadow-black/60 backdrop-blur-xl">
                            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                                <span className="ml-3 text-[12px] text-white/40" style={{ fontFamily: monoStack }}>
                                    two_sum.cpp
                                </span>
                            </div>

                            <div className="space-y-1.5 px-5 py-6 text-[13.5px] leading-relaxed" style={{ fontFamily: monoStack }}>
                                <p><span className="text-[#FF7AB2]">vector</span>&lt;<span className="text-[#66D9EF]">int</span>&gt; <span className="text-[#7EE787]">twoSum</span>(<span className="text-[#66D9EF]">vector</span>&lt;<span className="text-[#66D9EF]">int</span>&gt;&amp; nums, <span className="text-[#66D9EF]">int</span> target) {"{"}</p>
                                <p className="pl-4">unordered_map&lt;<span className="text-[#66D9EF]">int</span>,<span className="text-[#66D9EF]">int</span>&gt; seen;</p>
                                <p className="pl-4"><span className="text-[#FF7AB2]">for</span> (<span className="text-[#66D9EF]">int</span> i = 0; i &lt; nums.size(); i++) {"{"}</p>
                                <p className="pl-8"><span className="text-[#66D9EF]">int</span> need = target - nums[i];</p>
                                <p className="pl-8"><span className="text-[#FF7AB2]">if</span> (seen.count(need))</p>
                                <p className="pl-12"><span className="text-[#FF7AB2]">return</span> {"{seen[need], i};"}</p>
                                <p className="pl-8">seen[nums[i]] = i;</p>
                                <p className="pl-4">{"}"}</p>
                                <p>
                                    {"}"}
                                    <span className="type-cursor ml-1 inline-block h-3.5 w-[7px] translate-y-[2px] bg-white/70 align-middle" />
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
                                <div className="flex items-end gap-1">
                                    {[0.5, 0.8, 0.35, 0.9, 0.6].map((h, i) => (
                                        <span
                                            key={i}
                                            className="array-bar w-1.5 rounded-sm bg-[#0A84FF]/70"
                                            style={{ height: "18px", animationDelay: `${i * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                                <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#30D158]" style={{ fontFamily: monoStack }}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#30D158]" />
                                    Accepted · 4ms
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== STATS ===================== */}
            <section className="px-6 pb-28 lg:px-12">
                <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item, i) => (
                        <div
                            key={item.title}
                            className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl"
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            <h2 className="text-4xl font-semibold tracking-tight text-[#0A84FF]">
                                {item.value}
                            </h2>
                            <p className="mt-2 text-[15px] text-white/50">{item.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===================== FEATURES ===================== */}
            <section className="px-6 pb-28 lg:px-12">
                <div className="mx-auto max-w-6xl">
                    <h2 className="fade-up mb-12 text-center text-4xl font-semibold tracking-tight">
                        Why JudgeForge?
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        {features.map((feature, i) => (
                            <div
                                key={feature.title}
                                className="fade-up group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition hover:border-[#0A84FF]/50 hover:bg-white/[0.05]"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div
                                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-[12px] transition group-hover:scale-105"
                                    style={{
                                        background:
                                            "linear-gradient(155deg, #34C7FF 0%, #0A84FF 55%, #0040DD 100%)",
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-[19px] font-semibold">{feature.title}</h3>
                                <p className="text-[15px] leading-relaxed text-white/50">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== CTA ===================== */}
            <section className="px-6 pb-28 lg:px-12">
                <div className="fade-up relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-10 py-20 text-center">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #0A84FF 0%, #0040DD 100%)",
                        }}
                    />
                    <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white opacity-10 blur-3xl" />

                    <div className="relative">
                        <h2 className="text-4xl font-semibold tracking-tight text-white">
                            Ready to become a better programmer?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-[17px] text-white/80">
                            Solve coding problems, improve your algorithmic thinking and
                            prepare for your dream job.
                        </p>
                        <Link
                            to="/problems"
                            className="mt-9 inline-block rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-[#0A84FF] transition hover:bg-white/90"
                        >
                            Explore Problems
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;