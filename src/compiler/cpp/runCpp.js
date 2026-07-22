import { exec } from "child_process";
import { promisify } from "util";
import ExecutionError from "../../utils/ExecutionError.js";

const execPromise = promisify(exec);

const runCpp = async (
    executablePath,
    inputFilePath,
    outputFilePath
) => {

    const command = `"${executablePath}" < "${inputFilePath}" > "${outputFilePath}"`;

    try {

        await execPromise(command, {
            timeout: 2000,
            maxBuffer: 1024 * 1024
        });

    } catch (error) {

        if (error.killed || error.signal === "SIGTERM") {

            throw new ExecutionError(
                "TIME_LIMIT_EXCEEDED",
                "Time Limit Exceeded"
            );

        }

        throw new ExecutionError(
            "RUNTIME_ERROR",
            "Runtime Error",
            error.stderr
        );
    }

};

export default runCpp;