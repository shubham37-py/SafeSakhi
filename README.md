# 🛡️ SafeTransit — Predictive Women's Public Transit Safety Platform

> **Hackathon MVP** • AI-Powered Real-Time Risk Scoring, Route Deviation Detection, Silent Auto-SOS, & Guardian Command Console.

---

## 📖 Overview

**SafeTransit** is a predictive transit safety web platform engineered for female commuters. Instead of reactive panic buttons that require conscious manual intervention during danger, SafeTransit continuously tracks commuter progression along expected transit corridors, computes transparent Explainable AI (XAI) risk scores, detects off-schedule stops and route deviations, and triggers **Silent Auto-SOS** with cryptographic forensic evidence capture if an anomaly escalates.

---

## 📍 Preloaded Demo Scenario (Pune, India)

- **Commute**: *Swargate Bus Terminal & Metro Hub $\rightarrow$ VIT Pune Campus (Vishwakarma Institute of Technology, Bibwewadi)*
- **Corridor**: Satara Road (Laxmi Narayan Cinema $\rightarrow$ Panchami $\rightarrow$ City Pride $\rightarrow$ Padmavati BRT $\rightarrow$ Bibwewadi)
- **Transit Mode**: PMPML Bus 42 (5.2 km, 22 min ETA)
- **Deviation Route**: Veers East from City Pride into an unlit warehouse backroad near Market Yard Hinterland.

---

## ✨ Key Features

1. **Dual-View Presentation Synchronizer**:
   - **Side-by-Side Pitch Mode**: Left pane shows the passenger's mobile interface; right pane shows the real-time synced Guardian Command Console.
   - **Multi-Tab Sync**: Automatically syncs across separate browser tabs via native Web `BroadcastChannel`.

2. **Explainable AI (XAI) Risk Engine**:
   - Computes real-time risk scores (0–100) using a transparent weighted formula:
     $$\text{Risk} = (0.30 \times \text{Deviation}) + (0.20 \times \text{Stop}) + (0.15 \times \text{Time}) + (0.10 \times \text{Crowd}) + (0.10 \times \text{Battery}) + (0.15 \times \text{Responsiveness})$$
   - Streams plain-language natural language explanations in real time.

3. **Interactive Pitch Story Navigator**:
   - 4-step guided progression bar (`Normal Safe` $\rightarrow$ `Route Drift` $\rightarrow$ `Check-In` $\rightarrow$ `Silent Auto-SOS`).

4. **Forensic Incident Evidence Locker**:
   - Captures GPS coordinates, timestamps, nearest landmark, simulated 5-second ambient audio waveform recording, and SHA-256 cryptographic integrity hash.
   - One-click Emergency 112 dispatch simulator and remote traveler siren trigger.

5. **Stealth Camouflage Mode**:
   - Disguises screen as a functioning **Calculator** or **Notes app** with secret `112=` emergency trigger.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# Clone repository or navigate to directory
cd safetransit

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans
- **Maps**: Leaflet + CartoDB Positron OpenStreetMap Tiles
- **Audio Synthesis**: Web Audio API Sound Synthesizer
- **State & Sync**: React Context + Web BroadcastChannel API + LocalStorage
