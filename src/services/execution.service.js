import {Submission} from "../models/submission.model.js";

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

    return submission;
}

export default executeSubmission;