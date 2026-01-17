import Groq from "groq-sdk";

const GROQ_API_KEYS = [
    "MA_CLE_1",
    "MA_CLE_2",
    "MA_CLE_3"
];

let currentKeyIndex = 0;

/**
 * Appelle l'API Groq pour générer une réponse textuelle en streaming avec Load Balancing.
 */
export const chatWithGroq = async (messages, onStream) => {
    // Sélection de la clé (Round Robin)
    const apiKey = GROQ_API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % GROQ_API_KEYS.length;

    const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });

    try {
        const stream = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            stream: true,
        });

        let fullContent = "";
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullContent += content;
            onStream(fullContent);
        }
    } catch (error) {
        console.error(`Erreur Groq (Clé index ${currentKeyIndex}):`, error);
        throw error;
    }
};

/**
 * Génère une URL d'image via Pollinations.ai.
 * @param {string} prompt - Description de l'image.
 * @returns {string} L'URL de l'image générée.
 */
export const generateImageURL = (prompt) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;
};
