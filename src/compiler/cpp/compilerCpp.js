import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { tryCatch } from "bullmq";
import ExecutionError from "../../utils/ExecutionError.js"

const execPromise = promisify(exec);

const compileCpp = async (sourceCodePath) => {
  const directory = path.dirname(sourceCodePath);

  const executableName = process.platform === "win32" ? "main.exe" : "main";

  const executablePath = path.join(directory, executableName);

  const compileCommand = `g++ "${sourceCodePath}" -o "${executablePath}"`;

  try {
    await execPromise(compileCommand);
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
