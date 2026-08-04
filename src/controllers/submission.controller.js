import {asyncHandler} from "../utils/asyncHandler.js"
import {Submission} from "../models/submission.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Problem } from "../models/problem.model.js"
import {executeRunCode} from "../services/execution.service.js"
import submissionQueue from"../queue/submission.queue.js"

const createSubmission = asyncHandler(async (req,res) => {
    const {problemId}= req.params
    console.log(problemId)

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const isProblemExist = await Problem.findById(problemId) ;

    if(!isProblemExist){
        throw new ApiError(404, "Problem doesn't exist")
    }

    const {language, code} = req.body

    if (!language?.trim() || !code?.trim()) {
        throw new ApiError(400, "Language and code are required");
    }

    const allowedLanguages = ["cpp", "java", "python"];

    if (!allowedLanguages.includes(language)) {
        throw new ApiError(400, "Unsupported language");
    }

    const submission = await Submission.create({
        problemId,
        userId: req.user._id,
        language,
        code,
        status: "PENDING",
    });

    await submissionQueue.add(
        "execute-submission",
        {
            submissionId : submission._id.toString(),
        }
    )

    return res
    .status(201)
    .json(
        new ApiResponse(201,submission, "Submission created successfully" )
    )
})

const userSubmissions = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const {
        page = 1,
        limit = 10,
        status,
        language,
    } = req.query;

    const filter = {
        userId,
    };

    if (status) {
        filter.status = status;
    }

    if (language) {
        filter.language = language;
    }

    const totalSubmissions = await Submission.countDocuments(filter);

    const submissions = await Submission.find(filter)
        .populate("problemId", "title difficulty")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                submissions,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(
                        totalSubmissions / limit
                    ),
                    totalSubmissions,
                    limit: Number(limit),
                    hasNextPage:
                        page * limit < totalSubmissions,
                    hasPrevPage:
                        page > 1,
                },
            },
            "User submissions fetched successfully"
        )
    );

});

const problemSubmissions = asyncHandler(async (req, res) => {

    const { problemId } = req.params;

    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const {
        page = 1,
        limit = 10,
        status,
        language,
    } = req.query;

    const filter = {
        problemId,
        userId,
    };

    if (status) {
        filter.status = status;
    }

    if (language) {
        filter.language = language;
    }

    const totalSubmissions =
        await Submission.countDocuments(filter);

    const submissions = await Submission.find(filter)
        .populate("problemId", "title difficulty")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                submissions,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(
                        totalSubmissions / limit
                    ),
                    totalSubmissions,
                    limit: Number(limit),
                    hasNextPage:
                        page * limit < totalSubmissions,
                    hasPrevPage:
                        page > 1,
                },
            },
            "Problem submissions fetched successfully"
        )
    );

});

const getSubmission = asyncHandler(async (req, res) => {

    const { submissionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        throw new ApiError(400, "Invalid submission id");
    }

    const submission = await Submission.findById(submissionId)
        .populate("problemId", "title difficulty")
        .populate("userId", "fullName username");

    if (!submission) {
        throw new ApiError(404, "Submission not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            submission,
            "Submission fetched successfully"
        )
    );

});

const runCode = asyncHandler(async (req, res) => {

    const { problemId } = req.params;
    const { language, code } = req.body;

    const result = await executeRunCode({
        problemId,
        language,
        code,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Code executed successfully"
        )
    );
});

export {userSubmissions ,problemSubmissions,createSubmission ,runCode ,getSubmission}