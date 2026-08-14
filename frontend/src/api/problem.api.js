import client from "./client";

export const problemApi = {
    getProblems: (params) => client.get("/problems", { params }),
    getProblem: (id) => client.get(`/problems/${id}`),
    createProblem: (data) => client.post("/problems", data),
    updateProblem: (id, data) => client.patch(`/problems/${id}`, data),
    deleteProblem: (id) => client.delete(`/problems/${id}`),
};
