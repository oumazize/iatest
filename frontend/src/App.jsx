import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import InputArea from "./components/InputArea";
import { chatWithGroq, generateImageURL } from "./services/api";
import { Menu, AlertCircle } from "lucide-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState("chat"); // 'chat' ou 'image'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    setError(null);
    const userMessage = { role: "user", content, type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (mode === "chat") {
      try {
        // Message temporaire pour le streaming
        const aiMessageId = Date.now();
        setMessages((prev) => [...prev, { role: "assistant", content: "", id: aiMessageId, type: "text" }]);

        await chatWithGroq([...messages, userMessage], (fullContent) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: fullContent } : msg))
          );
        });
      } catch (err) {
        setError("Désolé, une erreur est survenue lors de la connexion à Groq.");
        console.error(err);
      }
    } else {
      // Mode Image
      try {
        const imageURL = generateImageURL(content);
        setMessages((prev) => [...prev, { role: "assistant", content: imageURL, type: "image" }]);
      } catch (err) {
        setError("Erreur lors de la génération de l'image.");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-gray-100 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        mode={mode}
        setMode={setMode}
      />

      <main className="flex-1 flex flex-col relative w-full lg:ml-72 transition-all duration-300">
        {/* Header Mobile */}
        <header className="flex items-center justify-between p-4 border-b border-gray-800 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg">
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-bold">Cortex IA</h2>
          <div className="w-8" /> {/* Placeholder pour l'équilibre */}
        </header>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-gray-800/50 p-6 rounded-3xl mb-4">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Bienvenue dans Cortex IA</h3>
                <p className="text-gray-400 max-w-sm">
                  {mode === "chat"
                    ? "Discutez avec l'IA la plus rapide au monde grâce à Groq."
                    : "Générez des images spectaculaires avec Pollinations.ai."}
                </p>
              </div>
            )}
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Alerte d'erreur */}
        {error && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-900/40 border border-red-500/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-red-200 text-sm animate-bounce shadow-lg">
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-2 hover:text-white">✕</button>
          </div>
        )}

        {/* Barre de saisie */}
        <footer className="p-4 md:p-8 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent">
          <InputArea onSendMessage={handleSendMessage} mode={mode} />
          <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-tighter">
            Propulsé par Groq & Pollinations.ai • Design par Expert Frontend
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
