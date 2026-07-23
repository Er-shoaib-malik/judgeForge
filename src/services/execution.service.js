import {Submission} from "../models/submission.model.js";
import { createSubmissionDirectory, writeSourceCode, writeInputFile, readOutputFile ,deleteSubmissionDirectory} from "../utils/fileManager.js";
import compileCpp from "../compiler/cpp/compilerCpp.js";
import runCpp from "../compiler/cpp/runCpp.js";
import path from "path";
import {Problem} from "../models/problem.model.js"
import { TestCase } from "../models/testcase.model.js";
import {ApiError} from "../utils/ApiError.js"

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
                
            switch (submission.language) {
                case "cpp":

                    await compileCpp(workingDirectory);
        
                    let passedTestCases = 0 ;
                    let verdict = "ACCEPTED"
                
                    const inputFilePath = path.join(
                        workingDirectory,
                        "input.txt"
                    )
        
                    const outputFilePath = path.join(
                        workingDirectory,
                        "output.txt"
                    )

                    let totalRuntime = 0;
        
                    for(const testCase of testCases){
                        await writeInputFile(
                            workingDirectory,
                            testCase.input
                        )

                        const start = Date.now();
        
                        await runCpp(workingDirectory) ;
                        totalRuntime += Date.now() - start;
        
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

                    submission.runtime = totalRuntime ;
        
                    await submission.save();
        
                    console.log(`Verdict: ${verdict}`);
                    console.log(`Passed: ${passedTestCases}/${testCases.length}`);
                    
                    break;
        
                case "python":
                    executablePath = sourceCodePath;
                    break;
        
                case "java":
                    break;
        
                default:
                    throw new Error("Unsupported language");
            }
        
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