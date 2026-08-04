import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js"
import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { TestCase } from "../models/testcase.model.js";
import mongoose from "mongoose";

const createProblem = asyncHandler(async (req,res) => {
    const {title, difficulty, constraints ,statement ,examples,timeLimit ,memoryLimit} = req.body

    if (
        !title?.trim() ||
        !difficulty?.trim() ||
        !statement?.trim() ||
        !constraints?.trim() ||
        !Array.isArray(examples) ||
        examples.length === 0 ||
        timeLimit == null ||
        memoryLimit == null
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedProblem = await Problem.findOne({
        title
    })

    if(existedProblem){
        throw new ApiError(409, "Problem already exists") ;
    }

    const problem = await Problem.create({
        title, difficulty, constraints ,statement ,examples,timeLimit ,memoryLimit
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,problem, "Problem created successfully")
    )
})

const getAllProblems = asyncHandler(async (req, res) => {

    const {
        page = 1,
        limit = 10,
        search = "",
        difficulty,
    } = req.query;

    const filter = {};

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };
    }

    if (difficulty) {
        filter.difficulty = difficulty;
    }

    const totalProblems = await Problem.countDocuments(filter);

    const problems = await Problem.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                problems,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(
                        totalProblems / Number(limit)
                    ),
                    totalProblems,
                    limit: Number(limit),
                    hasNextPage:
                        Number(page) <
                        Math.ceil(totalProblems / Number(limit)),
                    hasPrevPage:
                        Number(page) > 1,
                },
            },
            "Problems fetched successfully"
        )
    );

});

const getProblemById = asyncHandler(async (req,res) => {
    const {problemId} = req.params

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const problem = await Problem.findById(problemId)

    if(!problem){
        throw new ApiError(404, "Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            problem,
            "Problem fetched successfully"
        )
    )
})

const updateProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const receivedObject = req.body;

    if (Object.keys(receivedObject).length === 0) {
        throw new ApiError(400, "Nothing to update");
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
        problemId,
        {
            $set: receivedObject,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedProblem) {
        throw new ApiError(404, "Problem doesn't exist");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProblem,
            "Problem updated successfully"
        )
    );
});

const deleteProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const deletedProblem = await Problem.findByIdAndDelete(problemId);

    if (!deletedProblem) {
        throw new ApiError(404, "Problem doesn't exist");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedProblem,
            "Problem deleted successfully"
        )
    );
});





export {createProblem,getAllProblems,getProblemById, updateProblem, deleteProblem}
