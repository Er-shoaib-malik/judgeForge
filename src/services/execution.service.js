import {Submission} from "../models/submission.model.js";
import { createSubmissionDirectory, writeSourceCode } from "../utils/fileManager.js";
import compileCpp from "../compiler/cpp/compilerCpp.js";
import runCpp from "../compiler/cpp/runCpp.js";

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

            console.log("Before run");
            console.log(executablePath);
            const output = await runCpp(
                executablePath,
                "5 10"
            );

            console.log("After run");

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