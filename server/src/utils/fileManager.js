import fs from "fs/promises";
import path from "path";
import {LANGUAGE_CONFIG} from "../compiler/constants.js"

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

    const filename = LANGUAGE_CONFIG[language].filename;

    const sourceCodePath = path.join(
        submissionDirectory,
        filename
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

export const deleteSubmissionDirectory = async (workingDirectory) => {
    await fs.rm(workingDirectory, {
        recursive: true,
        force: true
    });
};

export const stats = async (workingDirectory) => {
    const statsPath = path.join(workingDirectory, "stats.txt");

    return fs.readFile(statsPath, "utf-8");
};