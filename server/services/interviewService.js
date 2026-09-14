import ai from "../configs/ai.js";
import { resumeToText } from "./atsService.js";
import {
    buildQuestionGenerationPrompt,
    buildAnswerEvaluationPrompt,
    buildFinalReportPrompt,
} from "../utils/interviewPrompts.js";

/**
 * Sends a prompt to Gemini and parses the JSON response.
 * Handles markdown fence stripping and parse errors gracefully.
 */
const callGeminiJSON = async (systemPrompt, userPrompt) => {
    const model = process.env.GEMINI_MODEL;
    if (!model) {
        const error = new Error("GEMINI_MODEL environment variable is not configured.");
        error.statusCode = 500;
        throw error;
    }

    try {
        const response = await ai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
        });

        let rawOutput = response.choices?.[0]?.message?.content || "";
        rawOutput = rawOutput.trim();

        // Strip markdown fences if present
        if (rawOutput.startsWith("```json")) {
            rawOutput = rawOutput.replace(/^```json/, "");
        } else if (rawOutput.startsWith("```")) {
            rawOutput = rawOutput.replace(/^```/, "");
        }
        if (rawOutput.endsWith("```")) {
            rawOutput = rawOutput.replace(/```$/, "");
        }
        rawOutput = rawOutput.trim();

        try {
            return JSON.parse(rawOutput);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON output:", rawOutput.substring(0, 500));
            const error = new Error("Failed to parse AI response into valid JSON.");
            error.statusCode = 502;
            throw error;
        }
    } catch (error) {
        if (error.statusCode) throw error;

        console.error("Gemini API Error:", error.message);
        const apiError = new Error("Failed to communicate with AI service. Please try again later.");
        apiError.statusCode = 502;
        throw apiError;
    }
};

/**
 * Generates personalized interview questions based on resume, job role, and settings.
 * @param {Object} resume - Mongoose Resume document
 * @param {Object} options - { jobTitle, jobDescription, interviewType, difficulty, totalQuestions }
 * @returns {Array} Array of question objects
 */
export const generateInterviewQuestions = async (resume, options) => {
    const resumeText = resumeToText(resume);
    const { jobTitle, jobDescription, interviewType, difficulty, totalQuestions } = options;

    const prompts = buildQuestionGenerationPrompt({
        resumeText,
        jobTitle,
        jobDescription,
        interviewType,
        difficulty,
        totalQuestions,
    });

    const result = await callGeminiJSON(prompts.system, prompts.user);

    if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
        const error = new Error("AI failed to generate valid interview questions.");
        error.statusCode = 502;
        throw error;
    }

    // Validate and normalize each question
    return result.questions.map((q) => ({
        question: q.question || "Tell me about yourself.",
        category: q.category || "General",
        difficulty: ["Easy", "Medium", "Hard"].includes(q.difficulty) ? q.difficulty : difficulty,
    }));
};

/**
 * Evaluates a candidate's answer to an interview question.
 * @param {Object} resume - Mongoose Resume document
 * @param {Object} options - { jobTitle, jobDescription, question, answer, interviewContext }
 * @returns {Object} Evaluation result
 */
export const evaluateInterviewAnswer = async (resume, options) => {
    const resumeText = resumeToText(resume);
    const { jobTitle, jobDescription, question, answer, interviewContext } = options;

    const prompts = buildAnswerEvaluationPrompt({
        resumeText,
        jobTitle,
        jobDescription,
        question,
        answer,
        interviewContext,
    });

    const result = await callGeminiJSON(prompts.system, prompts.user);

    // Validate and normalize the evaluation
    return {
        score: clampScore(result.score, 1, 10),
        technicalAccuracy: clampScore(result.technicalAccuracy, 1, 10),
        relevance: clampScore(result.relevance, 1, 10),
        completeness: clampScore(result.completeness, 1, 10),
        communication: clampScore(result.communication, 1, 10),
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
        feedback: result.feedback || "No specific feedback provided.",
        shouldFollowUp: Boolean(result.shouldFollowUp),
        followUpQuestion: result.followUpQuestion || "",
    };
};

/**
 * Generates a comprehensive final interview report.
 * @param {Object} resume - Mongoose Resume document
 * @param {Object} interview - Mongoose Interview document
 * @returns {Object} Final report data
 */
export const generateFinalInterviewReport = async (resume, interview) => {
    const resumeText = resumeToText(resume);

    const questionsAndAnswers = interview.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        category: q.category,
        score: q.score,
    }));

    const prompts = buildFinalReportPrompt({
        resumeText,
        jobTitle: interview.jobTitle,
        jobDescription: interview.jobDescription,
        questionsAndAnswers,
    });

    const result = await callGeminiJSON(prompts.system, prompts.user);

    return {
        overallScore: clampScore(result.overallScore, 0, 100),
        categoryScores: {
            technicalKnowledge: clampScore(result.categoryScores?.technicalKnowledge, 0, 100),
            communication: clampScore(result.categoryScores?.communication, 0, 100),
            problemSolving: clampScore(result.categoryScores?.problemSolving, 0, 100),
            relevance: clampScore(result.categoryScores?.relevance, 0, 100),
        },
        overallFeedback: result.overallFeedback || "",
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        improvements: Array.isArray(result.improvements) ? result.improvements : [],
        recommendation: result.recommendation || "",
    };
};

/**
 * Clamps a numeric score to a given range, returning the default min if invalid.
 */
function clampScore(value, min, max) {
    const num = Number(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, Math.round(num)));
}
