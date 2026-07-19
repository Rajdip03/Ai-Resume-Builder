import mongoose from "mongoose";

const ATSReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            default: null, // null if scanned from raw text
        },
        jobDescription: {
            type: String,
            default: "",
        },
        atsScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        strengths: [
            {
                type: String,
            },
        ],
        weaknesses: [
            {
                type: String,
            },
        ],
        missingKeywords: [
            {
                type: String,
            },
        ],
        formattingIssues: [
            {
                type: String,
            },
        ],
        suggestions: [
            {
                type: String,
            },
        ],
        sectionScores: {
            summary: { type: Number, default: 0 },
            skills: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            projects: { type: Number, default: 0 },
            education: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

const ATSReport = mongoose.model("ATSReport", ATSReportSchema);
export default ATSReport;
