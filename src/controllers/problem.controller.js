import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { Problem } from "../models/problem.model.js";

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

const getAllProblems = asyncHandler(async (req,res) => {
    const retrievedProblems = await Problem.find() ;

    if(retrievedProblems.length === 0){
        throw new ApiError(500, "No Problems found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,retrievedProblems,"Problems fetched successfully")
    )
})

const getProblemById = asyncHandler(async (req,res) => {
    const {id} = req.params 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid problem id");
    }

    const problem = await Problem.findById(id)

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
