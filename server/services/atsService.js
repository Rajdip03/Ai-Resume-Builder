import ai from "../configs/ai.js";

/**
 * Helper to convert a Resume DB document into a raw text string for AI analysis.
 * @param {Object} resume - Mongoose Resume document
 * @returns {String} Raw text representation of the resume
 */
export const resumeToText = (resume) => {
    let text = "";

    text += `Title: ${resume.title}\n`;
    
    if (resume.personal_info) {
        const p = resume.personal_info;
        text += `\nPersonal Info:\n`;
        text += `Name: ${p.full_name}\n`;
        text += `Profession: ${p.profession}\n`;
        text += `Email: ${p.email}\n`;
        text += `Phone: ${p.phone}\n`;
        text += `Location: ${p.location}\n`;
    }

    if (resume.professional_summary) {
        text += `\nProfessional Summary:\n${resume.professional_summary}\n`;
    }

    if (resume.skills && resume.skills.length > 0) {
        text += `\nSkills:\n${resume.skills.join(", ")}\n`;
    }

    if (resume.experiences && resume.experiences.length > 0) {
        text += `\nExperience:\n`;
        resume.experiences.forEach(exp => {
            text += `- ${exp.position} at ${exp.company} (${exp.start_date} to ${exp.is_present ? 'Present' : exp.end_date}) in ${exp.location}\n`;
            text += `  Description: ${exp.description}\n`;
        });
    }

    if (resume.educations && resume.educations.length > 0) {
        text += `\nEducation:\n`;
        resume.educations.forEach(edu => {
            text += `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.graduation_date}), GPA: ${edu.gpa}\n`;
        });
    }

    if (resume.project && resume.project.length > 0) {
        text += `\nProjects:\n`;
        resume.project.forEach(proj => {
            text += `- ${proj.name} (Tech Stack: ${proj.tech_stack})\n`;
            text += `  Description: ${proj.description}\n`;
        });
    }

    return text.trim();
};

/**
 * Analyzes a resume string using Gemini AI and returns structured ATS JSON data.
 * @param {String} resumeText - Raw text representation of the resume
 * @param {String} jobDescription - Optional job description to compare against
 * @returns {Object} Parsed JSON analysis matching ATSReport schema
 */
export const analyzeResumeWithAI = async (resumeText, jobDescription = "") => {
    const jdContext = jobDescription 
        ? `Weight your analysis, specifically 'missingKeywords' and 'atsScore', against this job description: \n${jobDescription}\n\n` 
        : `Score the resume against general ATS best practices and industry standards.\n\n`;

    const systemPrompt = `You are an expert Applicant Tracking System (ATS) and senior technical recruiter. 
Your task is to analyze the provided resume text and output a highly detailed JSON report.

${jdContext}
IMPORTANT: Return ONLY valid JSON matching this exact schema. Do not include markdown fences (like \`\`\`json), no prose, no conversational text.

Schema:
{
  "atsScore": <number 0-100>,
  "strengths": ["<string>", ...],
  "weaknesses": ["<string>", ...],
  "missingKeywords": ["<string>", ...],
  "formattingIssues": ["<string>", ...],
  "suggestions": ["<string>", ...],
  "sectionScores": {
    "summary": <number 0-100>,
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "projects": <number 0-100>,
    "education": <number 0-100>
  }
}`;

    const userPrompt = `Here is the resume text to analyze:\n\n${resumeText}`;

    try {
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL || "gemini-1.5-pro",
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
            // Request JSON object format from the model
            response_format: { type: "json_object" }
        });

        let rawOutput = response.choices[0].message.content;

        // Defensively strip markdown fences if Gemini still includes them
        rawOutput = rawOutput.trim();
        if (rawOutput.startsWith("```json")) {
            rawOutput = rawOutput.replace(/^```json/, "");
        } else if (rawOutput.startsWith("```")) {
            rawOutput = rawOutput.replace(/^```/, "");
        }
        if (rawOutput.endsWith("```")) {
            rawOutput = rawOutput.replace(/```$/, "");
        }
        rawOutput = rawOutput.trim();

        try {
            const parsedData = JSON.parse(rawOutput);
            return parsedData;
        } catch (parseError) {
            console.error("Failed to parse Gemini output:", rawOutput);
            const error = new Error("Failed to parse AI analysis results into valid JSON.");
            error.statusCode = 502;
            throw error;
        }

    } catch (error) {
        // If it's already a 502 parse error, rethrow
        if (error.statusCode === 502) {
            throw error;
        }
        
        // Otherwise it's likely a Gemini API error
        console.error("Gemini API Error:", error);
        const apiError = new Error("Failed to communicate with AI service.");
        apiError.statusCode = 500;
        throw apiError;
    }
};
