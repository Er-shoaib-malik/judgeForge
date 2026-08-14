import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useSubmission } from "../hooks/useSubmissions";

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";
const monoStack = "'SF Mono', 'JetBrains Mono', Menlo, monospace";

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

const difficultyStyles = {
  Easy: { text: "text-[#30D158]", bg: "bg-[#30D158]/10", dot: "bg-[#30D158]" },
  Medium: { text: "text-[#FF9F0A]", bg: "bg-[#FF9F0A]/10", dot: "bg-[#FF9F0A]" },
  Hard: { text: "text-[#FF453A]", bg: "bg-[#FF453A]/10", dot: "bg-[#FF453A]" },
};

const languageLabel = { cpp: "C++", java: "Java", python: "Python", javascript: "JavaScript" };
const monacoLangMap = { cpp: "cpp", java: "java", python: "python", javascript: "javascript" };

// Backend stores memory in KB — convert for display
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
      "editor.lineHighlightBackground": "#FFFFFF00",
      "editorGutter.background": "#000000",
    },
  });
};

const StatCard = ({ label, value, sub, color }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-[11.5px] font-medium text-white/40">{label}</p>
    <p className="mt-1.5 text-[20px] font-semibold" style={color ? { color } : undefined}>
      {value}
      {sub && <span className="ml-1 text-[12px] font-normal text-white/40">{sub}</span>}
    </p>
  </div>
);

const SubmissionDetails = () => {
  const { submissionId } = useParams();
  const { data: submission, isLoading, isError } = useSubmission(submissionId);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!submission?.code) return;
    navigator.clipboard.writeText(submission.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black"
        style={{ fontFamily: fontStack }}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
        <p className="text-[14px] text-white/40">Loading submission…</p>
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center"
        style={{ fontFamily: fontStack }}
      >
        <p className="text-[16px] font-medium text-[#FF453A]">
          Couldn't load this submission
        </p>
        <p className="text-[13.5px] text-white/40">
          It may not exist, or you may not have access to it.
        </p>
        <Link
          to="/submissions"
          className="mt-3 rounded-full bg-[#0A84FF] px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#409CFF]"
        >
          Back to Submissions
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[submission.status] || statusConfig.PENDING;
  const diffStyle = difficultyStyles[submission.problemId?.difficulty] || difficultyStyles.Easy;
  const ratio =
    submission.totalTestCases > 0
      ? submission.passedTestCases / submission.totalTestCases
      : 0;

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
        .fade-up { opacity: 0; animation: fadeUp 0.6s ease forwards; }
      `}</style>

      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-y-1/3 rounded-full bg-[#0A84FF] opacity-[0.1] blur-[140px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          to="/submissions"
          className="fade-up mb-6 inline-flex items-center gap-1 text-[13px] font-medium text-[#0A84FF] transition hover:text-[#409CFF]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Submissions
        </Link>

        {/* Header */}
        <div className="fade-up mb-6" style={{ animationDelay: "0.05s" }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                to={`/problems/${submission.problemId?._id}`}
                className="text-[26px] font-semibold tracking-tight text-white transition hover:text-[#0A84FF]"
              >
                {submission.problemId?.title || "Unknown Problem"}
              </Link>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {submission.problemId?.difficulty && (
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${diffStyle.bg} ${diffStyle.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${diffStyle.dot}`} />
                    {submission.problemId.difficulty}
                  </span>
                )}
                <span className="text-[12.5px] text-white/40">
                  Submitted {new Date(submission.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <span
              className="flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"
              style={{ color: cfg.color, backgroundColor: `${cfg.color}1A` }}
            >
              <span
                className={`h-2 w-2 rounded-full ${cfg.pulse ? "animate-pulse" : ""}`}
                style={{ backgroundColor: cfg.color }}
              />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div
          className="fade-up mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          style={{ animationDelay: "0.1s" }}
        >
          <StatCard label="Runtime" value={submission.runtime ?? "-"} sub="ms" />
          <StatCard label="Memory" value={toMB(submission.memory)} sub="MB" />
          <StatCard
            label="Test Cases"
            value={`${submission.passedTestCases ?? 0}/${submission.totalTestCases ?? 0}`}
          />
          <StatCard
            label="Language"
            value={languageLabel[submission.language] || submission.language}
          />
        </div>

        {/* Pass ratio bar */}
        {submission.totalTestCases > 0 && (
          <div
            className="fade-up mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="mb-2 flex items-center justify-between text-[12.5px]">
              <span className="text-white/40">Test cases passed</span>
              <span className="font-medium text-white/70">
                {Math.round(ratio * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${ratio * 100}%`, backgroundColor: cfg.color }}
              />
            </div>
          </div>
        )}

        {/* Error block */}
        {submission.errorMessage && (
          <div
            className="fade-up mb-6 rounded-xl border border-[#FF453A]/20 bg-[#FF453A]/[0.06] p-5"
            style={{ animationDelay: "0.14s" }}
          >
            <p className="mb-2 text-[13.5px] font-semibold text-[#FF453A]">Error</p>
            <pre
              className="whitespace-pre-wrap text-[13px] text-[#FF453A]/85"
              style={{ fontFamily: monoStack }}
            >
              {submission.errorMessage}
            </pre>

            {submission.errorDetails && (
              <details className="mt-3">
                <summary className="cursor-pointer text-[12.5px] font-medium text-[#FF453A]/70 hover:text-[#FF453A]">
                  Show details
                </summary>
                <pre
                  className="mt-2 max-h-64 overflow-auto rounded-lg bg-black/40 p-3 text-[12px] text-[#FF453A]/70"
                  style={{ fontFamily: monoStack }}
                >
                  {submission.errorDetails}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Code */}
        <div
          className="fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          style={{ animationDelay: "0.16s" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span
                className="ml-2 text-[12.5px] text-white/40"
                style={{ fontFamily: monoStack }}
              >
                solution.{submission.language === "python" ? "py" : submission.language === "java" ? "java" : submission.language === "javascript" ? "js" : "cpp"}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12.5px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              {copied ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[#30D158]">Copied</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          <div style={{ height: "480px" }}>
            <Editor
              height="100%"
              language={monacoLangMap[submission.language] || "plaintext"}
              theme="apple-dark"
              beforeMount={defineAppleDarkTheme}
              value={submission.code}
              options={{
                readOnly: true,
                domReadOnly: true,
                fontSize: 14,
                fontFamily: monoStack,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                wordWrap: "on",
                renderLineHighlight: "none",
                lineNumbersMinChars: 3,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;