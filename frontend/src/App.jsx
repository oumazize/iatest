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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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
    <div className="flex h-screen bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        mode={mode}
        setMode={setMode}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 flex flex-col relative w-full lg:ml-72 transition-all duration-300">
        {/* Header Mobile */}
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)] lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <h2 className="text-lg font-bold">Cortex IA</h2>
          </div>
          <div className="w-10" />
        </header>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in duration-700">
                <div className="relative mb-8 group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-blue via-primary-yellow to-primary-pink rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                  <img src="/logo.jpg" alt="Logo" className="relative w-24 h-24 rounded-3xl object-cover shadow-2xl border-4 border-white dark:border-gray-800" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                  Bienvenue dans <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Cortex IA</span>
                </h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  {mode === "chat"
                    ? "L'intelligence artificielle ultra-rapide au service de votre créativité et de votre productivité."
                    : "Transformez vos idées en images spectaculaires grâce à la puissance des réseaux neuronaux."}
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
        <footer className="p-4 md:p-12 bg-gradient-to-t from-[var(--bg-app)] via-[var(--bg-app)] to-transparent">
          <InputArea onSendMessage={handleSendMessage} mode={mode} />
          <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-medium opacity-60">
            Propulsé par Groq & Pollinations.ai • Design par Expert Frontend
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
