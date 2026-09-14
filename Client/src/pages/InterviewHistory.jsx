import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
    Award,
    Clock,
    Trash2,
    Eye,
    Mic,
    PlayCircle,
    ArrowLeft,
    LoaderCircle,
    FileBarChart,
    Calendar,
} from "lucide-react";

const InterviewHistory = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInterviews();
    }, []);

    const loadInterviews = async () => {
        try {
            const { data } = await api.get("/api/interviews", {
                headers: { Authorization: token },
            });
            setInterviews(data);
        } catch (error) {
            toast.error("Failed to load interview history.");
        }
        setLoading(false);
    };

    const deleteInterview = async (interviewId) => {
        if (!window.confirm("Are you sure you want to delete this interview?")) return;
        try {
            await api.delete(`/api/interviews/${interviewId}`, {
                headers: { Authorization: token },
            });
            setInterviews(interviews.filter((i) => i._id !== interviewId));
            toast.success("Interview deleted.");
        } catch (error) {
            toast.error("Failed to delete interview.");
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-amber-500";
        return "text-red-500";
    };

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-emerald-50 border-emerald-200";
        if (score >= 60) return "bg-amber-50 border-amber-200";
        return "bg-red-50 border-red-200";
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">Completed</span>;
            case "in_progress":
                return <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">In Progress</span>;
            default:
                return <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
                <LoaderCircle className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/app/interview")}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Interview Setup
                </button>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
                            <FileBarChart className="w-7 h-7 text-indigo-500" />
                            Interview History
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">{interviews.length} interview{interviews.length !== 1 ? "s" : ""}</p>
                    </div>
                    <button
                        onClick={() => navigate("/app/interview")}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
                    >
                        <Mic className="w-4 h-4" /> New Interview
                    </button>
                </div>

                {/* Empty State */}
                {interviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <Mic className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No interviews yet</h3>
                        <p className="text-sm text-slate-500 mb-4">Start your first AI mock interview to practice for your dream job.</p>
                        <button
                            onClick={() => navigate("/app/interview")}
                            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-xl transition-colors"
                        >
                            Start Interview
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {interviews.map((interview) => (
                            <div
                                key={interview._id}
                                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-semibold text-slate-800 truncate">{interview.jobTitle}</h3>
                                            {getStatusBadge(interview.status)}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(interview.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                            </span>
                                            <span>{interview.interviewType}</span>
                                            <span>{interview.difficulty}</span>
                                            <span>{interview.totalQuestions} Q</span>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    {interview.status === "completed" && (
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl border flex flex-col items-center justify-center ${getScoreBg(interview.overallScore)}`}>
                                            <span className={`text-lg font-bold ${getScoreColor(interview.overallScore)}`}>
                                                {interview.overallScore}
                                            </span>
                                            <span className="text-[9px] text-slate-400">/100</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                    {interview.status === "completed" ? (
                                        <button
                                            onClick={() => navigate(`/app/interview/report/${interview._id}`)}
                                            className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View Report
                                        </button>
                                    ) : interview.status === "in_progress" ? (
                                        <button
                                            onClick={() => navigate(`/app/interview/session/${interview._id}`)}
                                            className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" /> Resume
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/app/interview/session/${interview._id}`)}
                                            className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-700 font-medium transition-colors"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" /> Start
                                        </button>
                                    )}
                                    <span className="flex-1" />
                                    <button
                                        onClick={() => deleteInterview(interview._id)}
                                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label="Delete interview"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewHistory;
