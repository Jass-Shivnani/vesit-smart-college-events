# Free Cloud Deployment Guide

This project is architected as a **unified full-stack application**. In production, the Express backend automatically serves the pre-compiled React frontend and handles all `/api/*` REST endpoints on a single port.

---

## Method 1: Instant Live Public HTTPS Link (Active Now)

An instant public HTTPS tunnel is currently running from this machine:

- **Public URL**: [https://spotty-geckos-sneeze.loca.lt](https://spotty-geckos-sneeze.loca.lt)
- **Tunnel Password / Host IP**: `103.120.253.87`

*(When you open the link on any phone or PC for the first time, localtunnel displays a security check asking for the "Tunnel Password". Enter `103.120.253.87` and click Submit. The full app will load instantly with camera QR scanning enabled).*

---

## Method 2: Permanent 24/7 Free Cloud Hosting on Render.com

Render offers a free tier that hosts full-stack Node.js web services with automatic HTTPS certificates and custom domains.

### Step 1: Initialize Git and Push to GitHub
Open your terminal in `c:\Jass\ACC DEVP\Riya` and run:
```bash
git init
git add .
git commit -m "Production release of Smart College Event Management System"
git branch -M main
```
Create a new empty repository on [GitHub](https://github.com/new) (e.g. `vesit-event-management`), then link and push:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/vesit-event-management.git
git push -u origin main
```

### Step 2: Deploy on Render in 1 Click
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign up/sign in (Free).
2. Click **"New +"** in the top right and select **"Blueprint"** (or **"Web Service"**).
3. Connect your GitHub repository.
4. Render will automatically detect the [render.yaml](render.yaml) file:
   - **Build Command**: `npm run deploy:build`
   - **Start Command**: `node backend/src/server.js`
5. Click **"Apply"** or **"Create Web Service"**.
6. Within 2-3 minutes, your app will be live globally at `https://vesit-smart-events.onrender.com` (or your chosen name)!

---

## Method 3: Free Deployment on Koyeb or Railway

If you prefer Koyeb or Railway:
1. Connect your GitHub repository.
2. Set the **Build Command** to:
   ```bash
   npm run deploy:build
   ```
3. Set the **Start Command** to:
   ```bash
   node backend/src/server.js
   ```
4. Set the Port to `5000` (or leave default `$PORT`).
5. Deploy!

---

## Verified Production Seed Accounts

All accounts use authentic bcrypt password verification and cryptographic JWT authentication:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@vesit.edu` | `Admin@123` | Event creation, capacity editing, attendance analytics, registration freeze, CSV export |
| **Gate Scanner** | `scanner@vesit.edu` | `Scanner@123` | Venue gate check-in, duplicate detection, emergency roster search |
| **Student (Riya)** | `riya@vesit.edu` | `Student@123` | Ticket reservations, waitlist queueing, personal pass downloads |
| **Student (Prachi)** | `prachi@vesit.edu` | `Student@123` | Ticket reservations, personal pass downloads |
