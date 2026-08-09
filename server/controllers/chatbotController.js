import { askChatbot } from "../services/geminiService.js";

// POST: /api/chatbot/ask
export const askChatbotController = async (req, res) => {
    try {
        const { message, conversationHistory, resumeContext } = req.body;

        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return res.status(400).json({ error: "A non-empty 'message' string is required." });
        }

        const reply = await askChatbot(
            message.trim(),
            conversationHistory || [],
            resumeContext || null
        );

        return res.status(200).json({ reply });
    } catch (error) {
        console.error("Chatbot controller error:", error.message);

        const statusCode = error.statusCode || 500;
        const safeMessage = error.statusCode
            ? error.message
            : "An unexpected error occurred. Please try again later.";

        return res.status(statusCode).json({ error: safeMessage });
    }
};
