import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Groq } from 'groq-sdk';
import 'regenerator-runtime/runtime';

// Configuration Groq
const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEYS?.split(',')[0] || "";
const groq = new Groq({
    apiKey: GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const silenceTimerRef = useRef(null);

    // --- LOGIQUE D'INTERRUPTION (BARGE-IN) ---
    // Si l'utilisateur commence à parler pendant que l'IA parle, on coupe le son immédiatement.
    useEffect(() => {
        if (transcript.length > 0 && window.speechSynthesis.speaking) {
            console.log("Interruption détectée : arrêt du TTS");
            window.speechSynthesis.cancel();
        }
    }, [transcript]);

    // --- LOGIQUE DU TIMER (SILENCE DEBOUNCE) ---
    // On surveille le transcript. À chaque nouveau mot, on réinitialise le compte à rebours.
    // Si l'utilisateur s'arrête de parler pendant 1500ms, on envoie le message.
    useEffect(() => {
        if (transcript.trim() === "") return;

        // On annule le timer précédent dès que le transcript change (l'utilisateur parle encore)
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }

        // On lance un nouveau timer de 1.5s
        silenceTimerRef.current = setTimeout(() => {
            handleSend(transcript);
        }, 1500);

        return () => clearTimeout(silenceTimerRef.current);
    }, [transcript]);

    const handleSend = async (text) => {
        if (!text.trim()) return;

        // On arrête l'écoute pendant que l'IA réfléchit pour éviter les boucles
        SpeechRecognition.stopListening();
        setIsProcessing(true);

        const userMessage = { role: "user", content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "Tu es Cortex, un assistant vocal ultra-rapide et concis." },
                    ...updatedMessages
                ],
                model: "llama3-8b-8192",
            });

            const aiResponse = completion.choices[0]?.message?.content || "";
            setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);

            // On réinitialise le transcript pour la prochaine phrase
            resetTranscript();

            // On fait lire la réponse à l'IA
            speak(aiResponse);

        } catch (error) {
            console.error("Erreur Groq:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text) => {
        // On s'assure qu'aucune autre voix ne parle
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.1; // Légèrement plus rapide pour le réalisme

        utterance.onend = () => {
            // Une fois que l'IA a fini de parler, on relance l'écoute automatique
            SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
        };

        window.speechSynthesis.speak(utterance);
    };

    const toggleAssistant = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            window.speechSynthesis.cancel();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <div style={styles.container}>Désolé, votre navigateur ne supporte pas la reconnaissance vocale.</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Assistant Vocal Cortex</h1>
                <p style={styles.status}>
                    {listening ? "🟢 Je vous écoute..." : "🔴 Micro désactivé"}
                </p>

                <div style={styles.visualizer}>
                    <div style={{ ...styles.circle, transform: listening ? 'scale(1.2)' : 'scale(1)', background: listening ? '#00E5FF' : '#555' }}>
                        {isProcessing && <div style={styles.loader}></div>}
                    </div>
                </div>

                <div style={styles.transcriptBox}>
                    <p style={styles.transcriptLabel}>Vous dites :</p>
                    <p style={styles.transcriptText}>{transcript || "..."}</p>
                </div>

                <div style={styles.historyBox}>
                    {messages.slice(-1).map((msg, i) => (
                        <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                            <strong>{msg.role === 'user' ? 'Vous: ' : 'IA: '}</strong> {msg.content}
                        </div>
                    ))}
                </div>

                <button
                    onClick={toggleAssistant}
                    style={{
                        ...styles.button,
                        background: listening ? '#ff4b2b' : '#00E5FF',
                        color: listening ? 'white' : 'black'
                    }}
                >
                    {listening ? "Arrêter l'assistant" : "Lancer l'assistant"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0A192F',
        color: '#E0E0E0',
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        width: '400px',
        padding: '2rem',
        borderRadius: '24px',
        backgroundColor: '#112240',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        textAlign: 'center',
        border: '1px solid #233554',
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
        fontWeight: '900',
        color: '#FFF',
    },
    status: {
        fontSize: '0.9rem',
        color: '#8892B0',
        marginBottom: '2rem',
    },
    visualizer: {
        height: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    circle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    loader: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '4px solid transparent',
        borderTopColor: '#FFF',
        animation: 'spin 1s linear infinite',
    },
    transcriptBox: {
        textAlign: 'left',
        backgroundColor: '#0A192F',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        minHeight: '60px',
    },
    transcriptLabel: {
        fontSize: '0.7rem',
        color: '#00E5FF',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: '0.3rem',
    },
    transcriptText: {
        fontSize: '0.9rem',
        fontStyle: 'italic',
    },
    historyBox: {
        textAlign: 'left',
        marginBottom: '2rem',
        fontSize: '0.85rem',
    },
    aiMsg: {
        color: '#CCD6F6',
        lineHeight: '1.4',
    },
    userMsg: {
        color: '#8892B0',
        display: 'none', // On ne montre que la réponse de l'IA pour la clarté
    },
    button: {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s active',
    }
};

// Injection d'une animation simple pour le loader
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(styleSheet);
}

export default Assistant;
