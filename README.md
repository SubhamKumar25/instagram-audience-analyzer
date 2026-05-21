# 📊 Instagram Audience Analyzer (AudienceAI)

An extremely modern, high-performance, full-stack AI-powered public Instagram Audience Analyzer application built with React, Vite, FastAPI, PostgreSQL, and Playwright. The platform allows brands, agencies, and creators to audit public profiles to detect fake followers, analyze estimated country distributions, calculate active engagement, and determine overall audience trust scores.

---

## 🚀 Key Features

* **Apple-Inspired Glassmorphic UI:** Smooth, high-fidelity layouts, dark mode default, micro-animations (Framer Motion), and responsive dashboard panels.
* **Dual-Mode Data Engine:** Stealth-mode Playwright driver paired with a high-fidelity **AI Behavioral Simulator** fallback to guarantee 100% application uptime even when Instagram rate walls are triggered.
* **Weighted Bot Detection Classifier:** Advanced ML scoring analyzing profile parameters (username entropy, follower ratios, bio link presence, and posting consistency).
* **Demographics NLP Parser:** Estimates follower country spreads using flag emojis, biography language, hashtags, and timing behaviors.
* **Premium Recharts Analytics:** Circular gauges, stacked bar charts, and vertical bar representations mapping demographic spreads.
* **One-Click PDF Reports:** Styled `@media print` rules allowing report compiles without third-party bundle weight.
* **Profile Compare modal:** Side-by-side comparative views for campaign audits.

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Axios.
* **Backend:** Python FastAPI, Async architecture (asyncpg + AsyncSession), slowapi.
* **AI/ML Heuristics:** Scikit-learn, weighted scoring rules, NLP token mappings.
* **Scraping:** Playwright with Stealth configuration.
* **Database:** PostgreSQL.
* **Cache:** Redis.

---

## 📂 Project Structure

```
Instagaram/
├── backend/
│   ├── app/
│   │   ├── analyzer/
│   │   │   ├── __init__.py
│   │   │   ├── nlp.py           # Country/language demographic estimators
│   │   │   └── scoring.py       # Weighted Bot Probability & Trust scores
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── analyze.py       # API endpoints (analyze, compare, history)
│   │   ├── scraper/
│   │   │   ├── __init__.py
│   │   │   └── instagram.py     # Playwright stealth public scraper & simulator fallback
│   │   ├── __init__.py
│   │   ├── config.py            # Environment configurations (Pydantic Settings)
│   │   ├── database.py          # Asynchronous SQLAlchemy database connections
│   │   ├── main.py              # Application entrypoint & lifespan setups
│   │   ├── models.py            # Declarative base schemas (SQLAlchemy)
│   │   └── schemas.py           # Type-safe validation schemas (Pydantic)
│   └── requirements.txt         # Backend Python dependencies
├── database/
│   └── schema.sql               # PostgreSQL raw database tables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudienceQualityChart.jsx
│   │   │   ├── CompareModal.jsx
│   │   │   ├── CountryChart.jsx
│   │   │   ├── FakeFollowerGauge.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── PDFReport.jsx
│   │   │   └── SkeletonLoader.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── ApiDocs.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   └── PrivacyPolicy.jsx
│   │   ├── App.jsx              # Routing & core React state manager
│   │   ├── index.css            # Base stylesheet (glassmorphic styling tokens)
│   │   └── main.jsx             # React DOM loader
│   ├── index.html               # Main template (fonts, PWA, SEO)
│   ├── postcss.config.js        # PostCSS processors
│   ├── tailwind.config.js       # Tailwind system tokens
│   ├── vercel.json              # Vercel SPA router config
│   └── package.json             # Frontend Vite configurations
├── .env.example                 # Example configuration environment parameters
└── README.md                    # Setup and guide handbook
```

---

## ⚡ Local Setup Instructions

### 1. Database Configuration
Install and start a PostgreSQL instance, then run the database script to set up tables:
```bash
psql -U postgres -d your_database_name -f database/schema.sql
```

### 2. Backend Execution
Navigate to the `backend/` directory and follow these actions:
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required dependencies
pip install -r requirements.txt

# Install Playwright browser engines
playwright install chromium
```
Configure your environment parameters:
```bash
cp ../.env.example .env
# Open .env and adjust the DATABASE_URL and REDIS_URL details
```
Launch the FastAPI development environment:
```bash
python app/main.py
```
The API is now running locally on: `http://localhost:8000` (docs are available at `http://localhost:8000/docs`).

### 3. Frontend Execution
Navigate to the `frontend/` directory and perform these steps:
```bash
cd frontend
# Install node packages
npm install

# Start the Vite React hot-reloading dev environment
npm run dev
```
Open `http://localhost:5173` inside your browser to access the beautiful glassmorphism dashboard.

---

## 🌐 Production Deployment

### 1. Database (Supabase)
1. Set up a free PostgreSQL database on [Supabase](https://supabase.com/).
2. Access the Supabase SQL editor and execute the contents of `database/schema.sql`.

### 2. Backend (Render / Railway)
1. Commit the codebase to a GitHub repository.
2. Link your repository to a service provider like [Render](https://render.com/) or [Railway](https://railway.app/).
3. Create a Python Web Service. Set the startup command to:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Define your environment parameters (`DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`) under the Environment configuration settings.

### 3. Frontend (Vercel)
1. Deploy the `frontend/` folder to [Vercel](https://vercel.com/).
2. Vercel automatically reads `frontend/vercel.json` to handle SPA route overrides.
3. Once deployed, the frontend connects to your production FastAPI server.
