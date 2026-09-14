import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
    Mic,
    BriefcaseIcon,
    FileTextIcon,
    SlidersHorizontal,
    BarChart3,
    Hash,
    ArrowRight,
    LoaderCircle,
    Sparkles,
    ChevronDown,
} from "lucide-react";

const INTERVIEW_TYPES = [
    { value: "Technical", label: "Technical", icon: "💻", desc: "Data structures, algorithms, system design" },
    { value: "HR", label: "HR", icon: "🤝", desc: "Teamwork, leadership, career goals" },
    { value: "Behavioral", label: "Behavioral", icon: "🧠", desc: "STAR method, past experiences" },
    { value: "Mixed", label: "Mixed", icon: "🎯", desc: "Balanced combination of all types" },
];

const DIFFICULTIES = [
    { value: "Easy", label: "Easy", color: "#22c55e", icon: "🟢" },
    { value: "Medium", label: "Medium", color: "#eab308", icon: "🟡" },
    { value: "Hard", label: "Hard", color: "#ef4444", icon: "🔴" },
];

const QUESTION_COUNTS = [5, 10, 15];

const InterviewSetup = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [interviewType, setInterviewType] = useState("Mixed");
    const [difficulty, setDifficulty] = useState("Medium");
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);

    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            const { data } = await api.get("/api/users/resumes", {
                headers: { Authorization: token },
            });
            setResumes(data);
            if (data.length > 0) setSelectedResume(data[0]._id);
        } catch (error) {
            toast.error("Failed to load resumes.");
        }
    };

    const handleStartInterview = async (e) => {
        e.preventDefault();

        if (!selectedResume) {
            toast.error("Please select a resume.");
            return;
        }
        if (!jobTitle.trim()) {
            toast.error("Please enter a target job role.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.post(
                "/api/interviews/create",
                {
                    resumeId: selectedResume,
                    jobTitle: jobTitle.trim(),
                    jobDescription: jobDescription.trim(),
                    interviewType,
                    difficulty,
                    totalQuestions,
                },
                { headers: { Authorization: token } }
            );
            toast.success("Interview created! Preparing questions...");
            navigate(`/app/interview/session/${data.interview._id}`);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create interview.");
        }
        setIsLoading(false);
    };

    const selectedResumeObj = resumes.find((r) => r._id === selectedResume);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 mb-4">
                        <Mic className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-600 bg-clip-text text-transparent">
                        AI Mock Interview
                    </h1>
                    <p className="mt-2 text-slate-500 max-w-lg mx-auto">
                        Practice with an AI interviewer that adapts to your resume. Get real-time feedback and improve your interview skills.
                    </p>
                </div>

                <form onSubmit={handleStartInterview} className="space-y-6">
                    {/* Resume Selection */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <FileTextIcon className="w-4 h-4 text-indigo-500" />
                            Select Resume
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                aria-label="Select a resume"
                            >
                                <span className={selectedResumeObj ? "text-slate-800" : "text-slate-400"}>
                                    {selectedResumeObj ? selectedResumeObj.title : "Choose a resume..."}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${resumeDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {resumeDropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {resumes.length === 0 ? (
                                        <p className="px-4 py-3 text-sm text-slate-400">No resumes found. Create one first.</p>
                                    ) : (
                                        resumes.map((r) => (
                                            <button
                                                key={r._id}
                                                type="button"
                                                onClick={() => { setSelectedResume(r._id); setResumeDropdownOpen(false); }}
                                                className={`w-full px-4 py-3 text-left text-sm hover:bg-indigo-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${selectedResume === r._id ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700"}`}
                                            >
                                                {r.title}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Job Title */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <label htmlFor="job-title" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <BriefcaseIcon className="w-4 h-4 text-indigo-500" />
                            Target Job Role
                        </label>
                        <input
                            id="job-title"
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g., Full Stack Developer, Data Scientist"
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm"
                            required
                        />
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <label htmlFor="job-desc" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                            <FileTextIcon className="w-4 h-4 text-purple-500" />
                            Job Description
                            <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <p className="text-xs text-slate-400 mb-3">Paste a job description for more targeted questions</p>
                        <textarea
                            id="job-desc"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here for more personalized interview questions..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm resize-none"
                        />
                    </div>

                    {/* Interview Type */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                            Interview Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {INTERVIEW_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setInterviewType(type.value)}
                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${interviewType === type.value
                                            ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}
                                    aria-label={`Select ${type.label} interview`}
                                >
                                    <span className="text-2xl">{type.icon}</span>
                                    <span className={`text-sm font-medium ${interviewType === type.value ? "text-indigo-700" : "text-slate-700"}`}>
                                        {type.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 text-center leading-tight hidden sm:block">{type.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty & Question Count Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Difficulty */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                                <BarChart3 className="w-4 h-4 text-indigo-500" />
                                Difficulty
                            </label>
                            <div className="flex gap-3">
                                {DIFFICULTIES.map((d) => (
                                    <button
                                        key={d.value}
                                        type="button"
                                        onClick={() => setDifficulty(d.value)}
                                        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-200 ${difficulty === d.value
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-slate-200 hover:border-slate-300"
                                            }`}
                                        aria-label={`Select ${d.label} difficulty`}
                                    >
                                        <span className="text-lg">{d.icon}</span>
                                        <span className={`text-xs font-medium ${difficulty === d.value ? "text-indigo-700" : "text-slate-600"}`}>
                                            {d.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Count */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                                <Hash className="w-4 h-4 text-indigo-500" />
                                Number of Questions
                            </label>
                            <div className="flex gap-3">
                                {QUESTION_COUNTS.map((count) => (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => setTotalQuestions(count)}
                                        className={`flex-1 py-3 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${totalQuestions === count
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                        aria-label={`Select ${count} questions`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !selectedResume || !jobTitle.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                        aria-label="Start AI interview"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="w-5 h-5 animate-spin" />
                                Creating Interview...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Start AI Interview
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* History Link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate("/app/interview/history")}
                        className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                    >
                        View Interview History →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewSetup;
