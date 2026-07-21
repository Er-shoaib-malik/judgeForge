import fs from "fs/promises";
import path from "path";

const TEMP_DIRECTORY = path.join(process.cwd(), "temp");

export const createSubmissionDirectory = async (submissionId) => {

    const submissionDirectory = path.join(
        TEMP_DIRECTORY,
        submissionId.toString()
    );

    await fs.mkdir(submissionDirectory, {
        recursive: true,
    });

    return submissionDirectory;
};

export const writeSourceCode = async (
    submissionDirectory,
    language,
    code
) => {

    let fileName;

    switch (language) {

        case "cpp":
            fileName = "main.cpp";
            break;

        case "python":
            fileName = "main.py";
            break;

        case "java":
            fileName = "Main.java";
            break;

        default:
            throw new Error("Unsupported Language");
    }

    const sourceCodePath = path.join(
        submissionDirectory,
        fileName
    );

    await fs.writeFile(
        sourceCodePath,
        code
    );

    return sourceCodePath;
};

export const writeInputFile = async (
    submissionDirectory,
    input
) => {

    const inputFilePath = path.join(
        submissionDirectory,
        "input.txt"
    );

    await fs.writeFile(inputFilePath, input);

    return inputFilePath;
};

export const readOutputFile = async (
    submissionDirectory
) => {

    const outputFilePath = path.join(
        submissionDirectory,
        "output.txt"
    );

    const output = await fs.readFile(
        outputFilePath,
        "utf-8"
    );

    return output.trim();
};