import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMySubmissions } from "../hooks/useSubmissions";

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";
const monoStack = "'SF Mono', 'JetBrains Mono', Menlo, monospace";

const statusConfig = {
  ACCEPTED: { label: "Accepted", color: "#30D158", pulse: false },
  WRONG_ANSWER: { label: "Wrong Answer", color: "#FF453A", pulse: false },
  TIME_LIMIT_EXCEEDED: { label: "Time Limit Exceeded", color: "#FF9F0A", pulse: false },
  MEMORY_LIMIT_EXCEEDED: { label: "Memory Limit Exceeded", color: "#FF9F0A", pulse: false },
  COMPILATION_ERROR: { label: "Compilation Error", color: "#BF5AF2", pulse: false },
  RUNTIME_ERROR: { label: "Runtime Error", color: "#FF6482", pulse: false },
  PENDING: { label: "Pending", color: "#8B92A0", pulse: true },
  RUNNING: { label: "Running", color: "#0A84FF", pulse: true },
};

const languageLabel = { cpp: "C++", java: "Java", python: "Python", javascript: "JavaScript" };

const PAGE_SIZE = 10;

// Backend stores memory in KB — convert for display
const toMB = (kb) => (kb == null ? "-" : (kb / 1024).toFixed(2));

const Submissions = () => {
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useMySubmissions({
    status,
    language,
    page,
    limit: PAGE_SIZE,
  });

  const submissions = data?.submissions ?? [];
  const pagination = data?.pagination;

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [status, language]);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-[#F5F5F7] lg:px-10"
      style={{ fontFamily: fontStack }}
    >
      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes softPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.35; }
                }
                .fade-up { opacity: 0; animation: fadeUp 0.6s ease forwards; }
                .status-pulse { animation: softPulse 1.4s ease-in-out infinite; }
            `}</style>

      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-y-1/3 rounded-full bg-[#0A84FF] opacity-[0.1] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="fade-up mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">My Submissions</h1>
          <p className="mt-2 text-[15px] text-white/50">
            View all your previous submissions.
          </p>
        </div>

        {/* Filters */}
        <div
          className="fade-up mb-6 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-full border border-white/10 bg-[#1C1C1E] py-2.5 pl-4 pr-10 text-[13.5px] text-white outline-none transition focus:border-[#0A84FF]/60"
            >
              <option value="">All Status</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="WRONG_ANSWER">Wrong Answer</option>
              <option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</option>
              <option value="MEMORY_LIMIT_EXCEEDED">Memory Limit Exceeded</option>
              <option value="COMPILATION_ERROR">Compilation Error</option>
              <option value="RUNTIME_ERROR">Runtime Error</option>
              <option value="PENDING">Pending</option>
              <option value="RUNNING">Running</option>
            </select>
            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none rounded-full border border-white/10 bg-[#1C1C1E] py-2.5 pl-4 pr-10 text-[13.5px] text-white outline-none transition focus:border-[#0A84FF]/60"
            >
              <option value="">All Languages</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {(status || language) && (
            <button
              onClick={() => {
                setStatus("");
                setLanguage("");
              }}
              className="text-[13px] font-medium text-white/40 transition hover:text-white/70 sm:ml-1 sm:self-center"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* States */}
        {isLoading && (
          <div className="fade-up flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
            <p className="text-[14px] text-white/40">Loading submissions…</p>
          </div>
        )}

        {isError && (
          <div className="fade-up flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/[0.06] py-24">
            <p className="text-[15px] font-medium text-[#FF453A]">Couldn't load submissions</p>
            <p className="text-[13px] text-white/40">Check your connection and try again.</p>
          </div>
        )}

        {!isLoading && !isError && submissions.length === 0 && (
          <div className="fade-up flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-24">
            <p className="text-[15px] font-medium text-white/70">No submissions found</p>
            <p className="text-[13px] text-white/40">
              {status || language
                ? "Try a different filter combination."
                : "Solve a problem to see your submission history here."}
            </p>
          </div>
        )}

        {/* Table (desktop) */}
        {!isLoading && !isError && submissions.length > 0 && (
          <div
            className="fade-up hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl md:block"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="grid grid-cols-[1.4fr_1.6fr_0.7fr_0.8fr_0.8fr_0.8fr_1fr] items-center gap-4 border-b border-white/10 px-6 py-3.5 text-[11.5px] font-medium tracking-wide text-white/40">
              <span>VERDICT</span>
              <span>PROBLEM</span>
              <span className="text-center">LANG</span>
              <span className="text-center">RUNTIME</span>
              <span className="text-center">MEMORY</span>
              <span className="text-center">PASSED</span>
              <span className="text-right">DATE</span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {submissions.map((submission) => {
                const cfg = statusConfig[submission.status] || statusConfig.PENDING;
                const ratio =
                  submission.totalTestCases > 0
                    ? submission.passedTestCases / submission.totalTestCases
                    : 0;

                return (
                  <Link
                    to={`/submissions/${submission._id}`}
                    key={submission._id}
                    className="grid grid-cols-[1.4fr_1.6fr_0.7fr_0.8fr_0.8fr_0.8fr_1fr] items-center gap-4 px-6 py-4 transition hover:bg-white/[0.04]"
                  >
                    <span
                      className="flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                      style={{ color: cfg.color, backgroundColor: `${cfg.color}1A` }}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${cfg.pulse ? "status-pulse" : ""}`}
                        style={{ backgroundColor: cfg.color }}
                      />
                      {cfg.label}
                    </span>

                    <span className="truncate text-[14px] font-medium text-white/90">
                      {submission.problemId?.title}
                    </span>

                    <span className="text-center text-[12.5px] font-medium text-white/60" style={{ fontFamily: monoStack }}>
                      {languageLabel[submission.language] || submission.language}
                    </span>

                    <span className="text-center text-[13px] text-white/60" style={{ fontFamily: monoStack }}>
                      {submission.runtime} ms
                    </span>

                    <span className="text-center text-[13px] text-white/60" style={{ fontFamily: monoStack }}>
                      {toMB(submission.memory)} MB
                    </span>

                    <span className="flex flex-col items-center gap-1">
                      <span className="text-[13px] text-white/70" style={{ fontFamily: monoStack }}>
                        {submission.passedTestCases}/{submission.totalTestCases}
                      </span>
                      <span className="h-1 w-12 overflow-hidden rounded-full bg-white/10">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${ratio * 100}%`, backgroundColor: cfg.color }}
                        />
                      </span>
                    </span>

                    <span className="text-right text-[12.5px] text-white/40">
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Cards (mobile) */}
        {!isLoading && !isError && submissions.length > 0 && (
          <div className="fade-up space-y-3 md:hidden" style={{ animationDelay: "0.1s" }}>
            {submissions.map((submission) => {
              const cfg = statusConfig[submission.status] || statusConfig.PENDING;
              return (
                <Link
                  to={`/submissions/${submission._id}`}
                  key={submission._id}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                      style={{ color: cfg.color, backgroundColor: `${cfg.color}1A` }}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${cfg.pulse ? "status-pulse" : ""}`}
                        style={{ backgroundColor: cfg.color }}
                      />
                      {cfg.label}
                    </span>
                    <span className="text-[11px] text-white/35">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mb-2 text-[14.5px] font-medium text-white/90">
                    {submission.problemId?.title}
                  </p>

                  <div className="flex items-center gap-3 text-[12.5px] text-white/50" style={{ fontFamily: monoStack }}>
                    <span>{languageLabel[submission.language] || submission.language}</span>
                    <span>·</span>
                    <span>{submission.runtime}ms</span>
                    <span>·</span>
                    <span>{toMB(submission.memory)}MB</span>
                    <span>·</span>
                    <span>{submission.passedTestCases}/{submission.totalTestCases}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && pagination && pagination.totalPages > 1 && (
          <div
            className="fade-up mt-6 flex items-center justify-between"
            style={{ animationDelay: "0.15s" }}
          >
            <p className="text-[13px] text-white/40">
              Page {pagination.currentPage} of {pagination.totalPages}
              <span className="hidden sm:inline">
                {" "}· {pagination.totalSubmissions} total
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1C1C1E] text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <span className="min-w-[40px] rounded-full bg-[#0A84FF] px-4 py-2 text-center text-[13px] font-semibold text-white">
                {pagination.currentPage}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1C1C1E] text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;