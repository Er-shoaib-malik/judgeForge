import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import ExecutionError from "../../utils/ExecutionError.js";
import { LANGUAGE_CONFIG } from "../constants.js";

const execPromise = promisify(exec);

const compile = async ( workingDirectory,) => {

    const dockerPath = workingDirectory.replace(/\\/g, "/");
    const { filename, dockerImage } = LANGUAGE_CONFIG.cpp;
    const command = `docker run --rm --network none --memory=256m --cpus=1 --pids-limit=100 --security-opt=no-new-privileges -v "${dockerPath}:/app" -w /app ${dockerImage} g++ ${filename} -o main`;
    try {
      
        await execPromise(command);

    } catch (error) {

        throw new ExecutionError(
            "COMPILATION_ERROR",
            "Compilation Failed",
            error.stderr
        );

    }

};

export default compile;