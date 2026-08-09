import ai from "../configs/ai.js";

const SYSTEM_PROMPT = `You are a professional resume and career-advice assistant embedded in a resume builder application.

Scope: Only answer questions related to resumes, CVs, job applications, ATS optimization, keyword selection, cover letters, and job-search strategy. If asked something unrelated, politely redirect the user back to resume topics.

When answering:
- Be concise and practical — give actionable advice, not generic platitudes.
- When suggesting keywords, tailor them to the user's stated target role/industry if provided.
- When reviewing resume text, give specific rewritten examples, not just "make it stronger."
- Explain ATS (Applicant Tracking System) concepts in plain language when relevant.
- If the user provides resume content (resumeContext), reference it directly in your answer.
- Keep responses focused — use short paragraphs or bullet points, avoid long essays unless the user asks for depth.
- Never fabricate the user's work experience or credentials; only work with what they've given you.`;

/**
 * Formats the optional resumeContext object into a readable string
 * that gets prepended to the system prompt.
 */
const formatResumeContext = (resumeContext) => {
    if (!resumeContext || Object.keys(resumeContext).length === 0) return "";

    let ctx = "\n\nThe user is currently editing a resume with the following details:";

    if (resumeContext.targetRole || resumeContext.profession) {
        ctx += `\nTarget Role/Profession: ${resumeContext.targetRole || resumeContext.profession}`;
    }
    if (resumeContext.professionalSummary) {
        ctx += `\nProfessional Summary: ${resumeContext.professionalSummary}`;
    }
    if (resumeContext.skills && resumeContext.skills.length > 0) {
        ctx += `\nSkills: ${resumeContext.skills.join(", ")}`;
    }
    if (resumeContext.experiences && resumeContext.experiences.length > 0) {
        ctx += `\nExperiences:`;
        resumeContext.experiences.forEach((exp) => {
            ctx += `\n  - ${exp.position || "Position"} at ${exp.company || "Company"}: ${exp.description || ""}`;
        });
    }
    if (resumeContext.educations && resumeContext.educations.length > 0) {
        ctx += `\nEducation:`;
        resumeContext.educations.forEach((edu) => {
            ctx += `\n  - ${edu.degree || ""} in ${edu.field || ""} from ${edu.institution || ""}`;
        });
    }

    return ctx;
};

/**
 * Sends a message to Gemini and returns the assistant's reply.
 * @param {string} message - The current user message
 * @param {Array<{role: string, text: string}>} conversationHistory - Previous messages
 * @param {object} resumeContext - Optional resume data for personalization
 * @returns {Promise<string>} The model's reply text
 */
export const askChatbot = async (message, conversationHistory = [], resumeContext = null) => {
    const model = process.env.GEMINI_MODEL;
    if (!model) {
        const error = new Error("GEMINI_MODEL environment variable is not configured.");
        error.statusCode = 500;
        throw error;
    }

    if (!process.env.GEMINI_API_KEY) {
        const error = new Error("GEMINI_API_KEY environment variable is not configured.");
        error.statusCode = 500;
        throw error;
    }

    // Build the system message with optional resume context
    const systemContent = SYSTEM_PROMPT + formatResumeContext(resumeContext);

    // Build messages array: system + history + new user message
    const messages = [
        { role: "system", content: systemContent },
    ];

    // Append conversation history (limit to last 10 exchanges to keep payload small)
    const recentHistory = conversationHistory.slice(-10);
    for (const entry of recentHistory) {
        messages.push({
            role: entry.role === "model" ? "assistant" : "user",
            content: entry.text,
        });
    }

    // Append the current user message
    messages.push({ role: "user", content: message });

    try {
        const response = await ai.chat.completions.create({
            model,
            messages,
        });

        const reply = response.choices?.[0]?.message?.content;

        if (!reply || reply.trim().length === 0) {
            return "I couldn't generate a response to that — try rephrasing your question.";
        }

        return reply;
    } catch (apiError) {
        console.error("Gemini API error:", apiError.message);

        // Check for safety/content filtering blocks
        if (apiError.message?.includes("safety") || apiError.message?.includes("blocked")) {
            return "I couldn't generate a response to that — try rephrasing your question.";
        }

        const error = new Error("Failed to communicate with AI service. Please try again later.");
        error.statusCode = 502;
        throw error;
    }
};
