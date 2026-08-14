import { useState } from "react";
import {
    useProblems,
    useCreateProblem,
    useUpdateProblem,
    useDeleteProblem,
} from "../hooks/useProblems";
import {
    useProblemTestCases,
    useAddTestCase,
    useUpdateTestCase,
    useDeleteTestCase,
} from "../hooks/useTestCases";

const fontStack =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif";
const monoStack = "'SF Mono', 'JetBrains Mono', Menlo, monospace";

const difficultyStyles = {
    Easy: { text: "text-[#30D158]", bg: "bg-[#30D158]/10", dot: "bg-[#30D158]" },
    Medium: { text: "text-[#FF9F0A]", bg: "bg-[#FF9F0A]/10", dot: "bg-[#FF9F0A]" },
    Hard: { text: "text-[#FF453A]", bg: "bg-[#FF453A]/10", dot: "bg-[#FF453A]" },
};

const emptyProblemForm = {
    title: "",
    difficulty: "Easy",
    statement: "",
    constraints: "",
    timeLimit: 2,
    memoryLimit: 256,
    examples: [{ input: "", output: "", explanation: "" }],
};

const emptyTestCaseForm = { input: "", expectedOutput: "", hidden: true };

/* ---------- shared bits ---------- */

const Modal = ({ title, onClose, children, wide }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div
            className={`max-h-[88vh] w-full ${wide ? "max-w-2xl" : "max-w-md"} overflow-auto rounded-2xl border border-white/10 bg-[#141416] shadow-2xl shadow-black/60`}
        >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#141416]/95 px-6 py-4 backdrop-blur-xl">
                <h3 className="text-[16px] font-semibold">{title}</h3>
                <button
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

const Field = ({ label, children }) => (
    <div>
        <label className="mb-1.5 block text-[13px] font-medium text-white/50">
            {label}
        </label>
        {children}
    </div>
);

const inputCls =
    "w-full rounded-xl border border-white/10 bg-[#1C1C1E] px-3.5 py-2.5 text-[14px] text-[#F5F5F7] placeholder-white/25 outline-none transition focus:border-[#0A84FF]/60 focus:ring-4 focus:ring-[#0A84FF]/20";

const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
            checked ? "bg-[#0A84FF]" : "bg-white/15"
        }`}
    >
        <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                checked ? "translate-x-5" : "translate-x-0.5"
            }`}
        />
    </button>
);

/* ---------- main component ---------- */

