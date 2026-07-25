import {Submission} from "../models/submission.model.js";
import { createSubmissionDirectory, writeSourceCode, writeInputFile, readOutputFile ,deleteSubmissionDirectory, stats} from "../utils/fileManager.js";
import {Problem} from "../models/problem.model.js"
import { TestCase } from "../models/testcase.model.js";
import {ApiError} from "../utils/ApiError.js"
import { getLanguageHandler } from "../compiler/index.js";

const executeSubmission = async (submissionId) => {

    let workingDirectory = null;
    let submission = null ;

    try {
            submission = await Submission.findById(submissionId);
            if (!submission) {
                throw new Error("Submission not found");
            }
        
            const problem = await Problem.findById(submission.problemId) ;
        
            if(!problem){
                throw new ApiError(404,"Problem not found")
            }
            const testCases = await TestCase.find({
                problemId : problem._id
            })
        
            if (testCases.length === 0) {
                throw new ApiError(404, "No test cases found");
            }
        
            submission.status = "RUNNING";
            await submission.save();
        
            console.log("==================================");
            console.log("Executing Submission");
            console.log("Submission:", submission._id);
            console.log("Language:", submission.language);
            console.log("==================================");
        
            workingDirectory =
            await createSubmissionDirectory(
                    submissionId
                );
        
            const sourceCodePath = await writeSourceCode(workingDirectory , submission.language , submission.code) ;
            console.log("Source Code : " ,sourceCodePath);
            
            //handler for different languages , throw error if language not supported
            const languageHandler = getLanguageHandler(submission.language) ;
            //code compilation
            await languageHandler.compile(workingDirectory);

            let passedTestCases = 0 ;
            let verdict = "ACCEPTED"

            let totalRuntime = 0;
            let peakMemory = 0;
            
            //running testcase with docker containers for each testcase
            for(const testCase of testCases){
                await writeInputFile(
                    workingDirectory,
                    testCase.input
                )

                await languageHandler.run(workingDirectory);

                const [runtime, memory] = ( await stats(workingDirectory)).trim().split(" ");

                totalRuntime += Number(runtime) * 1000;
                peakMemory = Math.max(peakMemory, Number(memory));

                const output = await readOutputFile(
                    workingDirectory
                )

                if(
                    output.trim() !== testCase.expectedOutput.trim()
                ){
                    verdict = "WRONG_ANSWER"
                    break ;
                }
                passedTestCases++ ;
            }

            submission.status = verdict;

            submission.passedTestCases =
                passedTestCases;

            submission.totalTestCases =
                testCases.length;

            submission.runtime = Math.round(totalRuntime);
            submission.memory = peakMemory;

            await submission.save();

            console.log(`Verdict: ${verdict}`);
            console.log(`Passed: ${passedTestCases}/${testCases.length}`);
        
            return submission;
    } 
    catch (error) {

        if (submission && submission.status === "RUNNING") {

            submission.status = error.type || "SYSTEM_ERROR";

            submission.errorMessage = error.message;

            if (error.details) {
                submission.errorDetails = error.details;
            }

            await submission.save();
        }

        throw error;
    }
    finally {

        if (workingDirectory) {

            try {

                await deleteSubmissionDirectory(
                    workingDirectory
                );

            } catch (err) {

                console.error(err);

            }

        }

    }
}

export default executeSubmission;