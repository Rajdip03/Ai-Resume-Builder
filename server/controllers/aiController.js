import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";


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
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const systemPrompt = "You are an expert AI Agent to extact data from resume.";
        const userPrompt = `extract data from this resume : ${resumeText} provide data in the following JSON format with no additional text before or after:
        
        {
        personal_info: {
            image: {
            type: String,
            default: ""
            },
        full_name: {
            type: String,
            default: ""
            },
        profession: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        linkedin: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
    },
        professional_summary: {
            type: String,
            default: "",
        },
        skills: [
            {
                type: String,
            }
        ],
        experiences:[
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            is_present: { type: Boolean },
            description: { type: String },
            location: { type: String },
        }
        ],
        project: [
        {
            name: { type: String },
            tech_stack: { type: String },
            description: { type: String },
            link: { type: String }
        }
    ],
    educations: [
        {
            degree: { type: String },
            institution: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            location: { type: String },
            gpa: { type: String },
        }
    ],
    
        }
        `
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: { type: "json_object" }
        });
        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData,
        })
        return res.json({ message: "Resume uploaded successfully", resume: newResume });
    } catch (error) {
        console.error("UPLOAD RESUME ERROR:");
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}