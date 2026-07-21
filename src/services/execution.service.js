import {Submission} from "../models/submission.model.js";
import { createSubmissionDirectory, writeSourceCode, writeInputFile, readOutputFile } from "../utils/fileManager.js";
import compileCpp from "../compiler/cpp/compilerCpp.js";
import runCpp from "../compiler/cpp/runCpp.js";
import path from "path";

const executeSubmission = async (submissionId) => {

    const submission = await Submission.findById(submissionId);

    if (!submission) {
        throw new Error("Submission not found");
    }

    submission.status = "RUNNING";
    await submission.save();

    console.log("==================================");
    console.log("Executing Submission");
    console.log("Submission:", submission._id);
    console.log("Language:", submission.language);
    console.log("==================================");

    const workingDirectory =
    await createSubmissionDirectory(
            submissionId
        );

    const sourceCodePath = await writeSourceCode(workingDirectory , submission.language , submission.code) ;
    console.log("Source Code : " ,sourceCodePath);

    let executablePath = null;

    switch (submission.language) {
        case "cpp":
            console.log("Before compile");

            executablePath = await compileCpp(sourceCodePath);

            console.log("After compile");

            const inputFilePath = await writeInputFile(
                workingDirectory,
                "5 10"
            );

            const outputFilePath = path.join(
                workingDirectory,
                "output.txt"
            );

            await runCpp(
                executablePath,
                inputFilePath,
                outputFilePath
            );

            const output = await readOutputFile(
                workingDirectory
            );

            console.log("Program Output:", output);
            break;

        case "python":
            executablePath = sourceCodePath;
            break;

        case "java":
            break;

        default:
            throw new Error("Unsupported language");
    }

    console.log("Executable Path:", executablePath);

    return submission;
}

export default executeSubmission;