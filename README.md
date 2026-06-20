# Live TV Streaming Platform 📺

A premium, open-source Live TV Streaming application built with **Next.js**, **React 19**, and **Tailwind CSS**. It features robust integration for live sports and entertainment channels with a modern responsive UI, dynamic stream decryption, and automatic domain resolution.

🔗 **Live Demo:** [https://tv.nextqora.com/](https://tv.nextqora.com/)

---

## ✨ Features

- ⚡ **Next-Gen Tech Stack**: Next.js App Router, React 19, and Tailwind CSS v4 for super-fast performance and clean styles.
- 📱 **Fully Responsive Glassmorphic UI**: Beautiful dark-mode interface with sleek glassmorphism effects, customizable background scenes, and smooth micro-animations.
- 🎥 **Advanced Media Player**:
  - Automatically toggles between **HLS.js** and **Shaka Player** depending on stream requirements.
  - Supports standard **HLS (.m3u8)** and **DASH (.mpd)** streams.
  - Handles **ClearKey DRM decryption** automatically for protected streams.
- 🔄 **Dynamic Subdomain Auto-Resolution**:
  - LiveKhelaTV streams frequently rotate their subdomains (e.g. `ugby`, `28js`).
  - The application automatically tracks and follows redirects from the root domain (`https://livekhelatv.com`) to dynamically resolve and cache the active subdomain.
- 🗂️ **Channel Categorization & Search**:
  - Built-in sidebar navigation for filtering channels by category (Sports, Entertainment, etc.).
  - Instant channel search and hover prefetching of streams for ultra-fast playback response times.
- 📢 **Community Notice Board**: Integrated banner/popup system for site announcements and streaming updates.

---

## 🛠️ Tech Stack

- **Core**: Next.js (App Router, Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Motion (Framer Motion), Lucide React (Icons)
- **Streaming & Decryption**: HLS.js, Shaka Player, Web Crypto API (AES-GCM decryption)
- **State Management & UI**: Radix UI primitives, Sonner (Toasts)

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have Node.js (v18.x or later) and npm installed.

### ⚙️ Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/live-tv.git
   cd live-tv
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env.local` file in the root directory (optional, fallbacks are included):
   ```env
   NEXT_PUBLIC_APP_URL=https://tv.nextqora.com
   NEXT_PUBLIC_API_BASE_URL=
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 Dynamic Domain Resolution

LiveKhelaTV uses rotating subdomains to deliver their sports channels. Hardcoding the domains (e.g. `ugby.livekhelatv.com`) will break the app when the subdomains rotate. 

To solve this, our backend dynamically traces the active domain:
```typescript
// See src/utils/ugby.ts for details
export async function resolveUgbyDomain(): Promise<string> {
  // 1. Sends a HEAD request to follow redirects from livekhelatv.com
  // 2. Extracts the final domain (e.g. 28js.livekhelatv.com)
  // 3. Caches the resolved domain for 10 minutes to minimize network overhead
}
```
This guarantees 100% uptime for LiveKhelaTV streams without requiring manual updates to the source code.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/live-tv/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.
