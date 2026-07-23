import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import ExecutionError from "../../utils/ExecutionError.js";

const execPromise = promisify(exec);

const compileCpp = async ( workingDirectory,) => {

    const executablePath = path.join(
        workingDirectory,
        "main"
    );
    const dockerPath = workingDirectory.replace(/\\/g, "/");
    const command = `docker run --rm -v "${dockerPath}:/app" -w /app judge-cpp g++ main.cpp -o main`;
    try {
      
    await execPromise(command);

    return executablePath;

    } catch (error) {

        throw new ExecutionError(
            "COMPILATION_ERROR",
            "Compilation Failed",
            error.stderr
        );

    }

};

export default compileCpp;