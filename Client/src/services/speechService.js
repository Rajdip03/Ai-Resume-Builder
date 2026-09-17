// Text-to-Speech

let currentUtterance = null;

/**
 * Speaks the given text using browser SpeechSynthesis.
 * Returns a promise that resolves when speech ends.
 */
export const speak = (text, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
            reject(new Error("Text-to-Speech is not supported in this browser."));
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.95; // control speaking speed
        utterance.pitch = options.pitch || 1; // Pitch controls how high or low the voice sounds.
        utterance.volume = options.volume || 1; // Volume controls how loud or soft the voice sounds.

        // Try to pick a good English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
            (v) => v.lang.startsWith("en") && v.name.includes("Google")
        ) || voices.find((v) => v.lang.startsWith("en"));
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => {
            currentUtterance = null;
            resolve();
        };
        utterance.onerror = (e) => {
            currentUtterance = null;
            // 'interrupted' and 'canceled' are not real errors
            if (e.error === "interrupted" || e.error === "canceled") {
                resolve();
            } else {
                reject(new Error(`Speech synthesis error: ${e.error}`));
            }
        };

        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    });
};

/**
 * Stops any ongoing speech immediately.
 */
export const stopSpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
};


// Returns true if TTS is currently speaking.
 
export const isSpeaking = () => {
    return window.speechSynthesis?.speaking || false;
};

// Speech-to-Text

let recognition = null;

// Checks if Speech Recognition is supported.
export const isSpeechRecognitionSupported = () => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Creates and starts a speech recognition session.
 * @param {Object} callbacks - { onResult, onInterim, onEnd, onError }
 * @returns {Object} - controller with stop() method
 */
export const startListening = (callbacks = {}) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        callbacks.onError?.("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
        return { stop: () => { } };
    }

    // Stop any existing session
    if (recognition) {
        try { recognition.stop(); } catch (e) { /* ignore */ }
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += text + " ";
            } else {
                interim += text;
            }
        }
        callbacks.onInterim?.(finalTranscript + interim);
        if (finalTranscript.trim()) {
            callbacks.onResult?.(finalTranscript.trim());
        }
    };

    recognition.onend = () => {
        callbacks.onEnd?.(finalTranscript.trim());
    };

    recognition.onerror = (event) => {
        let message = "Speech recognition error.";
        switch (event.error) {
            case "not-allowed":
                message = "Microphone permission is required for voice interviews.";
                break;
            case "no-speech":
                message = "We couldn't detect your voice. Please try again.";
                break;
            case "network":
                message = "Network error during speech recognition. Please check your connection.";
                break;
            case "aborted":
                // User stopped — not a real error
                callbacks.onEnd?.(finalTranscript.trim());
                return;
            default:
                message = `Speech recognition error: ${event.error}`;
        }
        callbacks.onError?.(message);
    };

    recognition.start();

    return {
        stop: () => {
            try {
                recognition?.stop();
            } catch (e) { /* ignore */ }
        },
    };
};

/**
 * Stops the current speech recognition session.
 */
export const stopListening = () => {
    if (recognition) {
        try { recognition.stop(); } catch (e) { /* ignore */ }
        recognition = null;
    }
};

// Microphone Permission

// Requests microphone permission and returns true if granted.
export const requestMicrophonePermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop all tracks immediately — we just needed to check permission
        stream.getTracks().forEach((track) => track.stop());
        return true;
    } catch (error) {
        return false;
    }
};

// Preload voices (some browsers load them asynchronously)
if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
