import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

import { useProblem } from "../hooks/useProblems";
import {
  useRunCode,
  useSubmit,
  useSubmission,
  useProblemSubmissions,
} from "../hooks/useSubmissions";
import { useProblemTestCases } from "../hooks/useTestCases";

import { DEFAULT_CODES } from "../constants/defaultCodes";

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";
const monoStack = "'SF Mono', 'JetBrains Mono', Menlo, monospace";

const difficultyStyles = {
  Easy: { text: "text-[#30D158]", bg: "bg-[#30D158]/10", dot: "bg-[#30D158]" },
  Medium: { text: "text-[#FF9F0A]", bg: "bg-[#FF9F0A]/10", dot: "bg-[#FF9F0A]" },
  Hard: { text: "text-[#FF453A]", bg: "bg-[#FF453A]/10", dot: "bg-[#FF453A]" },
};

const statusConfig = {
  ACCEPTED: { label: "Accepted", color: "#30D158" },
  WRONG_ANSWER: { label: "Wrong Answer", color: "#FF453A" },
  TIME_LIMIT_EXCEEDED: { label: "Time Limit Exceeded", color: "#FF9F0A" },
  MEMORY_LIMIT_EXCEEDED: { label: "Memory Limit Exceeded", color: "#FF9F0A" },
  COMPILATION_ERROR: { label: "Compilation Error", color: "#BF5AF2" },
  RUNTIME_ERROR: { label: "Runtime Error", color: "#FF6482" },
  PENDING: { label: "Pending", color: "#8B92A0", pulse: true },
  RUNNING: { label: "Running", color: "#0A84FF", pulse: true },
};

const languageLabel = { cpp: "C++", java: "Java", python: "Python" };

// Backend stores/returns memory in KB (despite the schema comment saying MB) — normalize for display everywhere.
const toMB = (kb) => (kb == null ? "-" : (kb / 1024).toFixed(2));

const defineAppleDarkTheme = (monaco) => {
  monaco.editor.defineTheme("apple-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#F5F5F7",
      "editorLineNumber.foreground": "#3A3A3C",
      "editorLineNumber.activeForeground": "#8B92A0",
      "editor.selectionBackground": "#0A84FF40",
      "editorCursor.foreground": "#0A84FF",
      "editor.lineHighlightBackground": "#FFFFFF08",
      "editorGutter.background": "#000000",
      "editorWidget.background": "#1C1C1E",
      "editorWidget.border": "#FFFFFF1A",
    },
  });
};

/* ---------- small pieces ---------- */

const VerdictBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.PENDING;
  return (
    <span
      className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
      style={{ color: cfg.color, backgroundColor: `${cfg.color}1A` }}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${cfg.pulse ? "animate-pulse" : ""}`}
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
};

const ErrorBlock = ({ errorMessage, errorDetails }) => {
  const [showDetails, setShowDetails] = useState(false);
  if (!errorMessage) return null;

  return (
    <div className="mt-4 rounded-lg border border-[#FF453A]/20 bg-[#FF453A]/[0.06] p-3.5">
      <p className="mb-1.5 text-[13px] font-semibold text-[#FF453A]">Error</p>
      <pre
        className="whitespace-pre-wrap text-[12.5px] text-[#FF453A]/80"
        style={{ fontFamily: monoStack }}
      >
        {errorMessage}
      </pre>

      {errorDetails && (
        <>
          <button
            onClick={() => setShowDetails((s) => !s)}
            className="mt-2 text-[12px] font-medium text-[#FF453A]/70 underline decoration-dotted hover:text-[#FF453A]"
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
          {showDetails && (
            <pre
              className="mt-2 max-h-40 overflow-auto rounded-lg bg-black/40 p-3 text-[11.5px] text-[#FF453A]/70"
              style={{ fontFamily: monoStack }}
            >
              {errorDetails}
            </pre>
          )}
        </>
      )}
    </div>
  );
};

const SubmissionStatCard = ({ submission }) => (
  <div className="grid grid-cols-4 gap-2 text-center">
    <div>
      <p className="text-[10.5px] text-white/40">Runtime</p>
      <p className="text-[13px] font-semibold">{submission.runtime ?? "-"}ms</p>
    </div>
    <div>
      <p className="text-[10.5px] text-white/40">Memory</p>
      <p className="text-[13px] font-semibold">{toMB(submission.memory)}MB</p>
    </div>
    <div>
      <p className="text-[10.5px] text-white/40">Passed</p>
      <p className="text-[13px] font-semibold">
        {submission.passedTestCases ?? 0}/{submission.totalTestCases ?? 0}
      </p>
    </div>
    <div>
      <p className="text-[10.5px] text-white/40">Lang</p>
      <p className="text-[13px] font-semibold uppercase">
        {languageLabel[submission.language] || submission.language}
      </p>
    </div>
  </div>
);

/* ---------- main component ---------- */

const ProblemDetails = () => {
  const { problemId } = useParams();

  const { data: problem, isLoading } = useProblem(problemId);
  const { data: sampleCases = [] } = useProblemTestCases(problemId);
  const {
      data: historyData,
      isLoading: historyLoading,
  } = useProblemSubmissions(problemId);

  const history = historyData?.submissions || [];
  const historyPagination = historyData?.pagination;
  const runMutation = useRunCode();
  const submitMutation = useSubmit();

  const [language, setLanguage] = useState("cpp");
  const [leftTab, setLeftTab] = useState("description"); // "description" | "submissions" | "current"

  const [codes, setCodes] = useState({
    cpp: DEFAULT_CODES.cpp,
    java: DEFAULT_CODES.java,
    python: DEFAULT_CODES.python,
  });

  const [runResult, setRunResult] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [activeCase, setActiveCase] = useState(0);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const { data: liveSubmission } = useSubmission(submissionId);

  const displayCases = runResult?.results?.length ? runResult.results : sampleCases;

  useEffect(() => {
    setActiveCase(0);
  }, [runResult, sampleCases.length]);

  const handleRun = async () => {
    try {
      const res = await runMutation.mutateAsync({
        problemId,
        data: { language, code: codes[language] },
      });
      setRunResult(res.data.data);
    } catch (err) {}
  };

  const handleSubmit = async () => {
    try {
      const res = await submitMutation.mutateAsync({
        problemId,
        data: { language, code: codes[language] },
      });
      setSubmissionId(res.data.data._id);
      setLeftTab("current");
    } catch (err) {}
  };

  const resetCode = () => {
    setCodes((prev) => ({ ...prev, [language]: DEFAULT_CODES[language] }));
  };

  if (isLoading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-3 bg-black"
        style={{ fontFamily: fontStack }}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
        <p className="text-[14px] text-white/40">Loading problem…</p>
      </div>
    );
  }

  const diffStyle = difficultyStyles[problem?.difficulty] || difficultyStyles.Easy;
  const activeData = displayCases[activeCase];
  const hasResults = Boolean(runResult?.results?.length);
  const runError = runMutation.isError
    ? runMutation.error?.response?.data?.message || "Failed to run code."
    : null;

  return (
    <div
      className="relative flex h-full gap-4 overflow-hidden bg-black p-4 text-[#F5F5F7]"
      style={{ fontFamily: fontStack }}
    >
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-y-1/3 rounded-full bg-[#0A84FF] opacity-[0.1] blur-[140px]" />

      {/* LEFT — Description / Submissions / Current tabs */}
      <div className="relative z-10 flex w-2/5 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        <div className="border-b border-white/10 p-5 pb-0">
          <Link
            to="/problems"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0A84FF] transition hover:text-[#409CFF]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Problems
          </Link>

          <h1 className="mt-3 text-[24px] font-semibold tracking-tight">
            {problem?.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold ${diffStyle.bg} ${diffStyle.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${diffStyle.dot}`} />
              {problem?.difficulty}
            </span>
            {problem?.timeLimit != null && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] text-white/50" style={{ fontFamily: monoStack }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {problem.timeLimit}s
              </span>
            )}
            {problem?.memoryLimit != null && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] text-white/50" style={{ fontFamily: monoStack }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 4v16M4 9h5M4 15h5" />
                </svg>
                {problem.memoryLimit}MB
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-5">
            {[
              { key: "description", label: "Description" },
              { key: "submissions", label: `Submissions${history.length ? ` (${history.length})` : ""}` },
              { key: "current", label: "Current" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setLeftTab(t.key)}
                className={`relative flex items-center gap-1.5 pb-3 text-[13.5px] font-medium transition ${
                  leftTab === t.key ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {t.label}
                {t.key === "current" && liveSubmission && statusConfig[liveSubmission.status]?.pulse && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0A84FF] animate-pulse" />
                )}
                {leftTab === t.key && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#0A84FF]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* ---- DESCRIPTION ---- */}
          {leftTab === "description" && (
            <div className="space-y-8 p-6">
              <section>
                <h2 className="mb-3 text-[15px] font-semibold text-white/40">DESCRIPTION</h2>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/80">
                  {problem?.statement}
                </p>
              </section>

              {problem?.constraints && (
                <section>
                  <h2 className="mb-3 text-[15px] font-semibold text-white/40">CONSTRAINTS</h2>
                  <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                    <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-white/70" style={{ fontFamily: monoStack }}>
                      {problem.constraints}
                    </pre>
                  </div>
                </section>
              )}

              {problem?.examples?.length > 0 && (
                <section>
                  <h2 className="mb-4 text-[15px] font-semibold text-white/40">EXAMPLES</h2>
                  <div className="space-y-4">
                    {problem.examples.map((example, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-black/60 p-4">
                        <h3 className="mb-4 text-[13px] font-semibold text-[#0A84FF]">
                          Example {index + 1}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="mb-1.5 text-[12px] font-medium text-white/40">Input</p>
                            <pre className="overflow-auto rounded-lg bg-white/[0.04] p-3 text-[13px] text-white/80" style={{ fontFamily: monoStack }}>
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <p className="mb-1.5 text-[12px] font-medium text-white/40">Output</p>
                            <pre className="overflow-auto rounded-lg bg-white/[0.04] p-3 text-[13px] text-white/80" style={{ fontFamily: monoStack }}>
                              {example.output}
                            </pre>
                          </div>
                          {example.explanation && (
                            <div>
                              <p className="mb-1.5 text-[12px] font-medium text-white/40">Explanation</p>
                              <p className="text-[13.5px] leading-relaxed text-white/60">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ---- SUBMISSIONS (history only) ---- */}
          {leftTab === "submissions" && (
            <div className="space-y-3 p-5">
              {historyLoading && (
                <div className="flex justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
                </div>
              )}

              {!historyLoading && history.length === 0 && (
                <div className="py-16 text-center text-[13.5px] text-white/40">
                  No submissions yet for this problem.
                </div>
              )}

              {!historyLoading &&
                history.map((sub) => {
                  const expanded = expandedHistoryId === sub._id;
                  return (
                    <div
                      key={sub._id}
                      className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                    >
                      <button
                        onClick={() => setExpandedHistoryId(expanded ? null : sub._id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/[0.03]"
                      >
                        <div className="flex items-center gap-3">
                          <VerdictBadge status={sub.status} />
                          <span className="text-[12px] text-white/40" style={{ fontFamily: monoStack }}>
                            {languageLabel[sub.language] || sub.language}
                          </span>
                        </div>
                        <span className="text-[11.5px] text-white/35">
                          {new Date(sub.createdAt).toLocaleString()}
                        </span>
                      </button>

                      {expanded && (
                        <div className="border-t border-white/10 px-4 py-3">
                          <SubmissionStatCard submission={sub} />
                          <ErrorBlock errorMessage={sub.errorMessage} errorDetails={sub.errorDetails} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* ---- CURRENT (this session's live submission) ---- */}
          {leftTab === "current" && (
            <div className="p-5">
              {liveSubmission ? (
                <div className="rounded-xl border border-[#0A84FF]/30 bg-[#0A84FF]/[0.06] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-white/50">
                      Submitted {new Date(liveSubmission.createdAt).toLocaleTimeString()}
                    </span>
                    <VerdictBadge status={liveSubmission.status} />
                  </div>
                  <SubmissionStatCard submission={liveSubmission} />
                  <ErrorBlock
                    errorMessage={liveSubmission.errorMessage}
                    errorDetails={liveSubmission.errorDetails}
                  />
                </div>
              ) : (
                <div className="py-16 text-center text-[13.5px] text-white/40">
                  Nothing submitted this session yet — hit Submit to see the live verdict here.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — editor + run panel only */}
      <div className="relative z-10 flex w-3/5 flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1">
            {["cpp", "java", "python"].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                  language === lang ? "bg-[#0A84FF] text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {languageLabel[lang]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetCode}
              className="rounded-full border border-white/10 px-3.5 py-2 text-[13px] font-medium text-white/60 transition hover:bg-white/[0.06]"
            >
              Reset
            </button>
            <button
              onClick={handleRun}
              disabled={runMutation.isPending}
              className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {runMutation.isPending ? "Running…" : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="rounded-full bg-[#0A84FF] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#409CFF] disabled:cursor-not-allowed disabled:bg-[#0A84FF]/30"
            >
              {submitMutation.isPending ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="apple-dark"
            beforeMount={defineAppleDarkTheme}
            value={codes[language]}
            onChange={(value) => setCodes((prev) => ({ ...prev, [language]: value ?? "" }))}
            options={{
              automaticLayout: true,
              fontSize: 14.5,
              fontFamily: monoStack,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              tabSize: 4,
              wordWrap: "on",
              smoothScrolling: true,
              cursorBlinking: "smooth",
            }}
          />
        </div>

        {/* Bottom panel — RUN ONLY */}
        <div className="flex h-72 flex-col border-t border-white/10 bg-black/50">
          {runError && (
            <div className="p-5 pb-0">
              <ErrorBlock errorMessage={runError} errorDetails={runMutation.error?.response?.data?.errorDetails} />
            </div>
          )}

          {displayCases.length > 0 ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {displayCases.map((c, i) => {
                    const status = c.status;
                    const color = status === "PASSED" ? "#30D158" : status === "FAILED" ? "#FF453A" : null;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveCase(i)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                          activeCase === i ? "bg-white/10 text-white" : "text-white/45 hover:text-white/80"
                        }`}
                      >
                        {color && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />}
                        Case {i + 1}
                      </button>
                    );
                  })}
                </div>

                {hasResults && (
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold"
                    style={{
                      color: runResult.passed === runResult.total ? "#30D158" : "#FF453A",
                      backgroundColor: runResult.passed === runResult.total ? "#30D15818" : "#FF453A18",
                    }}
                  >
                    {runResult.passed}/{runResult.total} passed
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-auto p-5">
                {activeData && (
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1.5 text-[11.5px] font-medium text-white/40">INPUT</p>
                      <pre className="overflow-auto rounded-lg bg-white/[0.04] p-3 text-[13px] text-white/80" style={{ fontFamily: monoStack }}>
                        {activeData.input}
                      </pre>
                    </div>
                    <div>
                      <p className="mb-1.5 text-[11.5px] font-medium text-white/40">EXPECTED OUTPUT</p>
                      <pre className="overflow-auto rounded-lg bg-white/[0.04] p-3 text-[13px] text-white/80" style={{ fontFamily: monoStack }}>
                        {activeData.expectedOutput}
                      </pre>
                    </div>
                    {hasResults && (
                      <div>
                        <p className="mb-1.5 text-[11.5px] font-medium text-white/40">YOUR OUTPUT</p>
                        <pre
                          className="overflow-auto rounded-lg p-3 text-[13px]"
                          style={{
                            fontFamily: monoStack,
                            backgroundColor: activeData.status === "PASSED" ? "#30D15812" : "#FF453A12",
                            color: activeData.status === "PASSED" ? "#7FE0A0" : "#FF9B93",
                          }}
                        >
                          {activeData.actualOutput}
                        </pre>
                        <div className="mt-2.5 flex gap-5 text-[12px] text-white/40" style={{ fontFamily: monoStack }}>
                          <span>Runtime: {activeData.runtime}ms</span>
                          <span>Memory: {toMB(activeData.memory)}MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            !runError && (
              <div className="flex flex-1 items-center justify-center text-[14px] text-white/30">
                Run your code to see sample test results.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;