const Admin = () => {
    const [tab, setTab] = useState("problems"); // "problems" | "testcases"

    const {
        data,
        isLoading,
        isError,
    } = useProblems({
        page: 1,
        limit: 1000,
    });

    const problems = data?.problems || [];
    const pagination = data?.pagination;    const createProblem = useCreateProblem();
    const updateProblem = useUpdateProblem();
    const deleteProblem = useDeleteProblem();

    const [problemModal, setProblemModal] = useState(null); // null | "create" | problem object
    const [problemForm, setProblemForm] = useState(emptyProblemForm);
    const [confirmDeleteProblem, setConfirmDeleteProblem] = useState(null);

    const [selectedProblemId, setSelectedProblemId] = useState("");
    const { data: testCases = [], isLoading: tcLoading } = useProblemTestCases(selectedProblemId);
    const addTestCase = useAddTestCase();
    const updateTestCase = useUpdateTestCase();
    const deleteTestCase = useDeleteTestCase();

    const [tcModal, setTcModal] = useState(null); // null | "create" | testcase object
    const [tcForm, setTcForm] = useState(emptyTestCaseForm);
    const [confirmDeleteTc, setConfirmDeleteTc] = useState(null);

    const stats = {
        total: problems.length,
        easy: problems.filter((p) => p.difficulty === "Easy").length,
        medium: problems.filter((p) => p.difficulty === "Medium").length,
        hard: problems.filter((p) => p.difficulty === "Hard").length,
    };

    /* ---- problem form handlers ---- */

    const openCreateProblem = () => {
        setProblemForm(emptyProblemForm);
        setProblemModal("create");
    };

    const openEditProblem = (problem) => {
        setProblemForm({
            title: problem.title || "",
            difficulty: problem.difficulty || "Easy",
            statement: problem.statement || "",
            constraints: problem.constraints || "",
            timeLimit: problem.timeLimit ?? 2,
            memoryLimit: problem.memoryLimit ?? 256,
            examples:
                problem.examples?.length > 0
                    ? problem.examples
                    : [{ input: "", output: "", explanation: "" }],
        });
        setProblemModal(problem);
    };

    const updateExample = (index, field, value) => {
        setProblemForm((prev) => {
            const examples = [...prev.examples];
            examples[index] = { ...examples[index], [field]: value };
            return { ...prev, examples };
        });
    };

    const addExampleRow = () =>
        setProblemForm((prev) => ({
            ...prev,
            examples: [...prev.examples, { input: "", output: "", explanation: "" }],
        }));

    const removeExampleRow = (index) =>
        setProblemForm((prev) => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index),
        }));

    const submitProblemForm = async (e) => {
        e.preventDefault();
        const payload = {
            ...problemForm,
            timeLimit: Number(problemForm.timeLimit),
            memoryLimit: Number(problemForm.memoryLimit),
        };
        try {
            if (problemModal === "create") {
                await createProblem.mutateAsync(payload);
            } else {
                await updateProblem.mutateAsync({
                    problemId: problemModal._id,
                    data: payload,
                });
            }
            setProblemModal(null);
        } catch (err) {}
    };

    const confirmDelete = async () => {
        try {
            await deleteProblem.mutateAsync(confirmDeleteProblem._id);
            if (selectedProblemId === confirmDeleteProblem._id) setSelectedProblemId("");
            setConfirmDeleteProblem(null);
        } catch (err) {}
    };

    /* ---- testcase form handlers ---- */

    const openCreateTc = () => {
        setTcForm(emptyTestCaseForm);
        setTcModal("create");
    };

    const openEditTc = (tc) => {
        setTcForm({ input: tc.input, expectedOutput: tc.expectedOutput, hidden: tc.hidden });
        setTcModal(tc);
    };

    const submitTcForm = async (e) => {
        e.preventDefault();
        try {
            if (tcModal === "create") {
                await addTestCase.mutateAsync({ problemId: selectedProblemId, data: tcForm });
            } else {
                await updateTestCase.mutateAsync({ testcaseId: tcModal._id, data: tcForm });
            }
            setTcModal(null);
        } catch (err) {}
    };

    const confirmDeleteTcNow = async () => {
        try {
            await deleteTestCase.mutateAsync(confirmDeleteTc._id);
            setConfirmDeleteTc(null);
        } catch (err) {}
    };

    return (
        <div
            className="mx-auto max-w-6xl px-8 py-10 text-[#F5F5F7]"
            style={{ fontFamily: fontStack }}
        >
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform: translateY(12px);} to { opacity:1; transform: translateY(0);} }
                .fade-up { opacity:0; animation: fadeUp 0.5s ease forwards; }
            `}</style>

            {/* Header */}
            <div className="fade-up mb-8">
                <h1 className="text-4xl font-semibold tracking-tight">Admin Dashboard</h1>
                <p className="mt-2 text-[15px] text-white/50">
                    Manage problems and test cases.
                </p>
            </div>

            {/* Stats */}
            <div className="fade-up mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4" style={{ animationDelay: "0.05s" }}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[12px] text-white/40">Total Problems</p>
                    <p className="mt-1 text-3xl font-semibold">{stats.total}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[12px] text-white/40">Easy</p>
                    <p className="mt-1 text-3xl font-semibold text-[#30D158]">{stats.easy}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[12px] text-white/40">Medium</p>
                    <p className="mt-1 text-3xl font-semibold text-[#FF9F0A]">{stats.medium}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[12px] text-white/40">Hard</p>
                    <p className="mt-1 text-3xl font-semibold text-[#FF453A]">{stats.hard}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="fade-up mb-6 flex w-fit items-center gap-1 rounded-full border border-white/10 bg-[#1C1C1E] p-1" style={{ animationDelay: "0.08s" }}>
                <button
                    onClick={() => setTab("problems")}
                    className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition ${
                        tab === "problems" ? "bg-[#0A84FF] text-white" : "text-white/50 hover:text-white"
                    }`}
                >
                    Problems
                </button>
                <button
                    onClick={() => setTab("testcases")}
                    className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition ${
                        tab === "testcases" ? "bg-[#0A84FF] text-white" : "text-white/50 hover:text-white"
                    }`}
                >
                    Test Cases
                </button>
            </div>

            {/* ===================== PROBLEMS TAB ===================== */}
            {tab === "problems" && (
                <div className="fade-up" style={{ animationDelay: "0.1s" }}>
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={openCreateProblem}
                            className="flex items-center gap-1.5 rounded-full bg-[#0A84FF] px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#409CFF]"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Problem
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/[0.06] py-16 text-center text-[#FF453A]">
                            Failed to load problems.
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <div className="grid grid-cols-[1fr_110px_90px_90px_110px] items-center gap-4 border-b border-white/10 px-5 py-3.5 text-[11.5px] font-medium tracking-wide text-white/40">
                                <span>TITLE</span>
                                <span className="text-center">DIFFICULTY</span>
                                <span className="text-center">TIME</span>
                                <span className="text-center">MEMORY</span>
                                <span className="text-right">ACTIONS</span>
                            </div>
                            <div className="divide-y divide-white/[0.06]">
                                {problems.map((p) => {
                                    const s = difficultyStyles[p.difficulty] || difficultyStyles.Easy;
                                    return (
                                        <div
                                            key={p._id}
                                            className="grid grid-cols-[1fr_110px_90px_90px_110px] items-center gap-4 px-5 py-3.5"
                                        >
                                            <span className="truncate text-[14px] font-medium text-white/90">
                                                {p.title}
                                            </span>
                                            <span className={`mx-auto flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${s.bg} ${s.text}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                                {p.difficulty}
                                            </span>
                                            <span className="text-center text-[12.5px] text-white/50" style={{ fontFamily: monoStack }}>
                                                {p.timeLimit}s
                                            </span>
                                            <span className="text-center text-[12.5px] text-white/50" style={{ fontFamily: monoStack }}>
                                                {p.memoryLimit}MB
                                            </span>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditProblem(p)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteProblem(p)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF453A]/10 text-[#FF453A] transition hover:bg-[#FF453A]/20"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {problems.length === 0 && (
                                    <div className="py-16 text-center text-[14px] text-white/40">
                                        No problems yet — create your first one.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ===================== TEST CASES TAB ===================== */}
            {tab === "testcases" && (
                <div className="fade-up" style={{ animationDelay: "0.1s" }}>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative sm:max-w-xs sm:flex-1">
                            <select
                                value={selectedProblemId}
                                onChange={(e) => setSelectedProblemId(e.target.value)}
                                className="w-full appearance-none rounded-full border border-white/10 bg-[#1C1C1E] py-2.5 pl-4 pr-10 text-[13.5px] text-white outline-none transition focus:border-[#0A84FF]/60"
                            >
                                <option value="">Select a problem…</option>
                                {problems.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>

                        <button
                            onClick={openCreateTc}
                            disabled={!selectedProblemId}
                            className="flex items-center justify-center gap-1.5 rounded-full bg-[#0A84FF] px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#409CFF] disabled:cursor-not-allowed disabled:bg-[#0A84FF]/30"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Test Case
                        </button>
                    </div>

                    {!selectedProblemId && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center text-[14px] text-white/40">
                            Select a problem to manage its test cases.
                        </div>
                    )}

                    {selectedProblemId && tcLoading && (
                        <div className="flex justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-16">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#0A84FF]" />
                        </div>
                    )}

                    {selectedProblemId && !tcLoading && (
                        <div className="space-y-3">
                            {testCases.length === 0 && (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center text-[14px] text-white/40">
                                    No test cases for this problem yet.
                                </div>
                            )}

                            {testCases.map((tc, i) => (
                                <div
                                    key={tc._id}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] font-semibold text-white/70">
                                                Case {i + 1}
                                            </span>
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                                    tc.hidden
                                                        ? "bg-[#BF5AF2]/10 text-[#BF5AF2]"
                                                        : "bg-[#30D158]/10 text-[#30D158]"
                                                }`}
                                            >
                                                {tc.hidden ? "Hidden" : "Sample"}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditTc(tc)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteTc(tc)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF453A]/10 text-[#FF453A] transition hover:bg-[#FF453A]/20"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="mb-1 text-[11.5px] font-medium text-white/40">INPUT</p>
                                            <pre className="overflow-auto rounded-lg bg-black/50 p-3 text-[12.5px] text-white/70" style={{ fontFamily: monoStack }}>
                                                {tc.input}
                                            </pre>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[11.5px] font-medium text-white/40">EXPECTED OUTPUT</p>
                                            <pre className="overflow-auto rounded-lg bg-black/50 p-3 text-[12.5px] text-white/70" style={{ fontFamily: monoStack }}>
                                                {tc.expectedOutput}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ===================== PROBLEM MODAL ===================== */}
            {problemModal && (
                <Modal
                    title={problemModal === "create" ? "New Problem" : "Edit Problem"}
                    onClose={() => setProblemModal(null)}
                    wide
                >
                    <form onSubmit={submitProblemForm} className="space-y-4">
                        <Field label="Title">
                            <input
                                className={inputCls}
                                value={problemForm.title}
                                onChange={(e) => setProblemForm((p) => ({ ...p, title: e.target.value }))}
                                required
                            />
                        </Field>

                        <Field label="Difficulty">
                            <div className="flex w-fit gap-1 rounded-full border border-white/10 bg-[#1C1C1E] p-1">
                                {["Easy", "Medium", "Hard"].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setProblemForm((p) => ({ ...p, difficulty: d }))}
                                        className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                                            problemForm.difficulty === d
                                                ? "bg-[#0A84FF] text-white"
                                                : "text-white/50 hover:text-white"
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        <Field label="Statement">
                            <textarea
                                className={inputCls}
                                rows={4}
                                value={problemForm.statement}
                                onChange={(e) => setProblemForm((p) => ({ ...p, statement: e.target.value }))}
                                required
                            />
                        </Field>

                        <Field label="Constraints">
                            <textarea
                                className={inputCls}
                                rows={2}
                                style={{ fontFamily: monoStack }}
                                value={problemForm.constraints}
                                onChange={(e) => setProblemForm((p) => ({ ...p, constraints: e.target.value }))}
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Time Limit (seconds)">
                                <input
                                    type="number"
                                    min="1"
                                    className={inputCls}
                                    value={problemForm.timeLimit}
                                    onChange={(e) => setProblemForm((p) => ({ ...p, timeLimit: e.target.value }))}
                                    required
                                />
                            </Field>
                            <Field label="Memory Limit (MB)">
                                <input
                                    type="number"
                                    min="1"
                                    className={inputCls}
                                    value={problemForm.memoryLimit}
                                    onChange={(e) => setProblemForm((p) => ({ ...p, memoryLimit: e.target.value }))}
                                    required
                                />
                            </Field>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-[13px] font-medium text-white/50">Examples</label>
                                <button
                                    type="button"
                                    onClick={addExampleRow}
                                    className="text-[12.5px] font-medium text-[#0A84FF] hover:text-[#409CFF]"
                                >
                                    + Add Example
                                </button>
                            </div>

                            <div className="space-y-3">
                                {problemForm.examples.map((ex, i) => (
                                    <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-[12px] font-semibold text-white/50">
                                                Example {i + 1}
                                            </span>
                                            {problemForm.examples.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExampleRow(i)}
                                                    className="text-[12px] font-medium text-[#FF453A] hover:text-[#FF6961]"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <textarea
                                                placeholder="Input"
                                                rows={2}
                                                className={`${inputCls} text-[13px]`}
                                                style={{ fontFamily: monoStack }}
                                                value={ex.input}
                                                onChange={(e) => updateExample(i, "input", e.target.value)}
                                                required
                                            />
                                            <textarea
                                                placeholder="Output"
                                                rows={2}
                                                className={`${inputCls} text-[13px]`}
                                                style={{ fontFamily: monoStack }}
                                                value={ex.output}
                                                onChange={(e) => updateExample(i, "output", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Explanation (optional)"
                                            rows={1}
                                            className={`${inputCls} mt-2 text-[13px]`}
                                            value={ex.explanation}
                                            onChange={(e) => updateExample(i, "explanation", e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={createProblem.isPending || updateProblem.isPending}
                                className="rounded-full bg-[#0A84FF] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#409CFF] disabled:cursor-not-allowed disabled:bg-[#0A84FF]/30"
                            >
                                {problemModal === "create"
                                    ? createProblem.isPending ? "Creating…" : "Create Problem"
                                    : updateProblem.isPending ? "Saving…" : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setProblemModal(null)}
                                className="rounded-full border border-white/10 px-6 py-2.5 text-[14px] font-medium text-white/70 transition hover:bg-white/[0.06]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ===================== TEST CASE MODAL ===================== */}
            {tcModal && (
                <Modal
                    title={tcModal === "create" ? "New Test Case" : "Edit Test Case"}
                    onClose={() => setTcModal(null)}
                >
                    <form onSubmit={submitTcForm} className="space-y-4">
                        <Field label="Input">
                            <textarea
                                className={inputCls}
                                style={{ fontFamily: monoStack }}
                                rows={3}
                                value={tcForm.input}
                                onChange={(e) => setTcForm((p) => ({ ...p, input: e.target.value }))}
                                required
                            />
                        </Field>

                        <Field label="Expected Output">
                            <textarea
                                className={inputCls}
                                style={{ fontFamily: monoStack }}
                                rows={3}
                                value={tcForm.expectedOutput}
                                onChange={(e) => setTcForm((p) => ({ ...p, expectedOutput: e.target.value }))}
                                required
                            />
                        </Field>

                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                            <div>
                                <p className="text-[13.5px] font-medium text-white/80">Hidden</p>
                                <p className="text-[12px] text-white/40">Used for judging, not shown as a sample</p>
                            </div>
                            <Toggle
                                checked={tcForm.hidden}
                                onChange={(v) => setTcForm((p) => ({ ...p, hidden: v }))}
                            />
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={addTestCase.isPending || updateTestCase.isPending}
                                className="rounded-full bg-[#0A84FF] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#409CFF] disabled:cursor-not-allowed disabled:bg-[#0A84FF]/30"
                            >
                                {tcModal === "create"
                                    ? addTestCase.isPending ? "Adding…" : "Add Test Case"
                                    : updateTestCase.isPending ? "Saving…" : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setTcModal(null)}
                                className="rounded-full border border-white/10 px-6 py-2.5 text-[14px] font-medium text-white/70 transition hover:bg-white/[0.06]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ===================== DELETE CONFIRMATIONS ===================== */}
            {confirmDeleteProblem && (
                <Modal title="Delete Problem" onClose={() => setConfirmDeleteProblem(null)}>
                    <p className="mb-6 text-[14px] leading-relaxed text-white/70">
                        Delete <span className="font-semibold text-white">{confirmDeleteProblem.title}</span>? This can't be undone, and its test cases will remain orphaned unless you remove them separately.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={confirmDelete}
                            disabled={deleteProblem.isPending}
                            className="rounded-full bg-[#FF453A] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#FF6961] disabled:opacity-50"
                        >
                            {deleteProblem.isPending ? "Deleting…" : "Delete"}
                        </button>
                        <button
                            onClick={() => setConfirmDeleteProblem(null)}
                            className="rounded-full border border-white/10 px-5 py-2.5 text-[14px] font-medium text-white/70 transition hover:bg-white/[0.06]"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {confirmDeleteTc && (
                <Modal title="Delete Test Case" onClose={() => setConfirmDeleteTc(null)}>
                    <p className="mb-6 text-[14px] leading-relaxed text-white/70">
                        Delete this test case? This can't be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={confirmDeleteTcNow}
                            disabled={deleteTestCase.isPending}
                            className="rounded-full bg-[#FF453A] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#FF6961] disabled:opacity-50"
                        >
                            {deleteTestCase.isPending ? "Deleting…" : "Delete"}
                        </button>
                        <button
                            onClick={() => setConfirmDeleteTc(null)}
                            className="rounded-full border border-white/10 px-5 py-2.5 text-[14px] font-medium text-white/70 transition hover:bg-white/[0.06]"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Admin;