# 🚀 Aula Virtual Plus

Extensión de Chrome que mejora la experiencia de Aula Virtual (Moodle) de la Comunidad de Madrid.

Permite personalizar la interfaz, añadir herramientas de productividad y usar un chat con inteligencia artificial integrado dentro de la plataforma.

Cualquier Alumno la puede descargar y poder cambiar su interfaz y poder ver la interfaz personalizada de otro alumno

---

## ✨ Características actuales

### 🎨 Personalización visual
- Cambio de fondos en secciones
- Modificación de estilos del aula
- Avatares personalizados

### 🤖 Chat con IA
- Chat flotante dentro de Aula Virtual
- Integración con Gemini AI
- Respuestas en tiempo real

### 👤 Sistema de usuario
- Identificación de usuario Moodle
- Personalización por usuario

---

## 🧠 Tecnologías usadas

- JavaScript (Content Scripts)
- Chrome Extensions API (Manifest V3)
- Supabase (Storage y base de datos)
- Gemini API (IA)

---

## 📦 Instalación

1. Clona el repositorio:
2. añadir una apikey que encontraras en https://aistudio.google.com/welcome
3. 🔑 Configurar API de Google Gemini

    Para que el chat con IA funcione necesitas una API key de Google:

    Ve a: https://aistudio.google.com/welcome
    Crea tu API Key
    Abre el proyecto
    Localiza el archivo donde se define la IA (content.js o config)
    Añade tu clave:
    const GEMINI_API_KEY = "TU_API_KEY_AQUI";
4. 🗄️ Configurar Supabase (Base de datos)

    Este proyecto utiliza Supabase como base de datos compartida.

    Debes añadir las credenciales en el proyecto:

    const SUPABASE_URL = "TU_SUPABASE_URL";
    const SUPABASE_ANON_KEY = "TU_ANON_KEY";

    📌 Nota:
    Para obtener acceso a la base de datos:

    Contacta conmigo directamente
    Te proporcionaré las claves necesarias
5. 🧩 Instalar la extensión en Google Chrome

    Actualmente la extensión se usa en modo desarrollador.

    Pasos:

    Abre Chrome
    Ve a:
    chrome://extensions
    Activa Modo desarrollador
    Pulsa en:
    Cargar sin empaquetar
    Selecciona la carpeta del proyecto
    6. 🚀 Ejecutar
    Entra en Aula Virtual (Moodle)
    La extensión se cargará automáticamente
    Verás los cambios en la interfaz y el chat IA
---

## 🧭 Cómo usar la extensión

Una vez instalada la extensión y dentro de Aula Virtual:

### 🎛️ Panel superior
En la parte superior de la página aparecerá un panel desplegable de la extensión.

- Haz clic en el panel para abrirlo
- Desde ahí puedes cambiar la imagen de fondo de la página
- Selecciona una imagen y se aplicará automáticamente en la interfaz
- Los cambios se guardan por usuario

### 💬 Chat IA
- Abre el chat flotante en la esquina inferior
- Escribe tu mensaje
- La IA responderá en tiempo real dentro de la plataforma
## Imagenes del proyecto: 

![Personalización](./AulaVirtualPlus/images/pruebas.gif)
```bash
git clone https://github.com/AlexisVennegas/AulaVirtual-modified