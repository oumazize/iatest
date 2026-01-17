import streamlit as st
from groq import Groq
import random

# --- CONFIGURATION DE LA PAGE ---
st.set_page_config(page_title="Assane AI", page_icon="🤖", layout="wide")

# --- CSS POUR LE STYLE MOBILE ---
st.markdown("""
<style>
    .stTextInput > div > div > input {background-color: #2b313e; color: white;}
</style>
""", unsafe_allow_html=True)

st.title("⚡ Assane AI Ultimate")
st.caption("Propulsé par Groq (Texte) & Pollinations (Image)")

# --- 1. GESTION DE LA CLÉ GROQ ---
# On récupère la clé depuis les secrets de Streamlit
try:
    groq_api_key = st.secrets["GROQ_API_KEY"]
except:
    st.error("⚠️ Clé API manquante. Configure-la dans les secrets Streamlit.")
    st.stop()

client = Groq(api_key=groq_api_key)

# --- 2. MENU LATÉRAL ---
mode = st.sidebar.radio("Mode", ["💬 Chat", "🎨 Générateur d'Images"])

# --- 3. MODE CHAT (Groq) ---
if mode == "💬 Chat":
    # Initialiser l'historique si vide
    if "messages" not in st.session_state:
        st.session_state.messages = [{"role": "system", "content": "Tu es une IA utile et cool."}]

    # Afficher les anciens messages
    for msg in st.session_state.messages:
        if msg["role"] != "system":
            with st.chat_message(msg["role"]):
                st.write(msg["content"])

    # Zone de texte utilisateur
    if prompt := st.chat_input("Parle avec moi..."):
        # Afficher le message utilisateur
        st.chat_message("user").write(prompt)
        st.session_state.messages.append({"role": "user", "content": prompt})

        # Réponse IA
        with st.chat_message("assistant"):
            stream = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=st.session_state.messages,
                stream=True,
            )
            response = st.write_stream(stream)
        
        # Sauvegarder la réponse
        st.session_state.messages.append({"role": "assistant", "content": response})

# --- 4. MODE IMAGE (Pollinations - Gratuit sans clé) ---
elif mode == "🎨 Générateur d'Images":
    st.subheader("Studio de Création")
    
    prompt_img = st.text_input("Décris ton image (en Anglais c'est mieux) :", placeholder="A cyberpunk city in Senegal...")
    
    if st.button("Générer l'Image"):
        if prompt_img:
            # Astuce : On ajoute un nombre aléatoire pour que l'image change à chaque fois
            seed = random.randint(0, 100000)
            # Construction de l'URL Pollinations (API magique gratuite)
            image_url = f"https://image.pollinations.ai/prompt/{prompt_img}?seed={seed}&width=1024&height=1024&nologo=true"
            
            st.image(image_url, caption=f"Résultat pour : {prompt_img}")
        else:
            st.warning("Écris une description d'abord !")