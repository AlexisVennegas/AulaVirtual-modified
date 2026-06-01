const SUPABASE_PROJECT_URL = "";

function getMoodleUserId() {
  const el = document.querySelector("[data-userid]");
  return el ? el.dataset.userid : null;
}

function getAvatarPublicUrl(userId) {
  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/avatars/${userId}.jpg`;
}

function applyBgToSections(imageUrl) {

  
  const item = document.getElementsByClassName("section-item")[0];
  const elementItem2 = document.getElementById("inst69748")

  if (!item) return;
  


  item.style.backgroundImage = `url("${imageUrl}")`; // ← comillas añadidas
  item.style.backgroundSize = "cover";
  item.style.backgroundPosition = "center";
  item.style.position = "relative";
  item.style.minHeight = "100px"; // ← añade esto por si el div tiene altura 0
}

// ===== CHATBOT DE IA (ejemplo muy básico) =====
document.addEventListener("click", async (e) => {
  if (e.target.id !== "avp-chat-send") return;

  const input = document.getElementById("avp-chat-input");
  const msg = input.value.trim();
  if (!msg) return;

  input.value = "";

  const messages = document.getElementById("avp-chat-messages");

  messages.innerHTML += `<div>🧑 ${msg}</div>`;

  const reply = await askGemini(msg);

  messages.innerHTML += `<div>🤖 ${reply}</div>`;
});
async function askGemini(prompt) {
  const { avp_gemini_api_key: API_KEY } = await chrome.storage.local.get(["avp_gemini_api_key"]);
  if (!API_KEY) {
    return "Falta configurar la API key de Gemini en la extensión.";
  }

  const res = await fetch(
    "" + API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await res.json();
  console.log("Respuesta de Gemini:", data);
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No he podido responder"
  );
}
function createChatWidget() {
  if (document.getElementById("avp-chat")) return;

  const chat = document.createElement("div");
  chat.id = "avp-chat";

  chat.style.height = "420px"; // altura completa cuando se abra, y 20px cuando se minimice

  chat.innerHTML = `
    <div id="avp-chat-header">💬 Aula IA</div>
    <div id="avp-chat-messages"></div>
    <div style="display:flex">
      <input id="avp-chat-input" placeholder="Escribe..." />
      <button id="avp-chat-send">Enviar</button>
    </div>
  `;

  document.body.appendChild(chat);
}

const style = document.createElement("style");

style.textContent = `
#avp-chat {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  z-index: 999999;
  overflow: hidden;
  font-family: Arial;
}

#avp-chat-header {
  background: #111;
  color: white;
  padding: 8px;
  font-size: 13px;
}

#avp-chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  font-size: 12px;
}

#avp-chat input {
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
}

