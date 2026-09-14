import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
    createInterview,
    getUserInterviews,
    getInterview,
    startInterview,
    submitAnswer,
    completeInterview,
    getInterviewReport,
    deleteInterview,
} from "../controllers/interviewController.js";

const interviewRouter = express.Router();

// Rate limiting for interview AI endpoints (same pattern as chatbot)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // Slightly higher than chatbot since interviews have multiple rapid requests

const interviewRateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const timestamps = rateLimitMap.get(ip).filter(
        (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= RATE_LIMIT_MAX) {
        return res.status(429).json({
            message: "Too many requests. Please wait a moment before continuing the interview.",
        });
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    next();
};

// Periodic cleanup (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimitMap.entries()) {
        const active = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
        if (active.length === 0) {
            rateLimitMap.delete(ip);
        } else {
            rateLimitMap.set(ip, active);
        }
    }
}, 5 * 60 * 1000);

// Routes
interviewRouter.post("/create", protect, interviewRateLimit, createInterview);
interviewRouter.get("/", protect, getUserInterviews);
interviewRouter.get("/:id", protect, getInterview);
interviewRouter.post("/:id/start", protect, interviewRateLimit, startInterview);
interviewRouter.post("/:id/answer", protect, interviewRateLimit, submitAnswer);
interviewRouter.post("/:id/complete", protect, interviewRateLimit, completeInterview);
interviewRouter.get("/:id/report", protect, getInterviewReport);
interviewRouter.delete("/:id", protect, deleteInterview);

export default interviewRouter;
