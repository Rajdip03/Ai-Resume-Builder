import Interview from "../models/Interview.js";
import Resume from "../models/Resume.js";
import {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    generateFinalInterviewReport,
} from "../services/interviewService.js";

/**
 * Helper: Fetches an interview and verifies ownership.
 */
const getOwnedInterview = async (interviewId, userId) => {
    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
        const error = new Error("Interview not found.");
        error.statusCode = 404;
        throw error;
    }
    return interview;
};

// POST /api/interviews/create
export const createInterview = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, jobTitle, jobDescription, interviewType, difficulty, totalQuestions } = req.body;

        if (!resumeId || !jobTitle) {
            return res.status(400).json({ message: "Resume and job title are required." });
        }

        // Verify resume belongs to user
        const resume = await Resume.findOne({ _id: resumeId, userId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found." });
        }

        const validTypes = ["Technical", "HR", "Behavioral", "Mixed"];
        const validDifficulties = ["Easy", "Medium", "Hard"];
        const validCounts = [5, 10, 15];

        const interview = await Interview.create({
            userId,
            resumeId,
            jobTitle: jobTitle.trim(),
            jobDescription: jobDescription?.trim() || "",
            interviewType: validTypes.includes(interviewType) ? interviewType : "Mixed",
            difficulty: validDifficulties.includes(difficulty) ? difficulty : "Medium",
            totalQuestions: validCounts.includes(Number(totalQuestions)) ? Number(totalQuestions) : 10,
            status: "created",
        });

        return res.status(201).json({ message: "Interview created successfully.", interview });
    } catch (error) {
        console.error("Create interview error:", error.message);
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// GET /api/interviews
export const getUserInterviews = async (req, res) => {
    try {
        const userId = req.userId;
        const interviews = await Interview.find({ userId })
            .select("jobTitle interviewType difficulty totalQuestions status overallScore startedAt completedAt createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json(interviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/interviews/:id
export const getInterview = async (req, res) => {
    try {
        const interview = await getOwnedInterview(req.params.id, req.userId);
        return res.status(200).json(interview);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// POST /api/interviews/:id/start
export const startInterview = async (req, res) => {
    try {
        const interview = await getOwnedInterview(req.params.id, req.userId);

        if (interview.status === "completed") {
            return res.status(400).json({ message: "This interview has already been completed." });
        }

        // If already in progress, return current state (supports resume)
        if (interview.status === "in_progress" && interview.questions.length > 0) {
            return res.status(200).json({
                message: "Interview resumed.",
                interview,
            });
        }

        // Fetch the resume for AI question generation
        const resume = await Resume.findById(interview.resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume associated with this interview was not found." });
        }

        // Generate questions using Gemini
        const questions = await generateInterviewQuestions(resume, {
            jobTitle: interview.jobTitle,
            jobDescription: interview.jobDescription,
            interviewType: interview.interviewType,
            difficulty: interview.difficulty,
            totalQuestions: interview.totalQuestions,
        });

        interview.questions = questions;
        interview.status = "in_progress";
        interview.startedAt = new Date();
        interview.currentQuestionIndex = 0;
        await interview.save();

        return res.status(200).json({
            message: "Interview started.",
            interview,
        });
    } catch (error) {
        console.error("Start interview error:", error.message);
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// POST /api/interviews/:id/answer
export const submitAnswer = async (req, res) => {
    try {
        const { answer, questionIndex } = req.body;
        const interview = await getOwnedInterview(req.params.id, req.userId);

        if (interview.status !== "in_progress") {
            return res.status(400).json({ message: "Interview is not in progress." });
        }

        const qIdx = questionIndex !== undefined ? Number(questionIndex) : interview.currentQuestionIndex;

        if (qIdx < 0 || qIdx >= interview.questions.length) {
            return res.status(400).json({ message: "Invalid question index." });
        }

        const currentQuestion = interview.questions[qIdx];

        if (!answer || answer.trim().length === 0) {
            return res.status(400).json({ message: "Answer cannot be empty." });
        }

        // Build context from previous Q&A for adaptive evaluation
        const previousContext = interview.questions
            .slice(0, qIdx)
            .filter((q) => q.answer)
            .map((q) => `Q: ${q.question}\nA: ${q.answer}\nScore: ${q.score}/10`)
            .join("\n\n");

        // Fetch resume for evaluation
        const resume = await Resume.findById(interview.resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found." });
        }

        // Evaluate with Gemini
        const evaluation = await evaluateInterviewAnswer(resume, {
            jobTitle: interview.jobTitle,
            jobDescription: interview.jobDescription,
            question: currentQuestion.question,
            answer: answer.trim(),
            interviewContext: previousContext,
        });

        // Update the question with answer and evaluation
        interview.questions[qIdx].answer = answer.trim();
        interview.questions[qIdx].transcript = answer.trim();
        interview.questions[qIdx].score = evaluation.score;
        interview.questions[qIdx].technicalAccuracy = evaluation.technicalAccuracy;
        interview.questions[qIdx].relevance = evaluation.relevance;
        interview.questions[qIdx].completeness = evaluation.completeness;
        interview.questions[qIdx].communication = evaluation.communication;
        interview.questions[qIdx].strengths = evaluation.strengths;
        interview.questions[qIdx].weaknesses = evaluation.weaknesses;
        interview.questions[qIdx].feedback = evaluation.feedback;
        interview.questions[qIdx].followUpQuestion = evaluation.followUpQuestion;
        interview.questions[qIdx].answeredAt = new Date();

        // If AI recommends a follow-up and we haven't exceeded total questions
        let followUpAdded = false;
        if (evaluation.shouldFollowUp && evaluation.followUpQuestion && interview.questions.length < interview.totalQuestions + 5) {
            // Insert follow-up question right after current
            const followUpQ = {
                question: evaluation.followUpQuestion,
                category: currentQuestion.category,
                difficulty: currentQuestion.difficulty,
                isFollowUp: true,
            };

            // Only add follow-up if we haven't reached too many questions
            if (interview.questions.length < interview.totalQuestions + 3) {
                interview.questions.splice(qIdx + 1, 0, followUpQ);
                followUpAdded = true;
            }
        }

        // Advance current question index
        interview.currentQuestionIndex = qIdx + 1;
        interview.markModified("questions");
        await interview.save();

        // Determine next question
        const nextQIdx = qIdx + 1;
        const hasNextQuestion = nextQIdx < interview.questions.length;
        const nextQuestion = hasNextQuestion ? interview.questions[nextQIdx] : null;

        return res.status(200).json({
            message: "Answer evaluated successfully.",
            evaluation,
            followUpAdded,
            nextQuestion: nextQuestion ? {
                question: nextQuestion.question,
                category: nextQuestion.category,
                difficulty: nextQuestion.difficulty,
                index: nextQIdx,
                isFollowUp: nextQuestion.isFollowUp || false,
            } : null,
            isComplete: !hasNextQuestion,
            currentQuestionIndex: nextQIdx,
            totalQuestions: interview.questions.length,
        });
    } catch (error) {
        console.error("Submit answer error:", error.message);
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// POST /api/interviews/:id/complete
export const completeInterview = async (req, res) => {
    try {
        const interview = await getOwnedInterview(req.params.id, req.userId);

        if (interview.status === "completed") {
            return res.status(200).json({ message: "Interview already completed.", interview });
        }

        // Fetch resume for final report
        const resume = await Resume.findById(interview.resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found." });
        }

        // Generate final report with Gemini
        const report = await generateFinalInterviewReport(resume, interview);

        interview.overallScore = report.overallScore;
        interview.categoryScores = report.categoryScores;
        interview.overallFeedback = report.overallFeedback + (report.recommendation ? `\n\n${report.recommendation}` : "");
        interview.strengths = report.strengths;
        interview.improvements = report.improvements;
        interview.status = "completed";
        interview.completedAt = new Date();
        await interview.save();

        return res.status(200).json({
            message: "Interview completed. Report generated.",
            interview,
        });
    } catch (error) {
        console.error("Complete interview error:", error.message);
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// GET /api/interviews/:id/report
export const getInterviewReport = async (req, res) => {
    try {
        const interview = await getOwnedInterview(req.params.id, req.userId);

        if (interview.status !== "completed") {
            return res.status(400).json({ message: "Interview report is not yet available. Complete the interview first." });
        }

        return res.status(200).json(interview);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// DELETE /api/interviews/:id
export const deleteInterview = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await Interview.findOneAndDelete({ _id: req.params.id, userId });

        if (!result) {
            return res.status(404).json({ message: "Interview not found." });
        }

        return res.status(200).json({ message: "Interview deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
