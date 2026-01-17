import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import InputArea from "./components/InputArea";
import { chatWithGroq, generateImageURL } from "./services/api";
import { Menu, AlertCircle } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

const SYSTEM_PROMPT = {
  role: "system",
  content: "Tu es Cortex IA, un assistant virtuel expert en technologie et Education. Tu es ultra-rapide, précis et professionnel. Tu utilises un ton moderne et encourageant."
};

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("cortex_messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState("chat"); // 'chat' ou 'image'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cortex_messages", JSON.stringify(messages));
  }, [messages]);

  // --- LOGIQUE D'INTERRUPTION (BARGE-IN) ---
  useEffect(() => {
    if (isVoiceMode && transcript.length > 0 && isAISpeaking) {
      console.log("Interruption détectée via transcript");
      stopSpeaking();
    }
  }, [transcript, isVoiceMode, isAISpeaking]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem("cortex_messages");
    stopSpeaking();
    resetTranscript();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsAISpeaking(false);
    }
  };

  const speakText = (text) => {
    if (!isVoiceMode || !window.speechSynthesis) return;

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";

    // Voix naturelle
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith("fr") && (v.name.includes("Online") || v.name.includes("Natural")));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 1.1;

    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => {
      setIsAISpeaking(false);
      // On ne relance pas le micro ici, InputArea s'en occupe
    };
    utterance.onerror = () => setIsAISpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (content) => {
    setError(null);
    stopSpeaking();
    const userMessage = { role: "user", content, type: "text" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    if (mode === "chat") {
      try {
        const aiMessageId = Date.now();
        setMessages((prev) => [...prev, { role: "assistant", content: "", id: aiMessageId, type: "text" }]);

        let fullResponse = "";
        await chatWithGroq([SYSTEM_PROMPT, ...newMessages], (chunk) => {
          fullResponse = chunk;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: chunk } : msg))
          );
        });

        if (isVoiceMode) {
          speakText(fullResponse);
        }
      } catch (err) {
        setError("Désolé, une erreur est survenue lors de la connexion à Groq.");
        console.error(err);
      }
    } else {
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
        onNewChat={handleNewChat}
      />

      <main className="flex-1 flex flex-col relative w-full lg:ml-72 transition-all duration-300 font-sans h-full">
        {/* Header Mobile */}
        <header className="fixed top-0 left-0 right-0 lg:left-72 z-30 flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-app)]/80 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg lg:hidden">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 mx-auto lg:mx-0">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <h2 className="text-lg font-bold font-montserrat tracking-tight">Cortex IA</h2>
          </div>
          <div className="w-10 lg:hidden" />
        </header>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-24 pb-4 md:px-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-32">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight font-montserrat">
                  Bienvenue dans <span className="bg-gradient-to-r from-[#00E5FF] to-blue-500 bg-clip-text text-transparent">Cortex IA</span>
                </h3>
                <p className="text-[var(--text-secondary)] max-w-lg text-lg md:text-xl font-medium leading-relaxed">
                  {mode === "chat"
                    ? "L'intelligence artificielle ultra-rapide au service de votre créativité et de votre productivité."
                    : "Transformez vos idées en images spectaculaires grâce à la puissance des réseaux neuronaux."}
                </p>
              </div>
            )}
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-[var(--chat-ai-bg)] p-4 rounded-2xl animate-pulse">
                  Génération en cours...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Alerte d'erreur */}
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-red-900/60 border border-red-500/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-red-100 text-sm animate-bounce shadow-lg">
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-2 hover:text-white">✕</button>
          </div>
        )}

        {/* Barre de saisie */}
        <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[var(--bg-app)] via-[var(--bg-app)] to-transparent z-20">
          <InputArea
            onSendMessage={handleSendMessage}
            mode={mode}
            isVoiceMode={isVoiceMode}
            setIsVoiceMode={setIsVoiceMode}
            isAISpeaking={isAISpeaking}
            onUserSpeaking={() => stopSpeaking()}
          />
          <p className="text-center text-[10px] text-[var(--text-secondary)] mt-4 uppercase tracking-[0.25em] font-bold opacity-30">
            © 2026 Cortex IA. Tous droits réservés.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
