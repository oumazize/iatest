# 🧠 Cortex IA - Super App AI

Cortex IA est une application de chat moderne et performante inspirée de l'interface de ChatGPT, conçue pour offrir une expérience utilisateur fluide et premium.

## 🚀 Fonctionnalités

-   **💬 Chat Intelligent** : Support du streaming (effet machine à écrire) via l'API Groq.
-   **🎨 Génération d'Images** : Créez des visuels spectaculaires via Pollinations.ai.
-   **⚖️ Load Balancing** : Rotation automatique entre plusieurs clés API Groq pour une disponibilité maximale.
-   **📝 Support Markdown** : Rendu riche des réponses avec coloration syntaxique pour le code.
-   **📱 Mobile First** : Design entièrement responsive et optimisé pour tous les écrans.
-   **🌑 Interface Sombre** : Esthétique premium avec effets de flou (Glassmorphism).

## 🛠️ Stack Technique

-   **Framework** : [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **CSS** : [Tailwind CSS 4](https://tailwindcss.com/)
-   **Icones** : [Lucide React](https://lucide.dev/)
-   **IA Texte** : [Groq SDK](https://groq.com/)
-   **IA Image** : [Pollinations.ai](https://pollinations.ai/)

## 📦 Installation et Lancement

1.  **Prérequis** : Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé.
2.  **Cloner ou accéder au dossier** :
    ```bash
    cd frontend
    ```
3.  **Installer les dépendances** :
    ```bash
    npm install
    ```
4.  **Configuration** :
    Ouvrez `src/services/api.js` et ajoutez vos clés API Groq dans le tableau `GROQ_API_KEYS`.
5.  **Lancer en mode développement** :
    ```bash
    npm run dev
    ```

## 🏗️ Structure du Projet

-   `src/components/` : Composants UI (Sidebar, ChatMessage, InputArea).
-   `src/services/` : Logique de communication avec les APIs externes.
-   `src/App.jsx` : Gestion de l'état global et de la navigation entre les modes.
