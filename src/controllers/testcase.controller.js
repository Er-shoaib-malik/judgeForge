import { asyncHandler } from "../utils/asyncHandler.js";
import {TestCase} from "../models/testcase.model.js"
import { Problem } from "../models/problem.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import mongoose from "mongoose";

const addTestCase = asyncHandler(async (req, res) => {

    const { problemId } = req.params;
    const { input, expectedOutput, hidden } = req.body;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid Problem Id");
    }

    if (
        !input?.trim() ||
        !expectedOutput?.trim()
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    const testCase = await TestCase.create({
        problemId,
        input,
        expectedOutput,
        hidden
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            testCase,
            "Test case created successfully"
        )
    );
});

const addBulkTestCase = asyncHandler(async (req, res) => {

    const { problemId, testCases } = req.body;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
        throw new ApiError(400, "Test cases array is required");
    }

    const formattedTestCases = testCases.map((testCase) => {

        if (
            !testCase.input?.trim() ||
            !testCase.expectedOutput?.trim()
        ) {
            throw new ApiError(
                400,
                "Each test case must contain input and expectedOutput"
            );
        }

        return {
            problemId,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            hidden: testCase.hidden ?? true,
        };
    });

    const createdTestCases = await TestCase.insertMany(
        formattedTestCases
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            createdTestCases,
            `${createdTestCases.length} test cases added successfully`
        )
    );

});

const getProblemTestCases = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    const testCases = await TestCase.find({ problemId, hidden:false });

    return res.status(200).json(
        new ApiResponse(
            200,
            testCases,
            "Test cases fetched successfully"
        )
    );
});

const updateTestCase = asyncHandler(async (req, res) => {
    const { testcaseId } = req.params;
    const { input, expectedOutput, hidden } = req.body;

    if (!mongoose.Types.ObjectId.isValid(testcaseId)) {
        throw new ApiError(400, "Invalid testcase id");
    }

    const testCase = await TestCase.findById(testcaseId);

    if (!testCase) {
        throw new ApiError(404, "Test case not found");
    }

    if (input !== undefined) {
        testCase.input = input.trim();
    }

    if (expectedOutput !== undefined) {
        testCase.expectedOutput = expectedOutput.trim();
    }

    if (hidden !== undefined) {
        testCase.hidden = hidden;
    }

    await testCase.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            testCase,
            "Test case updated successfully"
        )
    );
});

const deleteTestCase = asyncHandler(async (req, res) => {
    const { testcaseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testcaseId)) {
        throw new ApiError(400, "Invalid testcase id");
    }

    const testCase = await TestCase.findById(testcaseId);

    if (!testCase) {
        throw new ApiError(404, "Test case not found");
    }

    await TestCase.findByIdAndDelete(testcaseId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Test case deleted successfully"
        )
    );
});

export {addTestCase,getProblemTestCases,updateTestCase,deleteTestCase,addBulkTestCase}