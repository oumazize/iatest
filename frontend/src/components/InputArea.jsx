import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Sparkles } from "lucide-react";

const InputArea = ({ onSendMessage, mode }) => {
    const [input, setInput] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto p-3 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-[28px] shadow-lg flex items-end gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--accent-blue)] focus-within:border-transparent group"
        >
            <div className="flex-1 min-w-0 pl-4">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === "chat" ? "Qu'est-ce qui vous préoccupe aujourd'hui ?" : "Décrivez une scène spectaculaire..."}
                    rows={1}
                    className="w-full bg-transparent border-none focus:ring-0 text-[var(--text-main)] placeholder-slate-400 dark:placeholder-slate-500 resize-none py-3 text-base font-medium scrollbar-hide"
                />
            </div>
            <button
                type="submit"
                disabled={!input.trim()}
                className={`p-3.5 rounded-[20px] transition-all duration-300 ${input.trim()
                        ? "bg-[var(--accent-blue)] text-slate-900 shadow-lg shadow-[#00E5FF]/30 hover:scale-105 active:scale-95"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed items-center justify-center flex"
                    }`}
            >
                <Send size={20} className={input.trim() ? "animate-in zoom-in duration-300" : ""} />
            </button>
        </form>
    );
};

export default InputArea;
