const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";
const SUPABASE_SERVICE_KEY = "";

async function uploadAvatar(userId, file) {
  const ext = file.name.split(".").pop();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/avatars/${userId}.${ext}`,
    {
      method: "PUT",
      headers: {
        "apikey": SUPABASE_SERVICE_KEY,        // ← service role
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`, // ← service role
        "Content-Type": file.type,
        "x-upsert": "true"
      },
      body: file
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status} subiendo avatar`);
  }

  // ✅ Devuelve la URL pública para guardarla
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${userId}.${ext}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const { avp_user_id, avp_bg_url } = await chrome.storage.local.get(["avp_user_id", "avp_bg_url"]);

  document.getElementById("app").innerHTML = `
    <h2>Aula Virtual Plus</h2>
    <p style="font-size:12px;color:#666">ID: ${avp_user_id || "Abre Aula Virtual primero"}</p>

    ${avp_bg_url ? `
      <p style="font-size:11px;color:#888">Fondo actual:</p>
      <img src="${avp_bg_url}" style="width:100%;height:60px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />
    ` : ""}

    <label>Imagen de fondo para secciones:</label>
    <input id="avatar-file" type="file" accept="image/*" />
    <button id="btn-upload">Subir y aplicar</button>
    <p id="msg"></p>

     <label>Fuente:</label>
  <select id="font-select">
    <option value="Arial">Arial</option>
    <option value="Roboto">Roboto</option>
    <option value="Georgia">Georgia</option>
  </select>
  `;

  

  document.getElementById("btn-upload").addEventListener("click", async () => {
    const file = document.getElementById("avatar-file").files[0];
    const msg = document.getElementById("msg");
    if (!file) { msg.textContent = "Selecciona una imagen"; return; }

    msg.textContent = "Subiendo...";
    try {
      const publicUrl = await uploadAvatar(avp_user_id, file);

      // ✅ Guarda la URL para que content.js la use
      await chrome.storage.local.set({ avp_bg_url: publicUrl });

    

      msg.textContent = "✅ Fondo aplicado";
    } catch (e) {
      msg.textContent = "❌ " + e.message;
    }
  });
});
