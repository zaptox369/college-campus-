# 🏢 Digital Twin Campus & Virtual Operations Engine

> A real-time IoT spatial telemetry, navigation, and AI crowd density forecasting platform built with Next.js 14, Tailwind CSS, FastAPI, and WebSocket synchronization.

---

## 🌟 Key Features

- **🗺️ Interactive Virtual Campus Blueprint (`CampusMapSVG`)**:
  - Spatial SVG node blueprint of campus buildings.
  - Interactive layer switcher: **Live Heatmap**, **Quiet Study Zones**, **Maintenance Alerts**, and **Pedestrian Routes**.
  - Built-in SVG viewport zoom and pan controls (`+` / `-` / `Reset`).
  - Concentric IoT radar ripple rings displaying live sensor heartbeat.

- **⌨️ Global Command Palette (`Ctrl + K`)**:
  - Instant keyboard-navigable search modal (`Ctrl + K` / `Cmd + K`).
  - Jump directly to any room, building block, campus event, or navigation route.

- **🚪 Interactive Room Explorer & Desk Reservation (`RoomCard` & `RoomDetailModal`)**:
  - Filter rooms by Building, Floor (1 to 4), Room Type, and Availability.
  - Instant **Desk / Pod Reservation Simulator** with live countdown timer and feedback toast.
  - Interactive **Live Occupancy Simulator Slider** updating database metrics in real time.
  - Room amenity badges (Wi-Fi 6, 4K Smart Display, Power Outlets, Climate Control).

- **🧭 Smart Pedestrian Navigation & Walking Simulator (`/navigation`)**:
  - Shortest path pedestrian calculation between campus blocks.
  - **Live Walking Navigation Simulator**: Interactive animated step-by-step progress timer.
  - Route options: **Fastest Path**, **Wheelchair & Ramp Accessible**, and **Quiet Scenic Route**.
  - Synchronized route path highlighted directly on the campus SVG blueprint map.

- **🤖 AI Machine Learning Crowd Forecast Engine (`/predictions`)**:
  - **Interactive Time Horizon Forecast Slider**: Drag from `+15 mins` up to `+4 Hours (+240 mins)` to project crowd density.
  - Random Forest ML model predicting room demand, bottleneck surges, and ideal quiet study times.

- **📡 Live IoT Stream Telemetry Feed (`IoTActivityDrawer`)**:
  - Collapsible bottom-right drawer broadcasting real-time WebSocket telemetry updates (occupancy changes, maintenance tickets).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript & React 18
- **Styling**: Tailwind CSS, Glassmorphism design system, Lucide React Icons
- **Charts**: Recharts
- **Real-Time Data**: WebSockets (`ws://`)

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite / SQLAlchemy ORM
- **Machine Learning**: Random Forest Regressor & Scikit-Learn
- **Async & Real-time**: WebSockets Broadcasting & Uvicorn

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/college-campus-.git
cd college-campus-
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*The backend API server will start on `http://127.0.0.1:8000` and seed demo data automatically.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*The web frontend will start on `http://localhost:3000`.*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/analytics/summary` | Retrieve overall KPI summary, crowd counts, and building load |
| `GET` | `/buildings` | Get list of all campus building nodes |
| `GET` | `/rooms` | Search rooms by building, floor, type, or availability |
| `PUT` | `/rooms/{id}/occupancy` | Update room live occupancy & broadcast via WebSocket |
| `GET` | `/navigation/route` | Calculate pedestrian route between origin and destination |
| `GET` | `/predict/all` | Fetch ML crowd predictions for a given time horizon (`minutes_ahead`) |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
