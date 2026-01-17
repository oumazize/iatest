import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, MessageSquare } from "lucide-react";

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
            className="max-w-4xl mx-auto p-4 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-3xl shadow-2xl flex items-end gap-3 transition-all duration-300"
        >
            <div className="flex-1 min-w-0 px-2">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === "chat" ? "Posez n'importe quelle question..." : "Décrivez l'image à générer..."}
                    rows={1}
                    className="w-full bg-transparent border-none focus:ring-0 text-[var(--text-main)] placeholder-gray-500 resize-none py-4 text-base scrollbar-hide"
                />
            </div>
            <button
                type="submit"
                disabled={!input.trim()}
                className={`p-4 rounded-2xl transition-all duration-200 ${input.trim()
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
            >
                {mode === "chat" ? <Send size={22} /> : <ImageIcon size={22} />}
            </button>
        </form>
    );
};

export default InputArea;
