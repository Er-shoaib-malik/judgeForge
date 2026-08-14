import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProblems } from "../hooks/useProblems";

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";

const difficulties = ["All", "Easy", "Medium", "Hard"];

const difficultyStyles = {
  Easy: {
    text: "text-[#30D158]",
    dot: "bg-[#30D158]",
    bg: "bg-[#30D158]/10",
  },
  Medium: {
    text: "text-[#FF9F0A]",
    dot: "bg-[#FF9F0A]",
    bg: "bg-[#FF9F0A]/10",
  },
  Hard: {
    text: "text-[#FF453A]",
    dot: "bg-[#FF453A]",
    bg: "bg-[#FF453A]/10",
  },
};

const Problems = () => {
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [difficulty, setDifficulty] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useProblems({
    page,
    limit,
    search: debouncedSearch,
    difficulty,
  });

  const problems = data?.problems || [];

  const pagination = data?.pagination;

  return (
    <div
      className="min-h-screen bg-black px-6 py-16 text-[#F5F5F7] lg:px-10"
      style={{ fontFamily: fontStack }}
    >
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-y-1/3 rounded-full bg-[#0A84FF] opacity-[0.1] blur-[140px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">Problems</h1>

          <p className="mt-2 text-[15px] text-white/50">
            Solve coding problems and improve your DSA skills.
          </p>
        </div>
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              className="w-full rounded-full border border-white/10 bg-[#1C1C1E] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder-white/30 outline-none transition focus:border-[#0A84FF]/60 focus:ring-4 focus:ring-[#0A84FF]/20"
            />
          </div>

          <div className="flex w-fit items-center gap-1 rounded-full border border-white/10 bg-[#1C1C1E] p-1">
            {difficulties.map((d) => {
              const value = d === "All" ? "" : d;

              const active = difficulty === value;

              return (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(value);

                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                    active
                      ? "bg-[#0A84FF] text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>{" "}
        {/* States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
            <p className="text-[14px] text-white/40">Loading problems...</p>
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/[0.06] py-24">
            <p className="text-[15px] font-medium text-[#FF453A]">
              Couldn't load problems
            </p>

            <p className="text-[13px] text-white/40">
              Check your connection and try again.
            </p>
          </div>
        )}
        {!isLoading && !isError && problems.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-24">
            <p className="text-[15px] font-medium text-white/70">
              No problems found
            </p>

            <p className="text-[13px] text-white/40">
              Try changing your search or difficulty filter.
            </p>
          </div>
        )}
        {!isLoading && !isError && problems.length > 0 && (
          <>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <div className="hidden grid-cols-[28px_1fr_120px_1.2fr] items-center gap-4 border-b border-white/10 px-6 py-3.5 text-[12px] font-medium tracking-wide text-white/40 md:grid">
                <span></span>

                <span>TITLE</span>

                <span className="text-center">DIFFICULTY</span>

                <span>TAGS</span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {problems.map((problem) => {
                  const style =
                    difficultyStyles[problem.difficulty] ||
                    difficultyStyles.Easy;

                  return (
                    <Link
                      key={problem._id}
                      to={`/problems/${problem._id}`}
                      className="grid grid-cols-[28px_1fr_auto] items-center gap-4 px-6 py-4 transition hover:bg-white/[0.04] md:grid-cols-[28px_1fr_120px_1.2fr]"
                    >
                      <span className="h-2 w-2 rounded-full bg-white/20" />

                      <span className="truncate text-[14.5px] font-medium text-white/90">
                        {problem.title}
                      </span>

                      <span
                        className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${style.bg} ${style.text} md:mx-auto`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />

                        {problem.difficulty}
                      </span>

                      <div className="hidden flex-wrap gap-1.5 md:flex">
                        {problem.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}

            {pagination && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="rounded-lg border border-white/10 px-5 py-2 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-sm text-white/70">
                    Page{" "}
                    <span className="font-semibold text-white">
                      {pagination.currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-white">
                      {pagination.totalPages}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {pagination.totalProblems} Problems
                  </p>
                </div>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage}
                  className="rounded-lg border border-white/10 px-5 py-2 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Problems;
