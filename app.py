import streamlit as st
from groq import Groq
import random

# --- CONFIGURATION ---
st.set_page_config(page_title="Assane AI", page_icon="🤖", layout="wide")
st.markdown("""<style>.stTextInput > div > div > input {background-color: #2b313e; color: white;}</style>""", unsafe_allow_html=True)

st.title("⚡ Assane AI Ultimate")

# --- CLÉ API ---
try:
    client = Groq(api_key=st.secrets["GROQ_API_KEY"])
except:
    st.error("⚠️ Il manque la clé GROQ_API_KEY dans les Secrets.")
    st.stop()

# --- MENU ---
mode = st.sidebar.radio("Mode", ["💬 Chat", "🎨 Image"])

# --- MODE CHAT (Correction JSON) ---
if mode == "💬 Chat":
    if "messages" not in st.session_state:
        st.session_state.messages = [{"role": "system", "content": "Tu es une IA utile et cool."}]

    # Afficher historique
    for msg in st.session_state.messages:
        if msg["role"] != "system":
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])

    # Nouvelle question
    if prompt := st.chat_input("Message..."):
        st.chat_message("user").markdown(prompt)
        st.session_state.messages.append({"role": "user", "content": prompt})

        # --- LA CORRECTION EST ICI ---
        with st.chat_message("assistant"):
            placeholder = st.empty() # On crée une boite vide
            full_response = ""
            
            try:
                # On demande le stream
                stream = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=st.session_state.messages,
                    stream=True,
                )
                
                # BOUCLE MANUELLE : On décortique le JSON nous-mêmes
                for chunk in stream:
                    # On vérifie s'il y a du contenu textuel
                    if chunk.choices[0].delta.content:
                        text_chunk = chunk.choices[0].delta.content
                        full_response += text_chunk
                        # On met à jour la boite vide petit à petit
                        placeholder.markdown(full_response + "▌")
                
                # Une fois fini, on affiche le texte final sans le curseur
                placeholder.markdown(full_response)
                
                # On sauvegarde
                st.session_state.messages.append({"role": "assistant", "content": full_response})

            except Exception as e:
                st.error(f"Erreur : {e}")

# --- MODE IMAGE ---
elif mode == "🎨 Image":
    prompt_img = st.text_input("Description de l'image (Anglais) :")
    if st.button("Générer") and prompt_img:
        seed = random.randint(0, 100000)
        url = f"https://image.pollinations.ai/prompt/{prompt_img}?seed={seed}&nologo=true"
        st.image(url)
