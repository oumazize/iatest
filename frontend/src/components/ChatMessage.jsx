import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ message }) => {
    const isAI = message.role === "assistant";

    return (
        <div className={`flex w-full mb-6 ${isAI ? "justify-start" : "justify-end"}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${isAI ? "flex-row" : "flex-row-reverse"}`}>
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${isAI ? "bg-gray-700 mr-3" : "bg-blue-600 ml-3"
                        }`}
                >
                    {isAI ? <Bot size={18} className="text-white" /> : <User size={18} className="text-white" />}
                </div>

                <div
                    className={`p-4 rounded-2xl shadow-sm ${isAI ? "bg-gray-800 text-gray-100" : "bg-blue-700 text-white"
                        }`}
                >
                    {message.type === "image" ? (
                        <img
                            src={message.content}
                            alt="Generated AI"
                            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.content, "_blank")}
                        />
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className="prose prose-invert max-w-none break-words"
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-md my-2"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="bg-black/30 rounded px-1" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
