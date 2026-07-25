import { exec } from "child_process";
import { promisify } from "util";
import ExecutionError from "../../utils/ExecutionError.js";
import { LANGUAGE_CONFIG } from "../constants.js";

const execPromise = promisify(exec);

const compile = async (workingDirectory) => {

    const dockerPath = workingDirectory.replace(/\\/g, "/");
    const { filename, dockerImage } = LANGUAGE_CONFIG.python;

    const command = `docker run --rm --network none -v "${dockerPath}:/app" -w /app ${dockerImage} python3 -m py_compile ${filename}`;

    try {
        await execPromise(command);
    } catch (error) {
        throw new ExecutionError(
            "COMPILATION_ERROR",
            "Compilation Error",
            error.stderr
        );
    }
};

export default compile;