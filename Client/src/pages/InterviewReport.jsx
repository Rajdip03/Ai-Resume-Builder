import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
    Award,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    LoaderCircle,
    Star,
    BarChart3,
    MessageSquare,
    Target,
    Brain,
    Zap,
} from "lucide-react";

const InterviewReport = () => {
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {
        try {
            const { data } = await api.get(`/api/interviews/${id}/report`, {
                headers: { Authorization: token },
            });
            setReport(data);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load interview report.");
        }
        setLoading(false);
    };

    const getScoreColor = (score, max = 100) => {
        const pct = max === 10 ? score * 10 : score;
        if (pct >= 80) return "text-emerald-500";
        if (pct >= 60) return "text-amber-500";
        return "text-red-500";
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return "from-emerald-500 to-teal-500";
        if (score >= 60) return "from-amber-500 to-orange-500";
        return "from-red-500 to-rose-500";
    };

    const getScoreBarColor = (score) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-amber-500";
        return "bg-red-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
                <LoaderCircle className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Report not found.</p>
                    <button onClick={() => navigate("/app/interview/history")} className="text-indigo-500 hover:text-indigo-700 font-medium">
                        ← Back to History
                    </button>
                </div>
            </div>
        );
    }

    const categoryIcons = {
        technicalKnowledge: <Brain className="w-4 h-4" />,
        communication: <MessageSquare className="w-4 h-4" />,
        problemSolving: <Zap className="w-4 h-4" />,
        relevance: <Target className="w-4 h-4" />,
    };

    const categoryLabels = {
        technicalKnowledge: "Technical Knowledge",
        communication: "Communication",
        problemSolving: "Problem Solving",
        relevance: "Relevance",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/app/interview/history")}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to History
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">AI Interview Report</h1>
                    <p className="text-slate-500">
                        {report.jobTitle} • {report.interviewType} • {report.difficulty}
                    </p>
                    {report.completedAt && (
                        <p className="text-xs text-slate-400 mt-1">
                            {new Date(report.completedAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                        </p>
                    )}
                </div>

                {/* Overall Score */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="54" fill="none"
                                stroke="url(#scoreGradient)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(report.overallScore / 100) * 339.3} 339.3`}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={report.overallScore >= 80 ? "#10b981" : report.overallScore >= 60 ? "#f59e0b" : "#ef4444"} />
                                    <stop offset="100%" stopColor={report.overallScore >= 80 ? "#14b8a6" : report.overallScore >= 60 ? "#f97316" : "#f43f5e"} />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                                {report.overallScore}
                            </span>
                            <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">Overall Score</p>
                </div>

                {/* Category Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {Object.entries(report.categoryScores || {}).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${getScoreColor(value)} bg-opacity-10`}
                                style={{ backgroundColor: value >= 80 ? '#d1fae520' : value >= 60 ? '#fef3c720' : '#fee2e220' }}>
                                {categoryIcons[key]}
                            </div>
                            <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}%</p>
                            <p className="text-xs text-slate-500 mt-0.5">{categoryLabels[key]}</p>
                        </div>
                    ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Strengths */}
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-3">
                            <CheckCircle2 className="w-4 h-4" /> Strong Areas
                        </h3>
                        <ul className="space-y-2">
                            {(report.strengths || []).map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500 mt-0.5">✓</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Improvements */}
                    <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-700 mb-3">
                            <AlertTriangle className="w-4 h-4" /> Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                            {(report.improvements || []).map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-amber-500 mt-0.5">⚠</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Overall Feedback */}
                {report.overallFeedback && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 mb-6">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-700 mb-2">
                            <Star className="w-4 h-4" /> AI Recommendation
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{report.overallFeedback}</p>
                    </div>
                )}

                {/* Question Analysis */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" /> Question Analysis
                    </h2>

                    <div className="space-y-3">
                        {(report.questions || []).map((q, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                                    aria-label={`Toggle question ${i + 1} details`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white bg-gradient-to-r ${getScoreGradient(q.score * 10)}`}>
                                            {q.score}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 line-clamp-1">
                                                Q{i + 1}: {q.question}
                                            </p>
                                            <p className="text-xs text-slate-400">{q.category} • {q.difficulty}</p>
                                        </div>
                                    </div>
                                    {expandedQuestion === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>

                                {expandedQuestion === i && (
                                    <div className="px-5 pb-5 border-t border-slate-100">
                                        <div className="mt-4 space-y-3">
                                            {/* Scores */}
                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    { label: "Technical", val: q.technicalAccuracy },
                                                    { label: "Relevance", val: q.relevance },
                                                    { label: "Complete", val: q.completeness },
                                                    { label: "Comms", val: q.communication },
                                                ].map((s) => (
                                                    <div key={s.label} className="text-center">
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-1">
                                                            <div className={`h-full rounded-full ${getScoreBarColor(s.val * 10)}`} style={{ width: `${s.val * 10}%` }} />
                                                        </div>
                                                        <p className="text-[10px] text-slate-500">{s.label}: {s.val}/10</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Your Answer */}
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Your Answer</p>
                                                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
                                                    {q.answer || <span className="italic text-slate-400">No answer provided</span>}
                                                </p>
                                            </div>

                                            {/* Strengths */}
                                            {q.strengths?.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold text-emerald-600 mb-1">What you did well</p>
                                                    <ul className="text-sm text-slate-700 space-y-0.5">
                                                        {q.strengths.map((s, j) => <li key={j}>✓ {s}</li>)}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Weaknesses */}
                                            {q.weaknesses?.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold text-amber-600 mb-1">What was missing</p>
                                                    <ul className="text-sm text-slate-700 space-y-0.5">
                                                        {q.weaknesses.map((w, j) => <li key={j}>⚠ {w}</li>)}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Feedback */}
                                            {q.feedback && (
                                                <div>
                                                    <p className="text-xs font-semibold text-indigo-600 mb-1">AI Feedback</p>
                                                    <p className="text-sm text-slate-600 italic">{q.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate("/app/interview")}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        New Interview
                    </button>
                    <button
                        onClick={() => navigate("/app/interview/history")}
                        className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewReport;
