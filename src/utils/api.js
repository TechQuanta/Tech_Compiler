// src/components/api.js
import axios from "axios";
import { languageOptions } from "./utils/constant";

// --- API Key Management (using Environment Variables for Rotation) ---
let RAPIDAPI_KEYS_ARRAY = [];
let currentKeyIndex = 0;

try {
    // IMPORTANT: Access environment variables via import.meta.env in Vite
    const envTokensString = import.meta.env.VITE_API_TOKENS; // Changed from process.env.REACT_APP_API_TOKENS

    if (envTokensString) {
        const parsedTokens = JSON.parse(envTokensString);
        RAPIDAPI_KEYS_ARRAY = Object.values(parsedTokens);
    } else {
        console.warn("Environment variable VITE_API_TOKENS is not set. Using a fallback (will likely cause issues).");
        RAPIDAPI_KEYS_ARRAY = ["26f397d828msh57887dad54691fap13b5e9jsnd60485118279"];
    }
} catch (e) {
    console.error("Failed to parse VITE_API_TOKENS as JSON. Error:", e);
    RAPIDAPI_KEYS_ARRAY = ["26f397d828msh57887dad54691fap13b5e9jsnd60485118279"];
}

if (RAPIDAPI_KEYS_ARRAY.length === 0) {
    console.error("CRITICAL: No RapidAPI keys available. Please check VITE_API_TOKENS in your .env file.");
}

const MAX_RETRIES_ON_429 = RAPIDAPI_KEYS_ARRAY.length > 0 ? RAPIDAPI_KEYS_ARRAY.length : 1;

const getCurrentApiKey = () => {
    if (RAPIDAPI_KEYS_ARRAY.length === 0) {
        console.error("No API key available to retrieve.");
        return null;
    }
    return RAPIDAPI_KEYS_ARRAY[currentKeyIndex];
};

const rotateApiKey = () => {
    if (RAPIDAPI_KEYS_ARRAY.length === 0) return;
    currentKeyIndex = (currentKeyIndex + 1) % RAPIDAPI_KEYS_ARRAY.length;
    console.warn(`RapidAPI: Rate limit hit! Switched to key index: ${currentKeyIndex}.`);
};
// --- End API Key Management ---


export const executeCode = async (languageKey, sourceCode) => {
    const selectedLanguage = languageOptions[languageKey];

    if (!selectedLanguage) {
        console.error("Attempted to run with unsupported language key:", languageKey);
        throw new Error(`Unsupported language: ${languageKey}`);
    }

    const formData = {
        language_id: selectedLanguage.id,
        source_code: btoa(sourceCode),
    };

    // Access these via import.meta.env as well
    const submissionUrl = import.meta.env.VITE_RAPID_API_URL || "https://judge0-ce.p.rapidapi.com/submissions";
    const rapidApiHost = import.meta.env.VITE_RAPID_API_HOST || "judge0-ce.p.rapidapi.com";

    const commonHeaders = {
        "content-type": "application/json",
        "X-RapidAPI-Host": rapidApiHost,
    };

    let retries = 0;
    while (retries < MAX_RETRIES_ON_429) {
        const currentApiKey = getCurrentApiKey();
        if (!currentApiKey) {
            throw new Error("No RapidAPI key available for submission. Check .env configuration.");
        }

        try {
            const submissionResponse = await axios.request({
                method: "POST",
                url: submissionUrl,
                params: { base64_encoded: "true", fields: "*" },
                headers: {
                    ...commonHeaders,
                    "X-RapidAPI-Key": currentApiKey,
                },
                data: formData,
            });

            const token = submissionResponse.data.token;
            return await checkStatus(token);

        } catch (error) {
            console.error("Error submitting code to Judge0:", error.response?.data || error.message);

            if (error.response && error.response.status === 429) {
                retries++;
                if (retries < MAX_RETRIES_ON_429) {
                    console.warn(`Rate limit hit! Retrying with next key (Attempt ${retries}/${MAX_RETRIES_ON_429})...`);
                    rotateApiKey();
                    await new Promise(res => setTimeout(res, 500 + (retries * 200)));
                } else {
                    throw new Error("Submission failed: All API keys rate-limited. Please try again later.");
                }
            } else if (error.response && error.response.status === 403 && error.response.data.message === "You are not subscribed to this API.") {
                retries++;
                if (retries < MAX_RETRIES_ON_429) {
                    console.error(`RapidAPI: Current key is not subscribed. Retrying with next key (Attempt ${retries}/${MAX_RETRIES_ON_429})...`);
                    rotateApiKey();
                    await new Promise(res => setTimeout(res, 1000));
                } else {
                    throw new Error("Submission failed: All provided API keys are either invalid or not subscribed.");
                }
            } else {
                throw new Error("Submission failed: " + (error.response?.data?.message || error.message));
            }
        }
    }
    throw new Error("Submission failed: Exhausted all retries without successful submission.");
};

const checkStatus = async (token) => {
    // Access these via import.meta.env as well
    const statusUrl = `${import.meta.env.VITE_RAPID_API_URL || "https://judge0-ce.p.rapidapi.com/submissions"}/${token}`;
    const rapidApiHost = import.meta.env.VITE_RAPID_API_HOST || "judge0-ce.p.rapidapi.com";

    const commonHeaders = {
        "X-RapidAPI-Host": rapidApiHost,
    };

    let retries = 0;
    while (retries < MAX_RETRIES_ON_429) {
        const currentApiKey = getCurrentApiKey();
        if (!currentApiKey) {
            throw new Error("No RapidAPI key available for status check. Check .env configuration.");
        }

        try {
            const response = await axios.request({
                method: "GET",
                url: statusUrl,
                params: { base64_encoded: "true", fields: "*" },
                headers: {
                    ...commonHeaders,
                    "X-RapidAPI-Key": currentApiKey,
                },
            });

            const statusId = response.data.status?.id;

            if (statusId === 1 || statusId === 2) {
                await new Promise((res) => setTimeout(res, 2000));
                return await checkStatus(token);
            } else {
                return {
                    run: {
                        stdout: response.data.stdout ? atob(response.data.stdout) : "",
                        stderr: response.data.stderr ? atob(response.data.stderr) : "",
                        status: response.data.status?.description,
                        compile_output: response.data.compile_output ? atob(response.data.compile_output) : "",
                    },
                };
            }
        } catch (error) {
            console.error("Error checking submission status:", error.response?.data || error.message);

            if (error.response && error.response.status === 429) {
                retries++;
                if (retries < MAX_RETRIES_ON_429) {
                    console.warn(`Status check rate limit hit! Retrying with next key (Attempt ${retries}/${MAX_RETRIES_ON_429})...`);
                    rotateApiKey();
                    await new Promise(res => setTimeout(res, 500 + (retries * 200)));
                } else {
                    throw new Error("Status check failed: All API keys rate-limited. Please try again later.");
                }
            } else if (error.response && error.response.status === 403 && error.response.data.message === "You are not subscribed to this API.") {
                retries++;
                if (retries < MAX_RETRIES_ON_429) {
                    console.error(`RapidAPI: Current key is not subscribed (status check). Retrying with next key (Attempt ${retries}/${MAX_RETRIES_ON_429})...`);
                    rotateApiKey();
                    await new Promise(res => setTimeout(res, 1000));
                } else {
                    throw new Error("Status check failed: All provided API keys are either invalid or not subscribed.");
                }
            } else {
                throw new Error("Status check failed: " + (error.response?.data?.message || error.message));
            }
        }
    }
    throw new Error("Status check failed: Exhausted all retries without successful status.");
};