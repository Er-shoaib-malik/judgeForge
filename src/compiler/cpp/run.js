import { exec } from "child_process";
import { promisify } from "util";
import ExecutionError from "../../utils/ExecutionError.js";
import { LANGUAGE_CONFIG } from "../constants.js";

const execPromise = promisify(exec);

const run = async (
    workingDirectory
) => {

    const dockerPath = workingDirectory.replace(/\\/g, "/");
    const { filename, dockerImage } = LANGUAGE_CONFIG.cpp;
    const command =`docker run --rm --network none --memory=256m --cpus=1 --pids-limit=100 --security-opt=no-new-privileges -v "${dockerPath}:/app" -w /app ${dockerImage} sh -c "/usr/bin/time -f '%e %M' -o stats.txt timeout 2s ./main < input.txt > output.txt"`;

    try {
        await execPromise(command);

    } catch (error) {
        if (error.code === 124) {
            throw new ExecutionError(
                "TIME_LIMIT_EXCEEDED",
                "Time Limit Exceeded"
            );
        }

        if (error.code === 137) {
            throw new ExecutionError(
                "MEMORY_LIMIT_EXCEEDED",
                "Memory Limit Exceeded"
            );
        }

        throw new ExecutionError(
            "RUNTIME_ERROR",
            "Runtime Error",
            error.stderr
        );
    }

};

export default run;