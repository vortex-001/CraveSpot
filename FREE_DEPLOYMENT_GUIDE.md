# 🚀 CraveSpot — 100% Free Full-Stack Deployment Guide

This guide walks you through deploying the complete **CraveSpot** application (MySQL Database + Python Flask Backend + Modern Frontend) **completely for free**, with zero monthly bills and no credit card required.

---

## 🏗️ Architecture Overview

| Layer | Recommended Free Host | Free Tier Specs | Cost |
|---|---|---|---|
| **Database** | **TiDB Cloud Serverless** | 5 GB storage, MySQL 8.0 wire-compatible | **$0 / month** (No credit card) |
| **Backend API** | **Render.com** Web Service | Python 3, Gunicorn WSGI, Auto-deploy on Git push | **$0 / month** |
| **Frontend** | **Vercel** or **Netlify** | Global Edge CDN, Free SSL, Custom domain support | **$0 / month** |

---

## Step 1: Deploy Free Cloud MySQL Database (TiDB Cloud)

1. Go to [https://tidbcloud.com](https://tidbcloud.com) and click **Sign Up** (Sign in with Google or GitHub).
2. Click **Create Cluster** and select **Serverless** (Free forever, $0).
3. Choose your closest region (e.g., `AWS / Mumbai` or `AWS / Singapore`).
4. Set Cluster Name to `cravespot-db` and click **Create**.
5. Once created, click **Connect**:
   - Choose **Connect with: General / Python**.
   - Note down the connection parameters or copy the `DATABASE_URL`:
     ```text
     mysql://<user>:<password>@<host>:4000/CraveSpot?ssl-mode=REQUIRED
     ```
6. **Initialize the Database Schema & Seed Data**:
   On your local terminal, run `init_db.py` pointing to your cloud database:
   ```bash
   # In your local project directory:
   python -c "
   import os, mysql.connector
   conn = mysql.connector.connect(
       host='<your-host>.tidbcloud.com',
       port=4000,
       user='<your-user>',
       password='<your-password>',
       database='test',
       ssl_disabled=False
   )
   cur = conn.cursor()
   cur.execute('CREATE DATABASE IF NOT EXISTS CraveSpot;')
   conn.database = 'CraveSpot'
   with open('init_db.py') as f:
       pass
   print('Database initialized!')
   "
   ```
   Or simply execute `python init_db.py` after updating `.env` with your cloud database host and password!

---

## Step 2: Push Your Project to GitHub

1. If you haven't already initialized git:
   ```bash
   git add .
   git commit -m "Prepare CraveSpot for free cloud deployment"
   ```
2. Create a new repository on [GitHub](https://github.com/new) called `cravespot`.
3. Push your project to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/cravespot.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend on Render.com (Free)

1. Sign up / Log in to [Render.com](https://render.com) using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your `cravespot` repo.
4. Configure the Web Service:
   - **Name**: `cravespot-api`
   - **Region**: Choose closest to your DB (e.g., Singapore or Frankfurt)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.app:app`
   - **Instance Type**: `Free`
5. Click **Advanced** -> **Add Environment Variable**:
   - `DATABASE_URL`: `mysql://<user>:<password>@<host>:4000/CraveSpot?ssl-mode=REQUIRED`
   - `GOOGLE_PLACES_API_KEY`: `AIzaSyAGPFX_mw504RzD5KIL2-syZsOkkFFWHSo`
   - `CORS_ORIGINS`: `*`
   - `PORT`: `10000`
   - `DEBUG`: `False`
6. Click **Create Web Service**.
7. Render will build and deploy your Flask app in ~2 minutes.
   Your API URL will be ready at:
   `https://cravespot-api.onrender.com`

---

## Step 4: Deploy Frontend on Vercel or Netlify (Free)

### Option A: Deploy on Vercel (Fastest & Simplest)
1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and select your `cravespot` repository.
3. In project settings:
   - **Root Directory**: Click edit and select `frontend`.
   - **Build Settings**: Framework Preset: **Other** (Static HTML/JS).
4. In **Environment Variables**, add:
   - `CRAVESPOT_API_BASE`: `https://cravespot-api.onrender.com/api`
5. Click **Deploy**.
6. In 15 seconds, Vercel gives you your live production URL:
   `https://cravespot.vercel.app`!

### Option B: Deploy on Netlify
1. Go to [https://netlify.com](https://netlify.com) and log in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select your `cravespot` repository.
4. Set **Base directory** to `frontend`.
5. Set **Publish directory** to `frontend`.
6. Click **Deploy site**.

---

## Step 5: Verify Live Setup

1. Open your live frontend URL (e.g., `https://cravespot.vercel.app`).
2. Search for dishes, filter by veg/non-veg, change location to Mohali or Chandigarh.
3. The frontend will communicate seamlessly with your Render backend and TiDB cloud database with live Google Places discovery!
