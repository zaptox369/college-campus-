# 🚀 Deployment Guide: Digital Twin Campus on Vercel

This repository contains the Next.js 14 frontend and FastAPI backend.

---

## ⚡ Option 1: Deploy Frontend to Vercel (1-Click via GitHub Dashboard) — Recommended

Since the repository is already synchronized at [github.com/zaptox369/college-campus-](https://github.com/zaptox369/college-campus-), deploying to Vercel takes less than 60 seconds:

1. **Open Vercel**:
   Go to [vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. **Import Repository**:
   Select or search for `zaptox369/college-campus-` and click **Import**.
3. **Configure Root Directory**:
   - In the **Root Directory** field, click **Edit**.
   - Select `frontend` and click **Continue**.
   *(Vercel will automatically detect the **Next.js** framework preset).*
4. **Environment Variables (Optional)**:
   - If you have hosted the FastAPI backend (e.g. on Render or Railway), add:
     - `NEXT_PUBLIC_API_URL` = `https://<your-backend-url>`
     - `NEXT_PUBLIC_WS_URL` = `wss://<your-backend-url>/ws/occupancy`
   - *Note: If no backend is set, the frontend automatically falls back to the built-in Digital Twin simulated telemetry dataset with interactive live state!*
5. **Click Deploy**:
   Vercel will build and assign a production URL (e.g., `https://college-campus-xxx.vercel.app`).

---

## 💻 Option 2: Deploy Frontend via Vercel CLI

You can also deploy directly from your local terminal:

1. Authenticate with Vercel:
   ```bash
   npx vercel login
   ```
2. Deploy the frontend:
   ```bash
   cd frontend
   npx vercel --prod
   ```

---

## 🐍 Backend Hosting (FastAPI & WebSockets)

Because Vercel serverless functions are stateless and cannot sustain persistent long-lived WebSocket connections, the Python FastAPI backend is best hosted on **Render**, **Railway**, or **Fly.io** (which support continuous WebSocket streams):

1. **Deploy to Render (Free Tier Web Service)**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Once deployed on Render, update your Vercel Project Environment Variables (`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`) with your Render URL.
