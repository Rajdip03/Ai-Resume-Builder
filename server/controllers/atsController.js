import Resume from "../models/Resume.js";
import ATSReport from "../models/ATSReport.js";
import { resumeToText, analyzeResumeWithAI } from "../services/atsService.js";

/**
 * Scan a resume for ATS compatibility using Gemini AI.
 * Accepts resumeId (fetches from DB) OR resumeText (raw text), plus optional jobDescription.
 * POST: /api/ats/scan
 */
export const scanResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeText, jobDescription } = req.body;

        // Validate: at least one of resumeId or resumeText must be provided
        if (!resumeId && !resumeText) {
            return res.status(400).json({ 
                message: "Either resumeId or resumeText is required" 
            });
        }

        let textToAnalyze = "";
        let linkedResumeId = null;

        // If resumeId is provided, fetch the resume from MongoDB and convert to text
        if (resumeId) {
            const resume = await Resume.findOne({ _id: resumeId, userId });
            
            if (!resume) {
                // If the resume doesn't exist or belongs to someone else
                return res.status(403).json({ message: "Resume not found or unauthorized access" });
            }

            textToAnalyze = resumeToText(resume);
            linkedResumeId = resume._id;
        } else {
            // Use the provided raw resume text
            textToAnalyze = resumeText;
        }

        // Validate that we have actual content to analyze
        if (!textToAnalyze || textToAnalyze.trim().length < 20) {
            return res.status(400).json({ 
                message: "Resume content is too short to analyze. Please provide more details." 
            });
        }

        // Analyze the resume using Gemini AI
        const analysisResult = await analyzeResumeWithAI(textToAnalyze, jobDescription || "");

        // Save the ATS report to MongoDB
        const atsReport = await ATSReport.create({
            userId,
            resumeId: linkedResumeId,
            jobDescription: jobDescription || "",
            atsScore: analysisResult.atsScore,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            missingKeywords: analysisResult.missingKeywords,
            formattingIssues: analysisResult.formattingIssues,
            suggestions: analysisResult.suggestions,
            sectionScores: analysisResult.sectionScores,
        });

        return res.status(201).json({ 
            message: "ATS scan completed successfully", 
            report: atsReport 
        });

    } catch (error) {
        console.error("ATS Scan Error:", error);

        // Handle specific AI parsing errors (502)
        if (error.statusCode === 502) {
            return res.status(502).json({ message: error.message });
        }

        // Handle general server errors (500)
        return res.status(500).json({ message: "ATS scan failed: " + error.message });
    }
};

/**
 * Get all ATS reports for the authenticated user.
 * GET: /api/ats/reports
 */
export const getATSReports = async (req, res) => {
    try {
        const userId = req.userId;
        const reports = await ATSReport.find({ userId })
            .sort({ createdAt: -1 })
            .select("-__v");

        return res.status(200).json({
            message: "ATS reports fetched successfully",
            reports,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Get a specific ATS report by its ID.
 * GET: /api/ats/reports/:id
 */
export const getATSReportById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const report = await ATSReport.findOne({ _id: id, userId }).select("-__v");

        if (!report) {
            return res.status(404).json({ message: "ATS report not found" });
        }

        return res.status(200).json({
            message: "ATS report fetched successfully",
            report,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
