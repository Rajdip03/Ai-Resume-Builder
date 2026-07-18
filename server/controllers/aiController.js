import ai from "../configs/ai.js";


//controller for enhancing a resume, professional summary
// POST: /api/ai/enhance-professional-summary
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "User content is required" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writing assistant. Your task is to enhance and improve the professional summary of a resume. The summary should be 1-2 sentence also highlighting key skills, experience, and carrer objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ message: "Professional summary enhanced successfully", resume: enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for enhancing a resume, job description
// POST: /api/ai/enhance-job-description
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "User content is required" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writing. Your task is to enhance and improve the job description of a resume. The job description should be only in  1-2 sentence also highlighting key responsibilities, experience, and achievements. use action verbs and quantifiable results where possible.  Make it ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ message: "Job description enhanced successfully", resume: enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writing. Your task is to enhance and improve the job description of a resume. The job description should be only in  1-2 sentence also highlighting key responsibilities, experience, and achievements. use action verbs and quantifiable results where possible.  Make it ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ message: "Job description enhanced successfully", resume: enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}