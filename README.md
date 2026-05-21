# 🎹 ChordieX — Professional MIDI Hardware Workstation

ChordieX is an elegant, open-source, cross-platform desktop application designed for real-time hardware MIDI chord analysis and sheet music visualization. Built explicitly for musicians, teachers, and producers, it bridges the gap between hardware execution and instant music theory recognition.

![License](https://shields.io)
![Release](https://shields.io)
![Platform](https://shields.io)

---

## ✨ Key Features

- **88-Key Physical Piano Timeline**: A full-scale visual representation running edge-to-edge across the screen workspace floor, featuring absolute layout dimensions for precise key mapping.
- **Advanced Music Theory Engine**: Modulo 12 (Pitch Class Math) analyzer capable of processing over 40 distinct chord types, extensions up to the 13th, altered dominants, and rootless jazz shell configurations.
- **Intelligent Fuzzy Matching**: Rootless configurations or uncatalogued tri-tone passing variants automatically resolve to their closest logical alternate inversion or structural approximation instead of rendering an "Unrecognized" screen.
- **Dynamic Grand Staff Notation**: Real-time sheet music vectors utilizing standalone VexFlow v5 SVG loops, featuring auto-splitting treble and bass voice systems based on middle C (`MIDI 60`) registers.
- **Hardware Sustain Pedal Mapping**: Full integration for tracking **MIDI CC#64** message streams, driving an immediate red-to-green active pedal indicator lamp.
- **Interactive Options Menu Strip**: Built-in dropdown selectors mapping instant transformations for enharmonics (Sharps `#` vs Flats `b`), key signatures, chord display visibility, and application interface dark/light mode switching.
- **Native OS Core Pipeline**: Encapsulated within a lightweight, serverless Electron wrapper shell requiring zero secondary runtime runtime compiler dependencies (like Rust or C++ packages).

---

## 🛠️ Architecture Stack

- **Frontend Core**: [React 19](https://react.dev) & [Vite 8](https://vite.dev)
- **Styling Utility Engine**: [Tailwind CSS v4](https://tailwindcss.com)
- **State Management**: [Zustand 5](https://github.com)
- **Vector Music Sheet Graphics**: [VexFlow v5](https://vexflow.com)
- **Desktop Runtime Environment**: [Electron 42](https://electronjs.org)

---

## 🚀 Getting Started (Local Development)

Ensure you have [Node.js](https://nodejs.org) (v20 or higher) installed on your machine.

### 1. Clone and Install Dependencies
```bash
git clone https://github.com
cd chordie-x
npm install
```

### 2. Boot the Application Workspace
To run the project locally, run your development environment streams simultaneously:

- **Terminal Window 1** (Starts your live web dev server bundle):
  ```bash
  npm run dev
  ```
- **Terminal Window 2** (Launches the native Electron desktop runtime shell):
  ```bash
  npm run desktop
  ```

---

## 📦 Automated Cloud Compilation & Distribution

ChordieX features built-in **GitHub Actions CI/CD workflows** (`.github/workflows/build.yml`) backed by **Electron Builder**. When publishing updates, simply mint and push a version identifier tag to your branch to trigger automated cross-platform cloud compilation lines:

```bash
git tag -a v1.0.0 -m "Release Version 1.0.0 Launch"
git push origin v1.0.0
```

GitHub's virtual server grids will spin up, process your web assets, package isolated production-ready installers, and append them as downloadable `.exe` (Windows) and `.dmg` (Mac OS) bundles inside your repository's **Releases** pipeline automatically.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
