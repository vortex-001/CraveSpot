# CraveSpot — Cloud Deployment Guide

This guide walks you through deploying the complete **CraveSpot** application (MySQL Database + Python Flask Backend + Modern Frontend) to the cloud.

---

## Deployment Option 1: Railway (Recommended — All-in-One Dashboard)

On Railway, your **MySQL database**, **Python Flask Backend**, and **Frontend Website** all run in one unified project canvas.

### Step 1: Create a Railway Project & Add MySQL
1. Go to [https://railway.app](https://railway.app) and log in with your GitHub account.
2. Click **+ New Project** -> **Provision MySQL**.
3. Railway instantly creates a dedicated MySQL 8.0 instance.
4. Click the **MySQL** service box:
   - Go to the **Variables** tab to view your credentials (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`).
   - Go to the **Connect** tab to copy the public connection URL.

### Step 2: Initialize Database Schema & Seed Data
Choose either method:

**Method A: Using Railway Data Tab (In Browser)**:
- Click the **MySQL** card -> Click the **Data** tab.
- Copy the contents of `database/schema.sql` and run them directly in the query editor.

**Method B: From your Local Terminal**:
- Copy the public `MYSQL_URL` from the Connect tab.
- In PowerShell, run:
  ```bash
  $env:MYSQL_URL="<paste-your-railway-mysql-url>"
  .\venv\Scripts\python.exe init_db.py
  ```
  All 15 tables and culinary menus will be created and seeded automatically.

### Step 3: Deploy the CraveSpot Web App
1. On your Railway project canvas, click **+ New** -> **GitHub Repo**.
2. Select your repository: **`vortex-001/CraveSpot`**.
3. Click the new service card:
   - Go to **Variables**:
     - Click **+ New Variable** -> **Add Reference** -> select `MySQL` -> `MYSQL_URL` (Railway links them via `${{MySQL.MYSQL_URL}}`).
     - Add `PORT` = `5000`.
     - Add `DEBUG` = `False`.
   - Go to **Settings**:
     - Under **Networking**, click **Generate Domain**.
4. Railway assigns you a live public domain (e.g. `https://cravespot-production.up.railway.app`).
5. Open the domain in your browser to view the live website and discovery map.

---

## Deployment Option 2: Render (Backend) + Vercel (Frontend) + TiDB (Database)

If you prefer using separate specialized cloud platforms:

| Layer | Free Platform | Setup |
|---|---|---|
| **Database** | **TiDB Cloud Serverless** | Free MySQL 8.0 cluster (5 GB storage, no credit card) |
| **Backend API** | **Render.com** | Python 3 Gunicorn WSGI Web Service |
| **Frontend CDN** | **Vercel** | Global Edge CDN pointing to the `frontend/` directory |

### 1. Database Setup (TiDB Cloud)
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and create a free Serverless cluster.
2. Choose region (`AWS / Mumbai` or `AWS / Singapore`).
3. Under **Connect**, copy your connection string:
   ```text
   mysql://<user>:<password>@<host>:4000/CraveSpot?ssl-mode=REQUIRED
   ```
4. Run `init_db.py` to seed the database.

### 2. Backend Setup (Render.com)
1. Go to [https://render.com](https://render.com) -> **New +** -> **Web Service**.
2. Connect `vortex-001/CraveSpot`.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `gunicorn --bind 0.0.0.0:$PORT backend.app:app`.
5. Environment Variable: `DATABASE_URL` = `<your-tidb-url>`.

### 3. Frontend Setup (Vercel)
1. Go to [https://vercel.com](https://vercel.com) -> **Add New Project**.
2. Select `vortex-001/CraveSpot`.
3. Set **Root Directory** to `frontend`.
4. Click **Deploy**. Live in 15 seconds at `https://cravespot.vercel.app`.
