import {Submission} from "../models/submission.model.js";
import { createSubmissionDirectory, writeSourceCode } from "../utils/fileManager.js";

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

    return submission;
}

export default executeSubmission;