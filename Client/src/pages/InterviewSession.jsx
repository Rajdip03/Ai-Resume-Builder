import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isSpeechRecognitionSupported,
    requestMicrophonePermission,
} from "../services/speechService";
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Send,
    SkipForward,
    Square,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
    Clock,
    MessageSquare,
    ChevronRight,
    XCircle,
    Keyboard,
} from "lucide-react";

// Interview state machine
const STATES = {
    LOADING: "LOADING",
    IDLE: "IDLE",
    AI_SPEAKING: "AI_SPEAKING",
    WAITING_FOR_USER: "WAITING_FOR_USER",
    USER_SPEAKING: "USER_SPEAKING",
    PROCESSING_ANSWER: "PROCESSING_ANSWER",
    SHOWING_FEEDBACK: "SHOWING_FEEDBACK",
    COMPLETED: "COMPLETED",
    ERROR: "ERROR",
};

const InterviewSession = () => {
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Interview data
    const [interview, setInterview] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    // State machine
    const [interviewState, setInterviewState] = useState(STATES.LOADING);

    // User answer
    const [textAnswer, setTextAnswer] = useState("");
    const [transcript, setTranscript] = useState("");
    const [useTextMode, setUseTextMode] = useState(false);

    // Feedback
    const [lastEvaluation, setLastEvaluation] = useState(null);

    // Timer
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef(null);

    // Speech recognition controller
    const recognitionRef = useRef(null);

    // Auto-speak toggle
    const [autoSpeak, setAutoSpeak] = useState(true);

    // Error message
    const [errorMessage, setErrorMessage] = useState("");

    // ─── Timer ────────────────────────────────────────────
    useEffect(() => {
        if (interviewState !== STATES.LOADING && interviewState !== STATES.COMPLETED && interviewState !== STATES.ERROR) {
            timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [interviewState]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // ─── Start Interview ──────────────────────────────────
    useEffect(() => {
        startInterviewSession();
        return () => {
            stopSpeaking();
            stopListening();
            clearInterval(timerRef.current);
        };
    }, []);

    const startInterviewSession = async () => {
        try {
            setInterviewState(STATES.LOADING);
            const { data } = await api.post(`/api/interviews/${id}/start`, {}, {
                headers: { Authorization: token },
            });

            const iv = data.interview;
            setInterview(iv);
            setTotalQuestions(iv.questions.length);

            // Find current position (support resuming)
            const idx = iv.currentQuestionIndex || 0;
            // If resuming, find first unanswered question
            let startIdx = idx;
            for (let i = 0; i < iv.questions.length; i++) {
                if (!iv.questions[i].answer) {
                    startIdx = i;
                    break;
                }
                if (i === iv.questions.length - 1) {
                    startIdx = iv.questions.length; // all answered
                }
            }

            if (startIdx >= iv.questions.length) {
                setInterviewState(STATES.COMPLETED);
                return;
            }

            setCurrentQuestionIndex(startIdx);
            setCurrentQuestion(iv.questions[startIdx]);
            presentQuestion(iv.questions[startIdx]);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Failed to start interview.");
            setInterviewState(STATES.ERROR);
        }
    };

    // ─── Present Question (TTS) ───────────────────────────
    const presentQuestion = useCallback(async (question) => {
        setLastEvaluation(null);
        setTranscript("");
        setTextAnswer("");

        if (autoSpeak && question) {
            setInterviewState(STATES.AI_SPEAKING);
            try {
                await speak(question.question);
            } catch (e) {
                // TTS failed — just continue
            }
        }

        setInterviewState(STATES.WAITING_FOR_USER);
    }, [autoSpeak]);

    // ─── Voice Recording ──────────────────────────────────
    const startRecording = async () => {
        if (!isSpeechRecognitionSupported()) {
            toast.error("Voice recognition isn't supported in this browser. Please use Chrome or Edge, or switch to Text mode.");
            setUseTextMode(true);
            return;
        }

        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            toast.error("Microphone permission is required for voice interviews.");
            return;
        }

        setTranscript("");
        setInterviewState(STATES.USER_SPEAKING);

        recognitionRef.current = startListening({
            onInterim: (text) => setTranscript(text),
            onResult: (text) => setTranscript(text),
            onEnd: (text) => {
                setTranscript(text);
                if (text.trim()) {
                    setInterviewState(STATES.WAITING_FOR_USER);
                } else {
                    toast.error("We couldn't detect your voice. Please try again.");
                    setInterviewState(STATES.WAITING_FOR_USER);
                }
            },
            onError: (msg) => {
                toast.error(msg);
                setInterviewState(STATES.WAITING_FOR_USER);
            },
        });
    };

    const stopRecording = () => {
        recognitionRef.current?.stop();
        stopListening();
        setInterviewState(STATES.WAITING_FOR_USER);
    };

    // ─── Submit Answer ────────────────────────────────────
    const submitAnswer = async () => {
        const answer = useTextMode ? textAnswer.trim() : transcript.trim();

        if (!answer) {
            toast.error("Please provide an answer before submitting.");
            return;
        }

        setInterviewState(STATES.PROCESSING_ANSWER);

        try {
            const { data } = await api.post(
                `/api/interviews/${id}/answer`,
                { answer, questionIndex: currentQuestionIndex },
                { headers: { Authorization: token } }
            );

            setLastEvaluation(data.evaluation);
            setInterviewState(STATES.SHOWING_FEEDBACK);

            // Update totals if follow-ups were added
            if (data.totalQuestions) setTotalQuestions(data.totalQuestions);

            // Check if interview is complete
            if (data.isComplete) {
                setTimeout(() => completeInterview(), 3000);
            } else if (data.nextQuestion) {
                // Store next question info
                setCurrentQuestionIndex(data.currentQuestionIndex);
                setCurrentQuestion(data.nextQuestion);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to evaluate answer. Please try again.");
            setInterviewState(STATES.WAITING_FOR_USER);
        }
    };

    // ─── Next Question ────────────────────────────────────
    const goToNextQuestion = () => {
        if (currentQuestion) {
            presentQuestion(currentQuestion);
        }
    };

    // ─── Complete Interview ───────────────────────────────
    const completeInterview = async () => {
        try {
            setInterviewState(STATES.LOADING);
            await api.post(`/api/interviews/${id}/complete`, {}, {
                headers: { Authorization: token },
            });
            setInterviewState(STATES.COMPLETED);
        } catch (error) {
            toast.error("Failed to generate final report.");
            setInterviewState(STATES.COMPLETED);
        }
    };

    // ─── End Interview Early ──────────────────────────────
    const endInterviewEarly = async () => {
        stopSpeaking();
        stopListening();

        if (window.confirm("Are you sure you want to end the interview? Your progress will be saved.")) {
            await completeInterview();
        }
    };

    // ─── Re-record ────────────────────────────────────────
    const reRecord = () => {
        setTranscript("");
        setTextAnswer("");
        startRecording();
    };

    // ─── Progress Bar ─────────────────────────────────────
    const progress = totalQuestions > 0 ? ((currentQuestionIndex) / totalQuestions) * 100 : 0;

    // ─── Score Color ──────────────────────────────────────
    const getScoreColor = (score) => {
        if (score >= 8) return "text-emerald-500";
        if (score >= 6) return "text-amber-500";
        return "text-red-500";
    };

    const getScoreBg = (score) => {
        if (score >= 8) return "bg-emerald-50 border-emerald-200";
        if (score >= 6) return "bg-amber-50 border-amber-200";
        return "bg-red-50 border-red-200";
    };

    // ─── RENDER ───────────────────────────────────────────

    if (interviewState === STATES.LOADING) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-ping opacity-30"></div>
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                            <LoaderCircle className="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                    <p className="text-white text-lg font-medium">Preparing your interview...</p>
                    <p className="text-indigo-300 text-sm mt-1">AI is generating personalized questions</p>
                </div>
            </div>
        );
    }

    if (interviewState === STATES.ERROR) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-white/10">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl text-white font-semibold mb-2">Interview Error</h2>
                    <p className="text-slate-300 mb-6">{errorMessage}</p>
                    <button
                        onClick={() => navigate("/app/interview")}
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                    >
                        Back to Setup
                    </button>
                </div>
            </div>
        );
    }

    if (interviewState === STATES.COMPLETED) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-white/10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl text-white font-bold mb-2">Interview Complete!</h2>
                    <p className="text-slate-300 mb-2">Duration: {formatTime(elapsedSeconds)}</p>
                    <p className="text-indigo-300 text-sm mb-6">Your AI interview report is ready.</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate(`/app/interview/report/${id}`)}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                            View Report
                        </button>
                        <button
                            onClick={() => navigate("/app/interview")}
                            className="w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                        >
                            New Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
            {/* Top Bar */}
            <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-white font-semibold text-sm sm:text-base">AI Mock Interview</h1>
                        <span className="text-indigo-300 text-xs px-2 py-0.5 bg-indigo-500/20 rounded-full">
                            {interview?.interviewType} • {interview?.difficulty}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                            <Clock className="w-4 h-4" />
                            {formatTime(elapsedSeconds)}
                        </div>
                        <button
                            onClick={endInterviewEarly}
                            className="text-xs px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                            aria-label="End interview"
                        >
                            End Interview
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-5xl mx-auto px-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-indigo-300 text-xs font-medium">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-indigo-300 text-xs">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Question Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 mb-6">
                    {/* AI Avatar */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🤖</span>
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">AI Interviewer</p>
                            <p className="text-indigo-300 text-xs">
                                {currentQuestion?.category} • {currentQuestion?.difficulty}
                                {currentQuestion?.isFollowUp && (
                                    <span className="ml-2 text-amber-300">Follow-up</span>
                                )}
                            </p>
                        </div>
                        {interviewState === STATES.AI_SPEAKING && (
                            <div className="ml-auto flex items-center gap-1.5">
                                <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                                <span className="text-indigo-300 text-xs">Speaking...</span>
                                <button onClick={stopSpeaking} className="ml-2 text-slate-400 hover:text-white" aria-label="Stop speaking">
                                    <VolumeX className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Question Text */}
                    <p className="text-white text-lg sm:text-xl font-medium leading-relaxed">
                        "{currentQuestion?.question}"
                    </p>
                </div>

                {/* Feedback Card (shown after evaluation) */}
                {interviewState === STATES.SHOWING_FEEDBACK && lastEvaluation && (
                    <div className={`rounded-2xl p-6 mb-6 border ${getScoreBg(lastEvaluation.score)}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-800">Answer Evaluation</h3>
                            <span className={`text-2xl font-bold ${getScoreColor(lastEvaluation.score)}`}>
                                {lastEvaluation.score}/10
                            </span>
                        </div>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            {[
                                { label: "Technical", value: lastEvaluation.technicalAccuracy },
                                { label: "Relevance", value: lastEvaluation.relevance },
                                { label: "Completeness", value: lastEvaluation.completeness },
                                { label: "Communication", value: lastEvaluation.communication },
                            ].map((item) => (
                                <div key={item.label} className="bg-white/80 rounded-lg p-2 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
                                    <p className={`text-lg font-bold ${getScoreColor(item.value)}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Strengths */}
                        {lastEvaluation.strengths?.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-semibold text-emerald-700 mb-1">✓ Strengths</p>
                                <ul className="text-sm text-slate-700 space-y-0.5">
                                    {lastEvaluation.strengths.map((s, i) => (
                                        <li key={i} className="pl-3 relative before:absolute before:left-0 before:content-['•'] before:text-emerald-500">{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Weaknesses */}
                        {lastEvaluation.weaknesses?.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-semibold text-amber-700 mb-1">⚠ Areas to Improve</p>
                                <ul className="text-sm text-slate-700 space-y-0.5">
                                    {lastEvaluation.weaknesses.map((w, i) => (
                                        <li key={i} className="pl-3 relative before:absolute before:left-0 before:content-['•'] before:text-amber-500">{w}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Feedback */}
                        <p className="text-sm text-slate-600 italic mt-2">{lastEvaluation.feedback}</p>

                        {/* Next Question Button */}
                        <button
                            onClick={goToNextQuestion}
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            Next Question <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Answer Area */}
                {(interviewState === STATES.WAITING_FOR_USER ||
                    interviewState === STATES.USER_SPEAKING ||
                    interviewState === STATES.PROCESSING_ANSWER) && (
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            {/* Mode Toggle */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-indigo-300 text-sm font-medium">Your Answer</p>
                                <button
                                    onClick={() => { setUseTextMode(!useTextMode); stopListening(); }}
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    aria-label={useTextMode ? "Switch to voice mode" : "Switch to text mode"}
                                >
                                    {useTextMode ? <Mic className="w-3.5 h-3.5" /> : <Keyboard className="w-3.5 h-3.5" />}
                                    {useTextMode ? "Voice Mode" : "Text Mode"}
                                </button>
                            </div>

                            {/* Text Mode */}
                            {useTextMode ? (
                                <div>
                                    <textarea
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                        placeholder="Type your answer here..."
                                        rows={5}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        disabled={interviewState === STATES.PROCESSING_ANSWER}
                                    />
                                    <button
                                        onClick={submitAnswer}
                                        disabled={!textAnswer.trim() || interviewState === STATES.PROCESSING_ANSWER}
                                        className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {interviewState === STATES.PROCESSING_ANSWER ? (
                                            <><LoaderCircle className="w-4 h-4 animate-spin" /> Evaluating...</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Submit Answer</>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {/* Transcript */}
                                    {transcript && (
                                        <div className="mb-4 p-4 bg-white/5 rounded-xl">
                                            <p className="text-xs text-indigo-300 mb-1 font-medium">You said:</p>
                                            <p className="text-white text-sm leading-relaxed">{transcript}</p>
                                        </div>
                                    )}

                                    {/* Voice Controls */}
                                    <div className="flex items-center justify-center gap-4">
                                        {interviewState === STATES.USER_SPEAKING ? (
                                            <button
                                                onClick={stopRecording}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors animate-pulse"
                                                aria-label="Stop recording"
                                            >
                                                <Square className="w-4 h-4" /> Stop Recording
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={startRecording}
                                                    disabled={interviewState === STATES.PROCESSING_ANSWER}
                                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                                                    aria-label="Start voice recording"
                                                >
                                                    <Mic className="w-4 h-4" />
                                                    {transcript ? "Re-record" : "Start Speaking"}
                                                </button>

                                                {transcript && (
                                                    <button
                                                        onClick={submitAnswer}
                                                        disabled={interviewState === STATES.PROCESSING_ANSWER}
                                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                                                    >
                                                        {interviewState === STATES.PROCESSING_ANSWER ? (
                                                            <><LoaderCircle className="w-4 h-4 animate-spin" /> Evaluating...</>
                                                        ) : (
                                                            <><Send className="w-4 h-4" /> Submit</>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Recording indicator */}
                                    {interviewState === STATES.USER_SPEAKING && (
                                        <div className="flex items-center justify-center gap-2 mt-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            <span className="text-red-300 text-xs">Recording... Speak clearly</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                {/* Processing Overlay */}
                {interviewState === STATES.PROCESSING_ANSWER && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-indigo-300">
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        <span className="text-sm">AI is evaluating your answer...</span>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10 py-3">
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                    <button
                        onClick={() => setAutoSpeak(!autoSpeak)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${autoSpeak ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-slate-500"}`}
                        aria-label={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
                    >
                        {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        Auto-speak {autoSpeak ? "On" : "Off"}
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">
                            {interview?.jobTitle}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewSession;
