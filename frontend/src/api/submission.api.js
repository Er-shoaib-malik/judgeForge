import client from "./client";

export const submissionApi = {
    submit: (problemId, data) =>
        client.post(`/submissions/${problemId}/submit`, data),

    run: (problemId, data) =>
        client.post(`/submissions/${problemId}/run`, data),

    getSubmission: (submissionId) =>
        client.get(`/submissions/${submissionId}`),

    getMySubmissions: (params) =>
        client.get("/submissions/Allsubmissions", { params }),

    getProblemSubmissions: (problemId, params) =>
        client.get(`/submissions/problems/${problemId}/submissions`, { params }),
};