#avp-chat button {
  border: none;
  background: #111;
  color: white;
  padding: 10px;
  cursor: pointer;
}
`;

document.head.appendChild(style);

// ===== LOGICA PARA QUE EL CHAT AL DARLE CLICK AL HEADER SE MINIMICE=====




chrome.storage.onChanged.addListener((changes, area) => {
  console.log("[AVP] storage cambió:", area, changes); // ← añade esto
  if (area === "local" && changes.avp_bg_url?.newValue) {
    console.log("[AVP] Nueva URL detectada:", changes.avp_bg_url.newValue);
    applyBgToSections(changes.avp_bg_url.newValue);
  }
});

(async function init() {
  console.log("[AVP] content.js cargado");
  injectAvatars();

  const { avp_bg_url } = await chrome.storage.local.get(["avp_bg_url"]);
  console.log("[AVP] URL en storage al cargar:", avp_bg_url); // ← añade esto
  if (avp_bg_url) applyBgToSections(avp_bg_url);
  // ... resto igual
})();

async function injectAvatars() {
  const avatarContainer = document.querySelector(".avatar.current");
  if (!avatarContainer || avatarContainer.dataset.avpInjected) return;
  avatarContainer.dataset.avpInjected = "true";

  const userId = getMoodleUserId();
  if (!userId) return;

  chrome.storage.local.set({ avp_user_id: userId });

  const inicialesSpan = avatarContainer.querySelector(".userinitials");
  if (!inicialesSpan) return;

  const img = document.createElement("img");
  img.src = getAvatarPublicUrl(userId);
  img.alt = "Avatar";
  img.style.cssText = `
    width: 35px; height: 35px;
    border-radius: 50%; object-fit: cover; display: block;
  `;
  img.onerror = () => { img.replaceWith(inicialesSpan); };
  inicialesSpan.replaceWith(img);
}

// ✅ Pon esto en su lugar
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.avp_bg_url?.newValue) {
    console.log("[AVP] Nueva URL detectada:", changes.avp_bg_url.newValue);
    applyBgToSections(changes.avp_bg_url.newValue);
  }
});

// ===== FUENTE =====
function applyFont(font) {
  const link = document.getElementById("avp-font-link");
  const fontMap = {
    "inter": {
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
      family: "'Inter', sans-serif"
    },
    "poppins": {
      url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap",
      family: "'Poppins', sans-serif"
    },
    "minecraft": {
      url: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      family: "'Press Start 2P', monospace"
    }
  };

  const selected = fontMap[font] || fontMap["inter"];

  if (!link) {
    const el = document.createElement("link");
    el.id = "avp-font-link";
    el.rel = "stylesheet";
    el.href = selected.url;
    document.head.appendChild(el);
  } else {
    link.href = selected.url;
  }

  // Aplica a toda la página excepto iconos
  const style = document.getElementById("avp-font-style") || document.createElement("style");
  style.id = "avp-font-style";
  style.textContent = `
    body, p, h1, h2, h3, h4, h5, span, a, div, td, th, li, label, input, button {
      font-family: ${selected.family} !important;
    }
  `;
  if (!document.getElementById("avp-font-style")) document.head.appendChild(style);
}

// ===== BARRA DE PROGRESO =====
function injectProgressBar() {
  if (document.getElementById("avp-progress")) return;

  const now = new Date();
  const year = now.getFullYear();

  // Curso: 1 sep → 20 jun del año siguiente
  const start = new Date(now.getMonth() >= 8 ? year : year - 1, 8, 1);   // 1 sep
  const end   = new Date(now.getMonth() >= 8 ? year + 1 : year, 5, 20);  // 20 jun

  const total = end - start;
  const elapsed = now - start;
  const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const endStr = `${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  const daysLeft = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)));

  // Oculta el header original
  const pageHeader = document.getElementById("page-header");
  if (pageHeader) pageHeader.style.display = "none";

  const pageHeader2 = document.getElementById("emMoodleUserLogo");
  if (pageHeader2) pageHeader2.style.display = "none";

  const headerChat = document.getElementById("avp-chat-header");
  // logica para cuando le de click se oculte y visersa
  headerChat.addEventListener("click", () => {

    
    // minimina el chat clase : avp-chat
    const messages = document.getElementById("avp-chat");

    console.log(messages.style.height)  
    if (messages.style.height === "420px"){
      console.log("minimizando")
      messages.style.height = "34px";
    }
     else
      {
  
      messages.style.height = "420px";
      console.log("maximizando")
    }

  });

  const bar = document.createElement("div");
  bar.id = "avp-progress";
  bar.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border-radius: 16px;
      padding: 20px 28px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      font-family: inherit;
      margin: 40px;
    ">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="color:#e0e0e0; font-size:13px; font-weight:600; letter-spacing:0.5px;">
          📅 PROGRESO DEL CURSO
        </span>
        <span style="color:#a0c4ff; font-size:12px;">
          ${daysLeft} días hasta el ${endStr}
        </span>
      </div>

      <div style="
        background: rgba(255,255,255,0.1);
        border-radius: 999px;
        height: 14px;
        overflow: hidden;
        position: relative;
      ">
        <div style="
          width: ${pct}%;
          height: 100%;
          background: linear-gradient(90deg, #4a6cf7, #a855f7);
          border-radius: 999px;
          transition: width 1s ease;
          position: relative;
        ">
          <div style="
            position: absolute; right: 0; top: 50%; transform: translateY(-50%);
            width: 8px; height: 8px; border-radius: 50%;
            background: white; box-shadow: 0 0 6px rgba(255,255,255,0.8);
          "></div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; margin-top:8px;">
        <span style="color:#888; font-size:11px;">1 Sep ${start.getFullYear()}</span>
        <span style="color:#c084fc; font-size:13px; font-weight:700;">${pct}% completado</span>
        <span style="color:#888; font-size:11px;">20 Jun ${end.getFullYear()}</span>
      </div>
    </div>
  `;

  // Inserta antes del contenido principal
  const main = document.getElementById("page") || document.getElementById("page-content") || document.body;
  main.prepend(bar);
}

// ===== ESCUCHA CAMBIOS DE FUENTE DESDE POPUP =====
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.avp_bg_url?.newValue) applyBgToSections(changes.avp_bg_url.newValue);
    if (changes.avp_font?.newValue) applyFont(changes.avp_font.newValue);
  }
});

// ===== EN INIT() añade estas dos líneas =====
(async function init() {
  

  createChatWidget();
  injectAvatars();
  injectProgressBar(); // ← nueva

  const { avp_bg_url, avp_font } = await chrome.storage.local.get(["avp_bg_url", "avp_font"]);
  if (avp_bg_url) applyBgToSections(avp_bg_url);
  if (avp_font) applyFont(avp_font); // ← nueva
  else applyFont("inter");            // ← Inter por defecto

  const observer = new MutationObserver(() => {
    injectAvatars();
    chrome.storage.local.get(["avp_bg_url"]).then(({ avp_bg_url }) => {
      if (avp_bg_url) applyBgToSections(avp_bg_url);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
