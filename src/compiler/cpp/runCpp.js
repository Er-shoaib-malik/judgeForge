import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

const runCpp = async (
    executablePath,
    inputFilePath,
    outputFilePath
) => {

    let command;

    if (process.platform === "win32") {

        command = `"${executablePath}" < "${inputFilePath}" > "${outputFilePath}"`;

    } else {

        command = `"${executablePath}" < "${inputFilePath}" > "${outputFilePath}"`;

    }

    await execPromise(command, {
        timeout: 2000,
        maxBuffer: 1024 * 1024
    });

};

export default runCpp;