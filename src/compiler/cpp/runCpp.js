import { spawn } from "child_process";

const runCpp = (executablePath, input = "") => {
    return new Promise((resolve, reject) => {

        const child = spawn(executablePath);

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", reject);

        child.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(stderr));
            }

            resolve(stdout.trim());
        });

        // Send input to stdin
        child.stdin.write(input);
        child.stdin.end();

        // Timeout
        setTimeout(() => {
            child.kill();
            reject(new Error("Time Limit Exceeded"));
        }, 2000);

    });
};

export default runCpp;