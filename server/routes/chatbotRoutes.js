import express from "express";
import { askChatbotController } from "../controllers/chatbotController.js";
import protect from "../middlewares/authMiddleware.js";

const chatbotRouter = express.Router();

// Rate limiting: ~20 requests per minute per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20;

const chatbotRateLimit = (req, res, next) => {
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
            error: "Too many requests. Please wait a moment before sending another message.",
        });
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    next();
};

// Periodic cleanup of stale rate-limit entries (every 5 minutes)
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

chatbotRouter.post("/ask", protect, chatbotRateLimit, askChatbotController);

export default chatbotRouter;
