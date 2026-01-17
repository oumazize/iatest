import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ message }) => {
    const isAI = message.role === "assistant";

    return (
        <div className={`flex w-full mb-10 ${isAI ? "justify-start" : "justify-end"}`}>
            <div className={`flex max-w-[90%] md:max-w-[80%] ${isAI ? "flex-row" : "flex-row-reverse"} gap-4`}>
                <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isAI ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 shadow-blue-500/20"
                        }`}
                >
                    {isAI ? <Bot size={20} className={isAI ? "text-blue-500" : "text-white"} /> : <User size={20} className="text-white" />}
                </div>

                <div
                    className={`p-6 rounded-3xl shadow-sm ${isAI ? "bg-[var(--chat-ai-bg)]" : "bg-blue-500 text-white"
                        }`}
                >
                    {message.type === "image" ? (
                        <img
                            src={message.content}
                            alt="Generated AI"
                            className="rounded-2xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity border-4 border-white/10"
                            onClick={() => window.open(message.content, "_blank")}
                        />
                    ) : (
                        <div className="prose prose-invert max-w-none break-words">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code(props) {
                                        const { children, className, node, ...rest } = props;
                                        const match = /language-(\w+)/.exec(className || "");
                                        return match ? (
                                            <SyntaxHighlighter
                                                {...rest}
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                className="rounded-md my-2"
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className="bg-black/30 rounded px-1" {...rest}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
