# 🌊 MARIS — Marine AI Reconnaissance & Intelligence System

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://maris-virid.vercel.app/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Host-22c55e?style=for-the-badge&logo=github&logoColor=white)](https://ankithroy.github.io/maris/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**MARIS** is an advanced autonomous marine AI intelligence platform for real-time acoustic sonar analysis, 3D underwater bathymetry mapping, hydrographic survey telemetry, and coastal/riverine anomaly detection.

---

## 🌐 Live Deployments

| Platform | Live Host URL | Status |
| :--- | :--- | :--- |
| 🚀 **Vercel Production** | [https://maris-virid.vercel.app/](https://maris-virid.vercel.app/) | ![Active](https://img.shields.io/badge/Status-Active-success) |
| 🐙 **GitHub Pages** | [https://ankithroy.github.io/maris/](https://ankithroy.github.io/maris/) | ![Active](https://img.shields.io/badge/Status-Active-success) |

---

## ✨ Key Capabilities & Subsystems

- 🛰️ **3D Bathymetry & Seabed Visualization**: Interactive depth contours, sub-bottom profiling, and topography mapping.
- 📡 **Sonar DSP Analysis**: FFT frequency spectrum, acoustic signal-to-noise margin, and waterfall spectrogram processing.
- 🗺️ **Brahmaputra & Maritime Map Overlays**: GIS Leaflet mapping integration for riverine and coastal navigation channels.
- ⚠️ **AI Anomaly Detection**: Automated target categorization (wrecks, submerged debris, acoustic anomalies).
- 📊 **Real-time Telemetry & Diagnostics**: AUV hardware metrics, memory latency tracking, and live telemetry feeds.
- 🔐 **Cinematic Command Authentication**: Secure tactical operator portal.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 + TypeScript + Vite 8
* **Styling & UI Effects**: Tailwind CSS, Glassmorphism design system, Lucide Icons
* **Animations**: Framer Motion
* **Mapping & Visualizations**: Leaflet, React-Leaflet, Recharts
* **State Management**: Zustand
* **Routing**: React Router v7 (`/` routing on Vercel, `/maris/` base path on GitHub Pages)

---

## 🚀 Local Development Setup

Clone the repository and launch the Vite development server locally:

```bash
# Clone the repository
git clone https://github.com/ankithroy/maris.git

# Navigate into project directory
cd maris

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
