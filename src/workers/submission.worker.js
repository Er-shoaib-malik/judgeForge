import { Worker } from "bullmq";
import connection from "../config/redis.js";
import { Submission } from "../models/submission.model.js";
import executeSubmission from "../services/execution.service.js";

const worker = new Worker(
    "submission-queue" ,
    async (job) => {
        console.log("New job recieved")
        
        const {submissionId} = job.data
        await executeSubmission(submissionId) ;
    } ,
    {
        connection ,
    }
)

console.log("Worker Started")

export default worker