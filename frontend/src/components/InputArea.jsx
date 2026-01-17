import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Send, Mic, MicOff } from "lucide-react";

const InputArea = ({ onSendMessage, mode, isVoiceMode, setIsVoiceMode, isAISpeaking, onUserSpeaking }) => {
    const [input, setInput] = useState("");
    const textareaRef = useRef(null);
    const silenceTimerRef = useRef(null);

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Ajustement de la hauteur du textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    // Synchronisation du transcript avec le state input
    useEffect(() => {
        if (isVoiceMode && transcript) {
            setInput(transcript);

            // --- LOGIQUE DU TIMER (SILENCE DEBOUNCE) ---
            // Dès que le transcript change, on réinitialise le timer de 1.5s
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            silenceTimerRef.current = setTimeout(() => {
                if (transcript.trim() !== "" && isVoiceMode && !isAISpeaking) {
                    handleAutoSend(transcript);
                }
            }, 1500);
        }
    }, [transcript, isVoiceMode, isAISpeaking]);

    // Gérer l'état du micro selon isVoiceMode et isAISpeaking (Anti-feedback)
    useEffect(() => {
        if (isVoiceMode && !isAISpeaking) {
            console.log("Démarrage de l'écoute...");
            SpeechRecognition.startListening({
                continuous: true,
                language: 'fr-FR'
            });
        } else {
            console.log("Arrêt de l'écoute...");
            SpeechRecognition.stopListening();
        }

        return () => SpeechRecognition.stopListening();
    }, [isVoiceMode, isAISpeaking]);

    const handleAutoSend = (text) => {
        onSendMessage(text);
        setInput("");
        resetTranscript();
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalInput = isVoiceMode ? transcript : input;
        if (finalInput.trim()) {
            onSendMessage(finalInput);
            setInput("");
            resetTranscript();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    const toggleVoice = () => {
        if (isVoiceMode) {
            setIsVoiceMode(false);
            SpeechRecognition.stopListening();
        } else {
            setIsVoiceMode(true);
            resetTranscript();
            setInput("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <form
                onSubmit={handleSubmit}
                className={`p-3 bg-[var(--bg-sidebar)] border rounded-[28px] shadow-lg flex items-end gap-3 transition-all duration-500 
            ${listening ? "border-[var(--accent-blue)] ring-4 ring-[var(--accent-soft)]" : "border-[var(--border-color)]"}
            focus-within:ring-2 focus-within:ring-[var(--accent-blue)] focus-within:border-transparent group`}
            >
                <button
                    type="button"
                    onClick={toggleVoice}
                    className={`p-3.5 rounded-[20px] transition-all duration-300 ${isVoiceMode
                        ? "bg-[var(--accent-blue)] text-slate-900 shadow-lg shadow-[#00E5FF]/40"
                        : "bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800"
                        }`}
                    title={isVoiceMode ? "Désactiver le mode vocal" : "Activer le mode vocal"}
                >
                    {isVoiceMode ? <Mic size={20} className={listening ? "animate-pulse" : ""} /> : <MicOff size={20} />}
                </button>

                <div className="flex-1 min-w-0">
                    <textarea
                        ref={textareaRef}
                        value={isVoiceMode ? transcript || input : input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isVoiceMode ? "Je vous écoute..." : (mode === "chat" ? "Qu'est-ce qui vous préoccupe aujourd'hui ?" : "Décrivez une scène spectaculaire...")}
                        rows={1}
                        style={{ outline: 'none', boxShadow: 'none' }}
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-main)] placeholder-slate-400 dark:placeholder-slate-500 resize-none py-3 text-base font-medium scrollbar-hide"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!input.trim() && !transcript.trim()}
                    className={`p-3.5 rounded-[20px] transition-all duration-300 ${(input.trim() || transcript.trim())
                        ? "bg-[var(--accent-blue)] text-slate-900 shadow-lg shadow-[#00E5FF]/30 hover:scale-105 active:scale-95"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed items-center justify-center flex"
                        }`}
                >
                    <Send size={20} className={(input.trim() || transcript.trim()) ? "animate-in zoom-in duration-300" : ""} />
                </button>
            </form>

            {isVoiceMode && (
                <div className="flex justify-center animate-in fade-in duration-500">
                    <div className="flex gap-1 items-center bg-[var(--accent-soft)] px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/20">
                        <div className={`w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full ${listening ? "animate-bounce [animation-delay:-0.3s]" : ""}`}></div>
                        <div className={`w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full ${listening ? "animate-bounce [animation-delay:-0.15s]" : ""}`}></div>
                        <div className={`w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full ${listening ? "animate-bounce" : ""}`}></div>
                        <span className="text-[10px] font-bold text-[var(--accent-blue)] ml-2 uppercase tracking-widest">
                            {isAISpeaking ? "L'IA parle (Micro en pause)" : (listening ? "Je vous écoute..." : "Prêt")}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputArea;
