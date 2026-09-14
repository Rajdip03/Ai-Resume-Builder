import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    category: { type: String, default: "General" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },

    answer: { type: String, default: "" },
    transcript: { type: String, default: "" },

    score: { type: Number, min: 0, max: 10, default: 0 },
    technicalAccuracy: { type: Number, min: 0, max: 10, default: 0 },
    relevance: { type: Number, min: 0, max: 10, default: 0 },
    completeness: { type: Number, min: 0, max: 10, default: 0 },
    communication: { type: Number, min: 0, max: 10, default: 0 },

    strengths: [{ type: String }],
    weaknesses: [{ type: String }],

    feedback: { type: String, default: "" },

    followUpQuestion: { type: String, default: "" },
    isFollowUp: { type: Boolean, default: false },

    answeredAt: { type: Date },
}, { _id: true });

const InterviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
    },

    jobTitle: { type: String, required: true },
    jobDescription: { type: String, default: "" },

    interviewType: {
        type: String,
        enum: ["Technical", "HR", "Behavioral", "Mixed"],
        default: "Mixed",
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium",
    },

    totalQuestions: { type: Number, default: 10, min: 5, max: 15 },
    currentQuestionIndex: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ["created", "in_progress", "completed", "abandoned"],
        default: "created",
    },

    questions: [QuestionSchema],

    overallScore: { type: Number, min: 0, max: 100, default: 0 },

    categoryScores: {
        technicalKnowledge: { type: Number, min: 0, max: 100, default: 0 },
        communication: { type: Number, min: 0, max: 100, default: 0 },
        problemSolving: { type: Number, min: 0, max: 100, default: 0 },
        relevance: { type: Number, min: 0, max: 100, default: 0 },
    },

    overallFeedback: { type: String, default: "" },

    strengths: [{ type: String }],
    improvements: [{ type: String }],

    startedAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });

const Interview = mongoose.model("Interview", InterviewSchema);
export default Interview;
