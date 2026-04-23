# 🐉 Varo Companion Tool

[![License: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Habilitado-blue?logo=docker)](https://www.docker.com/)

**Varo Companion Tool** es un panel de control digital de doble pantalla, diseñado para que los Dungeon Masters tengan el control total sobre la inmersión en sus partidas de rol **sin necesidad de cables adicionales**.

La gran ventaja de esta herramienta es que funciona a través de tu red local (Wi-Fi). No necesitas conectar cables HDMI largos entre tu ordenador y la TV de los jugadores; basta con que ambos dispositivos estén en la misma red. Tú controlas todo desde tu portátil (Consola del DM) mientras los jugadores ven el contenido en su propia pantalla (Vista del Jugador) simplemente entrando en la URL configurada.

---

## ✨ Características Principales

- **📶 Inalámbrico y Sin Cables**: Olvídate de los cables HDMI largos. Conecta tu TV o tablet a la misma red Wi-Fi y accede a la app mediante la IP del servidor.
- **🎮 Control Remoto de Doble Pantalla**: Separa tu flujo de trabajo. Abre la Consola del DM en tu portátil y proyecta la Vista del Jugador en una pantalla grande o TV. Lo que tú seleccionas es lo que ellos ven.
- **🏰 Maestro de Campañas**: Organiza tu historia en Actos y Escenas. Gestiona toda tu biblioteca de imágenes, sonidos y textos desde un solo lugar.
- **👁️ Vista del Jugador Inmersiva**: Un modo de pantalla completa especializado para los jugadores. Proyecta instantáneamente visuales de alta calidad o narraciones dramáticas con efectos de aparición.
- **🔊 Control de Audio Avanzado**: Reproductor de YouTube integrado con gestión de volumen. Mezcla paisajes sonoros y música ambiental para crear la atmósfera perfecta.
- **🤖 Inspiración por IA**: Utiliza **Google Gemini** para generar descripciones complejas, diálogos de NPCs o notas secretas que puedes proyectar a los jugadores en el momento.
- **🃏 Mazo Estilo Tarot**: Gestiona los recursos de tu sesión como un mazo visual de cartas para un acceso rápido e intuitivo durante la partida.

---

## 📖 Guía Rápida de Uso

1.  **Configuración Inicial**:
    *   Abre la **Consola del DM** (`http://localhost:3000`).
    *   Ve a **Ajustes** (icono de engranaje) y añade tu **Gemini API Key**. Esto habilitará las funciones de IA.
2.  **Preparar la Campaña**:
    *   Crea una nueva campaña o selecciona una existente.
    *   Añade **Actos** y **Escenas** para organizar tu historia.
    *   Dentro de cada escena, añade **Assets**: imágenes (subiéndolas desde tu PC), textos de narración o enlaces de YouTube.
3.  **Proyectar a los Jugadores**:
    *   En la TV o pantalla secundaria, abre la URL de la **Vista del Jugador** (puedes acceder pulsando el botón "Player View" en la consola o entrando directamente en la misma IP).
    *   En tu Consola del DM, simplemente **haz clic en una carta (Asset)**. Verás que aparece un marco dorado indicando que está "Activo".
    *   ¡Instantáneamente, esa imagen o texto aparecerá en la pantalla de los jugadores!
4.  **Controlar la Atmósfera**:
    *   Usa el controlador de música en la parte inferior para gestionar el volumen y las listas de reproducción de YouTube sin interrumpir la visualización.

---

## 🚀 Instalación y Configuración

### 🐧 Linux (Recomendado - Docker)

La forma más sencilla de ejecutar la herramienta es usando Docker y Docker Compose.

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/VaroTv7/varocompaniontool.git
   cd varocompaniontool
   ```

2. **Configura el Entorno:**
   ```bash
   cp .env.example .env
   # Edita .env y añade tu GEMINI_API_KEY
   ```

3. **Inicia la aplicación:**
   ```bash
   docker-compose up -d --build
   ```
   La aplicación estará disponible en `http://localhost:8500`.

---

### 🪟 Windows

Tienes dos opciones para Windows:

#### Opción A: Docker Desktop (Recomendado)
1. Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Abre PowerShell o el Símbolo del sistema.
3. Sigue los mismos pasos que en la instalación de Linux anterior.

#### Opción B: Desarrollo Local
1. Instala [Node.js 20+](https://nodejs.org/).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## ⚙️ Configuración

### 1. Clave de API de Gemini
Para usar las funciones de IA, necesitas una clave de API de Google Gemini.
- Consigue una en [Google AI Studio](https://aistudio.google.com/).
- Añádela a tu archivo `.env` o directamente en los ajustes de la aplicación.

### 2. Recursos y Almacenamiento
La aplicación guarda las campañas y las subidas en el directorio `assets/`.
- `assets/config.json`: Guarda tu configuración de API.
- `assets/uploads/`: Guarda las imágenes subidas a través del panel.
- `assets/campaigns/`: Guarda los datos de tus campañas en formato JSON.

> [!NOTE]
> Si ejecutas en Docker, asegúrate de que la carpeta `assets` tenga los permisos de escritura correctos o esté mapeada como un volumen (ya gestionado en `docker-compose.yml`).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, Next.js 15 (App Router)
- **Estilos**: Tailwind CSS, Lucide Icons, Shadcn UI
- **IA**: Google Generative AI (Gemini)
- **Backend**: Next.js API Routes
- **Despliegue**: Docker, Alpine Linux

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de abrir issues o pull requests para mejorar la herramienta.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

---

*Desarrollado con ❤️ por [ElVarto](https://github.com/VaroTv7)*
