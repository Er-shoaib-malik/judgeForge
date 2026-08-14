import client from "./client";

export const testcaseApi = {
    getTestCases: (problemId) =>
        client.get(`/testcases/${problemId}/gettestcases`),

    createTestCase: (problemId, data) =>
        client.post(`/testcases/${problemId}/create-testcases`, data),

    updateTestCase: (testcaseId, data) =>
        client.patch(`/testcases/${testcaseId}`, data),

    deleteTestCase: (testcaseId) =>
        client.delete(`/testcases/${testcaseId}`),
};