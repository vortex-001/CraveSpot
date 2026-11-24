# CraveSpot — Free Full-Stack Cloud Deployment Guide

This guide walks you through deploying the complete **CraveSpot** application (Cloud MySQL Database + Python Flask Backend + Modern Frontend) **100% for free**, with zero monthly bills and no credit card required.

---

## Architecture Overview

| Layer | Recommended Free Platform | Specifications | Cost |
|---|---|---|---|
| **Database** | **TiDB Cloud Serverless** | 5 GB storage, MySQL 8.0 wire-compatible | **$0 / month** (No credit card) |
| **Web Service (App + API)** | **Render.com** | Python 3, Gunicorn WSGI, unified frontend & API | **$0 / month** |
| **(Optional) Static CDN** | **Vercel** or **Netlify** | Global Edge CDN for `frontend/` directory | **$0 / month** |

---

## Step 1: Create Free Cloud MySQL Database (TiDB Cloud)

1. On your TiDB Cloud console ([https://tidbcloud.com](https://tidbcloud.com)):
   - Click the black **Create Resource** button in the top right.
2. Choose **Serverless** (the free-forever tier).
3. Set your Cluster Name: `cravespot-db`.
4. Choose your closest region:
   - **AWS / Mumbai** (`ap-south-1`) — Best latency for India.
   - Or **AWS / Singapore** (`ap-southeast-1`).
5. Click **Create**.
6. When the cluster is ready (~30 seconds), a popup or **Connect** screen will appear:
   - Make sure to **save your generated root password**.
   - Under **Connect with**, select **General / Python**.
   - Copy your connection string (format: `mysql://<user>:<password>@<host>:4000/test?ssl-mode=REQUIRED`).
   - Change the database name in the path from `test` to `CraveSpot` (or keep `test`).

---

## Step 2: Initialize Schema & Seed Data

In your local project terminal, run the following command to populate all 15 tables and menus on your new TiDB cloud database:

```powershell
$env:DATABASE_URL="<paste-your-tidb-connection-string>"
.\venv\Scripts\python.exe init_db.py
```

This will automatically create all tables, indexes, triggers, and food catalogs directly in your TiDB cloud database.

---

## Step 3: Deploy Full Application on Render.com (Free)

1. Go to **[https://render.com](https://render.com)** and sign in with your GitHub account.
2. Click **New +** (top right) -> select **Web Service**.
3. Choose **Build and deploy from a Git repository**, and select your repo:
   **`vortex-001/CraveSpot`**
4. Configure the Web Service:
   - **Name**: `cravespot`
   - **Region**: Singapore (or closest to your DB)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT backend.app:app`
   - **Instance Type**: `Free`
5. Click **Advanced** -> **Add Environment Variable**:
   - `DATABASE_URL`: `<your-tidb-connection-string-from-step-1>`
   - `PORT`: `10000`
   - `DEBUG`: `False`
   - `CORS_ORIGINS`: `*`
6. Click **Create Web Service**.

Render will automatically build and deploy the complete CraveSpot application in approximately 2 minutes.

---

## Step 4: Open Your Live Production Site

Once deployed, click your assigned Render URL (e.g. `https://cravespot.onrender.com`):
- **Live Homepage & Map**: `https://cravespot.onrender.com/`
- **Restaurant Directory**: `https://cravespot.onrender.com/pages/restaurants.html`
- **Dish Catalog**: `https://cravespot.onrender.com/pages/dishes.html`
- **API Health Check**: `https://cravespot.onrender.com/api/health`
