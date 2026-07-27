import {asyncHandler} from "../utils/asyncHandler.js"
import {Submission} from "../models/submission.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Problem } from "../models/problem.model.js"

const createSubmission = asyncHandler(async (req,res) => {
    const {problemId}= req.params
    console.log(problemId.problemId)

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

const userSubmissions = asyncHandler( async (req,res) =>{
    const userId = req.user._id

    const submissions = await Submission.find({
        userId
    }).sort({ createdAt: -1 });

    return res
    .status(200)
    .json(
        new ApiResponse(200,submissions,"User submissions fetched successfully")
    )
})

const problemSubmissions = asyncHandler(async (req,res)=>{
    const {problemId} = req.params
    const userId = req.user._id

    Submission.find({
        $and: [
            { problemId },
            { userId }
        ]
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,submissions,"User submissions related to problem fetched successfully")
    )
})

export {userSubmissions ,problemSubmissions,createSubmission}