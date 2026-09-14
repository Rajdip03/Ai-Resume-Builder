/**
 * Centralized prompt templates for the AI Interview feature.
 * Keeps prompts out of controllers for maintainability.
 */

/**
 * Builds the system prompt for generating interview questions.
 */
export const buildQuestionGenerationPrompt = ({ resumeText, jobTitle, jobDescription, interviewType, difficulty, totalQuestions }) => {
    const jdSection = jobDescription
        ? `\nJob Description:\n${jobDescription}\n`
        : `\nNo specific job description provided. Generate questions based on the resume and the target role "${jobTitle}".\n`;

    return {
        system: `You are an expert technical interviewer conducting a ${interviewType} interview for a "${jobTitle}" position at ${difficulty} difficulty level.

RULES:
1. Only reference technologies, projects, and experience ACTUALLY present in the candidate's resume.
2. NEVER fabricate or assume candidate experience that is not in the resume.
3. Mix questions across relevant skills found in the resume.
4. Respect the difficulty level: ${difficulty}.
5. Respect the interview type: ${interviewType}.
6. Do NOT generate duplicate or near-duplicate questions.
7. Keep questions concise enough for voice interaction (1-3 sentences max).
8. For Technical interviews: focus on technical skills, coding, system design, and problem solving.
9. For HR interviews: focus on teamwork, leadership, career goals, and situational questions.
10. For Behavioral interviews: use STAR-method style questions about past experiences.
11. For Mixed interviews: combine all types proportionally.
12. Make questions personalized to the candidate's resume content whenever possible.

IMPORTANT: Return ONLY valid JSON matching the exact schema below. No markdown fences, no extra text.

Schema:
{
  "questions": [
    {
      "question": "<string: the interview question>",
      "category": "<string: e.g. 'React.js', 'System Design', 'Leadership', 'Problem Solving'>",
      "difficulty": "<string: 'Easy' | 'Medium' | 'Hard'>"
    }
  ]
}

Generate exactly ${totalQuestions} questions.`,

        user: `Here is the candidate's resume:\n\n${resumeText}\n${jdSection}\nGenerate ${totalQuestions} personalized ${interviewType} interview questions at ${difficulty} difficulty.`
    };
};

/**
 * Builds the prompt for evaluating a single interview answer.
 */
export const buildAnswerEvaluationPrompt = ({ resumeText, jobTitle, jobDescription, question, answer, interviewContext }) => {
    const contextSection = interviewContext
        ? `\nPrevious interview context:\n${interviewContext}\n`
        : "";

    return {
        system: `You are an expert interview evaluator assessing a candidate's answer for a "${jobTitle}" position.

Evaluate the answer on these dimensions (score each 1-10):
- Technical Accuracy: correctness of technical claims
- Relevance: how well the answer addresses the question
- Completeness: how thorough the answer is
- Communication: clarity, structure, and articulation

Also determine if a follow-up question would be appropriate:
- If the answer is vague or incomplete, generate a probing follow-up.
- If the answer is excellent, optionally generate a harder follow-up to test depth.
- If the answer is adequate and complete, set shouldFollowUp to false.

RULES:
1. Be fair and constructive in feedback.
2. Reference specific parts of the answer in strengths/weaknesses.
3. Never fabricate candidate experience.
4. Keep feedback concise and actionable.
5. The follow-up question must be related to the original question/answer.

IMPORTANT: Return ONLY valid JSON matching the exact schema below. No markdown fences, no extra text.

Schema:
{
  "score": <number 1-10>,
  "technicalAccuracy": <number 1-10>,
  "relevance": <number 1-10>,
  "completeness": <number 1-10>,
  "communication": <number 1-10>,
  "strengths": ["<string>"],
  "weaknesses": ["<string>"],
  "feedback": "<string: constructive feedback paragraph>",
  "shouldFollowUp": <boolean>,
  "followUpQuestion": "<string: follow-up question or empty string>"
}`,

        user: `Resume:\n${resumeText}\n\nJob Title: ${jobTitle}\n${jobDescription ? `Job Description: ${jobDescription}\n` : ""}${contextSection}\nQuestion: ${question}\n\nCandidate's Answer: ${answer}\n\nEvaluate the answer.`
    };
};

/**
 * Builds the prompt for generating the final comprehensive interview report.
 */
export const buildFinalReportPrompt = ({ resumeText, jobTitle, jobDescription, questionsAndAnswers }) => {
    const qaText = questionsAndAnswers.map((qa, i) =>
        `Q${i + 1} [${qa.category}]: ${qa.question}\nAnswer: ${qa.answer || "(No answer provided)"}\nScore: ${qa.score}/10`
    ).join("\n\n");

    return {
        system: `You are an expert interview evaluator generating a final comprehensive interview report for a "${jobTitle}" position.

Analyze ALL the questions and answers holistically. Consider:
- Overall performance patterns
- Consistent strengths and weaknesses
- Technical depth across topics
- Communication quality throughout
- Areas where the candidate improved or declined during the interview

IMPORTANT: Return ONLY valid JSON matching the exact schema below. No markdown fences, no extra text.

Schema:
{
  "overallScore": <number 0-100>,
  "categoryScores": {
    "technicalKnowledge": <number 0-100>,
    "communication": <number 0-100>,
    "problemSolving": <number 0-100>,
    "relevance": <number 0-100>
  },
  "overallFeedback": "<string: comprehensive 2-4 sentence evaluation>",
  "strengths": ["<string: specific strength>"],
  "improvements": ["<string: specific area to improve>"],
  "recommendation": "<string: 2-3 sentence actionable career advice>"
}`,

        user: `Resume:\n${resumeText}\n\nJob Title: ${jobTitle}\n${jobDescription ? `Job Description: ${jobDescription}\n` : ""}\n\nInterview Questions and Answers:\n\n${qaText}\n\nGenerate a comprehensive final interview report.`
    };
};
