import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Mic, MicOff, Volume2 } from "lucide-react";

const InputArea = ({ onSendMessage, mode, isVoiceMode, setIsVoiceMode, onUserSpeaking }) => {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    // Initialisation de la reconnaissance vocale
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "fr-FR";

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);

            recognitionRef.current.onresult = (event) => {
                onUserSpeaking(); // Interrompre l'IA dès qu'on détecte un son

                let interimTranscript = "";
                let finalTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                const currentText = finalTranscript || interimTranscript;
                if (currentText) {
                    setInput(currentText);

                    // Logique d'auto-envoi après silence
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = setTimeout(() => {
                        if (currentText.trim() && isVoiceMode) {
                            onSendMessage(currentText);
                            setInput("");
                            // On ne stop pas forcément le micro ici pour garder la fluidité
                        }
                    }, 1500); // 1.5 seconde de silence avant envoi auto
                }
            };
        }
    }, [isVoiceMode, onSendMessage, onUserSpeaking]);

    useEffect(() => {
        if (isVoiceMode && recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Erreur démarrage reconnaissance:", e);
            }
        } else if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            clearTimeout(silenceTimerRef.current);
        };
    }, [isVoiceMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput("");
            clearTimeout(silenceTimerRef.current);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <form
                onSubmit={handleSubmit}
                className={`p-3 bg-[var(--bg-sidebar)] border rounded-[28px] shadow-lg flex items-end gap-3 transition-all duration-500 
            ${isListening ? "border-[var(--accent-blue)] ring-4 ring-[var(--accent-soft)]" : "border-[var(--border-color)]"}
            focus-within:ring-2 focus-within:ring-[var(--accent-blue)] focus-within:border-transparent group`}
            >
                <button
                    type="button"
                    onClick={() => setIsVoiceMode(!isVoiceMode)}
                    className={`p-3.5 rounded-[20px] transition-all duration-300 ${isVoiceMode
                            ? "bg-[var(--accent-blue)] text-slate-900 shadow-lg shadow-[#00E5FF]/40"
                            : "bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800"
                        }`}
                    title={isVoiceMode ? "Désactiver le mode vocal" : "Activer le mode vocal"}
                >
                    {isVoiceMode ? <Mic size={20} className="animate-pulse" /> : <MicOff size={20} />}
                </button>

                <div className="flex-1 min-w-0">
                    <textarea
                        ref={textareaRef}
                        value={input}
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
                    disabled={!input.trim()}
                    className={`p-3.5 rounded-[20px] transition-all duration-300 ${input.trim()
                            ? "bg-[var(--accent-blue)] text-slate-900 shadow-lg shadow-[#00E5FF]/30 hover:scale-105 active:scale-95"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed items-center justify-center flex"
                        }`}
                >
                    <Send size={20} className={input.trim() ? "animate-in zoom-in duration-300" : ""} />
                </button>
            </form>

            {isVoiceMode && (
                <div className="flex justify-center animate-in fade-in duration-500">
                    <div className="flex gap-1 items-center bg-[var(--accent-soft)] px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/20">
                        <div className="w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full animate-bounce"></div>
                        <span className="text-[10px] font-bold text-[var(--accent-blue)] ml-2 uppercase tracking-widest">Mode Vocal Actif</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputArea;
