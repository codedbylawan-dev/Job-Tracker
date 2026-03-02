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

### Backend → Render.com (Free)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables:
   - `JWT_SECRET` = your secret key
   - `FRONTEND_URL` = your Vercel frontend URL
7. Deploy → copy the URL (e.g. `https://job-tracker-api.onrender.com`)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-render-url.onrender.com/api`
5. Deploy → your app is live!

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
