# 🎯 Job Application Tracker

A full-stack web application to track job applications — built with **React.js**, **Node.js**, **Express.js**, **SQLite**, and **JWT Authentication**.

> Built by **Lawan Kumar Bairi** | [LinkedIn](https://linkedin.com/in/lawangoud) | [GitHub](https://github.com/LawanGoud)

---

## 🚀 Live Demo

- **Frontend:** `https://your-app.vercel.app` _(update after deployment)_
- **Backend API:** `https://your-api.onrender.com` _(update after deployment)_

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login with token-based auth
- ➕ **Add Applications** — Track company, role, URL, date, status, notes
- ✏️ **Edit & Delete** — Update any application at any time
- 🔄 **Quick Status Change** — Move jobs between Applied → Interview → Offer → Rejected in one click
- 📊 **Analytics Dashboard** — Pie chart (status breakdown) + Bar chart (monthly trend)
- 📈 **KPI Cards** — Total applied, interviews, offers, interview rate %, offer rate %
- 🔍 **Search & Filter** — Search by company/role, filter by status
- ⬇️ **CSV Export** — Download all applications as a spreadsheet
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React.js, React Router v6, Chart.js  |
| Backend    | Node.js, Express.js                  |
| Database   | SQLite (via sqlite3)                 |
| Auth       | JWT (jsonwebtoken), bcryptjs         |
| Styling    | Pure CSS (no UI library)             |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # Register & Login routes
│   │   └── jobs.js          # CRUD routes for job applications
│   ├── database.js          # SQLite setup & table creation
│   ├── server.js            # Express app entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js      # Login page
│   │   │   ├── Register.js   # Register page
│   │   │   ├── Dashboard.js  # Main dashboard
│   │   │   ├── AddJob.js     # Add job modal
│   │   │   ├── JobCard.js    # Individual job card
│   │   │   └── StatsChart.js # Pie + Bar charts
│   │   ├── utils/
│   │   │   └── exportCSV.js  # CSV export utility
│   │   ├── App.js            # Routes & protected routes
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup (Run on Your Machine)

### Prerequisites

- Node.js v16+ installed
- npm installed

### Step 1 — Clone the repo

```bash
git clone https://github.com/LawanGoud/job-tracker.git
cd job-tracker
```

### Step 2 — Setup Backend

```bash
cd backend
npm install

# Create .env file from template
cp .env.example .env
# Edit .env and set:
#   - JWT_SECRET: a strong random string (min 32 chars)
#   - PORT: 5000 (or any available port if 5000 is in use)

npm run dev
# Server starts at http://localhost:5000 (or your PORT value)
```

### Step 3 — Setup Frontend

```bash
cd ../frontend
npm install

# Create .env file from template
cp .env.example .env
# Edit .env to match your backend port:
#   REACT_APP_API_URL=http://localhost:5000/api

npm start
# App opens at http://localhost:3000
```

---

## 🌐 Deployment Guide

### Prerequisites

- GitHub account (repo already pushed ✓)
- Render.com account (free tier OK)
- Vercel account (free tier OK)

---

### Backend → Render.com (Free)

#### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier authorization)
3. Click **"New+"** → **"Web Service"**

#### Step 2: Connect Your GitHub Repository

1. Select **"Build and deploy from a Git repository"**
2. Search for `Job-Tracker` repo → connect it
3. Choose:
   - **Name**: `job-tracker-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Step 3: Add Environment Variables

Click **"Add Environment Variable"** and add:

```
JWT_SECRET=your_super_secure_random_key_min_32_chars_example_AbCd1234EfGh5678IjKl9012MnOp!
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

_(Copy the Vercel URL later after deploying frontend)_

#### Step 4: Deploy

- Click **"Create Web Service"**
- Wait for deployment (2-3 minutes)
- Copy your **Render URL** → looks like `https://job-tracker-api.onrender.com`

**Note:** Free tier may have brief startup delays on inactive services.

---

### Frontend → Vercel (Free)

#### Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repo `Job-Tracker` → **Import**

#### Step 2: Configure Project

Set these options:

- **Framework Preset**: React
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `build` (default)

#### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://your-render-url.onrender.com/api
```

_(Use the Render URL from Step 4 above)_

#### Step 4: Deploy

- Click **"Deploy"**
- Wait for build (3-5 minutes)
- Get your **Vercel URL** → looks like `https://job-tracker-123abc.vercel.app`

---

### Final: Update Render's FRONTEND_URL

After Vercel deployment completes:

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Select **`job-tracker-api`** service
3. Go to **Settings** → **Environment**
4. Update `FRONTEND_URL` with your Vercel URL
5. Click **"Save Changes"** → triggers redeploy

---

### ✅ Test Deployment

#### Test Backend

```bash
curl https://your-render-url.onrender.com/
# Should return: {"message":"Job Tracker API is running ✅","version":"1.0.0"}
```

#### Test Frontend

1. Open: `https://your-vercel-domain.vercel.app`
2. Click **Register** → create new account
3. Login with your credentials
4. Should see the Dashboard with job tracking interface

---

### 🔧 Troubleshooting

**Frontend shows API errors?**

- Check `REACT_APP_API_URL` in Vercel environment
- Ensure Render backend is running (check dashboard)
- Wait 5 min for env changes to take effect (redeploy if needed)

**Backend won't start on Render?**

- Check **Logs** in Render dashboard
- Ensure `JWT_SECRET` is set (min 32 chars)
- Verify `FRONTEND_URL` is correct

**Cold start delays?**

- Render free tier spins down inactive services
- First request may take 10-30 sec
- Upgrade to paid for always-on

---

## 📡 API Reference

### Auth Endpoints

| Method | Route              | Description      | Auth Required |
| ------ | ------------------ | ---------------- | ------------- |
| POST   | /api/auth/register | Create new user  | No            |
| POST   | /api/auth/login    | Login, get token | No            |

### Jobs Endpoints

| Method | Route           | Description             | Auth Required |
| ------ | --------------- | ----------------------- | ------------- |
| GET    | /api/jobs       | Get all jobs (your own) | Yes           |
| GET    | /api/jobs/stats | Get status counts       | Yes           |
| POST   | /api/jobs       | Add new job             | Yes           |
| PUT    | /api/jobs/:id   | Update a job            | Yes           |
| DELETE | /api/jobs/:id   | Delete a job            | Yes           |

### Example Request

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@email.com","password":"yourpassword"}'

# Add a job (with token)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Infosys","job_role":"React Developer","applied_date":"2024-03-01","status":"Applied"}'
```

---

## 📸 Screenshots

> _(Add screenshots of Login page, Dashboard, and Analytics after deployment)_

---

## 🤝 Contact

**Lawan Kumar Bairi**

- 📧 lavan.bairi@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/lawangoud)
- 💻 [GitHub](https://github.com/LawanGoud)
