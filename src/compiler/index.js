import cpp from "./cpp/index.js";
import python from "./python/index.js";
import java from "./java/index.js";

const languageHandlers = {
    cpp,
    python,
    java
};

export const getLanguageHandler = (language) => {

    const handler = languageHandlers[language];

    if (!handler) {
        throw new Error(`Unsupported language: ${language}`);
    }

    return handler;

};