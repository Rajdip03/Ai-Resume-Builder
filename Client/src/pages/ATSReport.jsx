import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
    ArrowLeftIcon, 
    ScanLineIcon, 
    CheckCircle2Icon, 
    AlertCircleIcon, 
    LightbulbIcon, 
    FileTextIcon, 
    AlertTriangleIcon,
    Loader2
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import "./ATSReport.css";

const API_BASE = "http://localhost:3000";

const ATSReport = () => {
    const { resumeId } = useParams();
    const token = localStorage.getItem("token") || "";

    const [loading, setLoading] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [report, setReport] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [animatedScore, setAnimatedScore] = useState(0);

    // Score animation
    useEffect(() => {
        if (!report) return;
        
        const targetScore = report.atsScore;
        let current = 0;
        const step = Math.max(1, Math.floor(targetScore / 50));
        
        const interval = setInterval(() => {
            current = Math.min(current + step, targetScore);
            setAnimatedScore(current);
            if (current >= targetScore) clearInterval(interval);
        }, 30);
        
        return () => clearInterval(interval);
    }, [report]);

    const handleScan = async () => {
        setLoading(true);
        setScanned(false);
        setAnimatedScore(0);
        
        try {
            const res = await fetch(`${API_BASE}/api/ats/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    resumeId,
                    jobDescription: jobDescription.trim() || undefined
                }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Failed to scan resume");
            }
            
            setReport(data.report);
            setScanned(true);
            toast.success("ATS scan complete!");
            
        } catch (err) {
            console.error("Scan error:", err);
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-500 stroke-green-500";
        if (score >= 60) return "text-yellow-500 stroke-yellow-500";
        return "text-red-500 stroke-red-500";
    };
    const getBgColor = (score) => {
        if (score >= 80) return "bg-green-50";
        if (score >= 60) return "bg-yellow-50";
        return "bg-red-50";
    };

    return (
        <div className="ats-container min-h-screen bg-gray-50 pb-12">
            <Toaster position="top-right" />
            
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex items-center shadow-sm">
                <Link to={`/app/builder/${resumeId}`} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors">
                    <ArrowLeftIcon className="size-4" /> Back to Builder
                </Link>
                <div className="flex-1" />
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ScanLineIcon className="text-indigo-600 size-6" />
                    ATS Scanner
                </h1>
            </div>

            <div className="max-w-5xl mx-auto mt-8 px-4 grid md:grid-cols-12 gap-8">
                
                {/* Left Panel: Scan Actions */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileTextIcon className="size-5 text-blue-500" /> Target Job
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Optionally paste a job description below to tailor the ATS analysis against specific requirements.
                        </p>
                        <textarea 
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 outline-none text-sm resize-none"
                            placeholder="Paste Job Description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            disabled={loading}
                        />
                        <button 
                            onClick={handleScan}
                            disabled={loading}
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" /> Scanning...
                                </>
                            ) : (
                                <>
                                    <ScanLineIcon className="size-5" /> Run ATS Scan
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="md:col-span-8">
                    {!scanned && !loading && (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                            <ScanLineIcon className="size-16 mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-600">No report available</p>
                            <p className="text-sm">Click "Run ATS Scan" to analyze your resume.</p>
                        </div>
                    )}
                    
                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
                            <div className="relative flex justify-center items-center mb-6">
                                <div className="absolute size-24 border-4 border-indigo-100 rounded-full"></div>
                                <div className="absolute size-24 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                <ScanLineIcon className="size-8 text-indigo-500 animate-pulse" />
                            </div>
                            <p className="text-lg font-medium text-gray-700">AI is analyzing your resume...</p>
                            <p className="text-sm text-gray-500 mt-2">Checking keywords, formatting, and impact.</p>
                        </div>
                    )}

                    {scanned && report && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Score Header */}
                            <div className={`p-8 flex flex-col md:flex-row items-center gap-8 ${getBgColor(report.atsScore)}`}>
                                <div className="relative size-32 flex-shrink-0">
                                    <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="stroke-current text-gray-200/50"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className={`stroke-current ${getScoreColor(report.atsScore)} transition-all duration-1000 ease-out`}
                                            strokeWidth="3"
                                            strokeDasharray={`${animatedScore}, 100`}
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-bold ${getScoreColor(report.atsScore).split(' ')[0]}`}>
                                            {animatedScore}%
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Overall ATS Match</h2>
                                    <p className="text-gray-600">
                                        {report.atsScore >= 80 ? "Excellent! Your resume is highly optimized and likely to pass ATS screening." 
                                        : report.atsScore >= 60 ? "Good, but could be better. Consider adding missing keywords and fixing formatting issues."
                                        : "Needs significant improvement. Review the suggestions below to optimize your resume for ATS systems."}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Section Scores */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Section Analysis</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(report.sectionScores).map(([section, score]) => (
                                            <div key={section} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-600 capitalize">{section}</span>
                                                    <span className={`text-sm font-bold ${getScoreColor(score).split(' ')[0]}`}>{score}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${getScoreColor(score).split(' ')[0].replace('text-', 'bg-')} transition-all duration-1000`} 
                                                        style={{ width: `${score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing Keywords */}
                                {report.missingKeywords?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                            <AlertTriangleIcon className="size-5 text-orange-500" /> Missing Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {report.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Strengths */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <CheckCircle2Icon className="size-5 text-green-500" /> Strengths
                                        </h3>
                                        <ul className="space-y-3">
                                            {report.strengths.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <div className="mt-1 size-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Weaknesses */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <AlertCircleIcon className="size-5 text-red-500" /> Weaknesses
                                        </h3>
                                        <ul className="space-y-3">
                                            {report.weaknesses.map((w, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <div className="mt-1 size-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Formatting & Suggestions */}
                                <div className="space-y-6">
                                    {report.formattingIssues?.length > 0 && (
                                        <div className="bg-red-50/50 p-5 rounded-xl border border-red-100">
                                            <h3 className="text-sm font-semibold text-red-800 mb-3 uppercase tracking-wider">Formatting Issues</h3>
                                            <ul className="space-y-2">
                                                {report.formattingIssues.map((f, i) => (
                                                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                                        <span>•</span> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {report.suggestions?.length > 0 && (
                                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                                            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                                                <LightbulbIcon className="size-4" /> Suggestions for Improvement
                                            </h3>
                                            <ul className="space-y-2">
                                                {report.suggestions.map((s, i) => (
                                                    <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                                                        <span>•</span> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ATSReport;
