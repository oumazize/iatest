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
            className="max-w-4xl mx-auto p-4 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl flex items-end gap-2"
        >
            <div className="flex-1 min-w-0">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === "chat" ? "Posez n'importe quelle question..." : "Décrivez l'image à générer..."}
                    rows={1}
                    className="w-full bg-transparent border-none focus:ring-0 text-gray-100 placeholder-gray-500 resize-none py-3 text-lg scrollbar-hide"
                />
            </div>
            <button
                type="submit"
                disabled={!input.trim()}
                className={`p-3 rounded-xl transition-all ${input.trim()
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
            >
                {mode === "chat" ? <Send size={20} /> : <ImageIcon size={20} />}
            </button>
        </form>
    );
};

export default InputArea;
