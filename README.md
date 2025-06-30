# 🌱 Carbon Footprint Tracker

A web application that helps users estimate their carbon footprint and receive AI-based personalized recommendations to reduce emissions. The app supports logging daily lifestyle activities and visualizing carbon impact using interactive charts.

## 🧠 Features

- User authentication (login/signup)
- Carbon footprint form for lifestyle inputs
- AI-powered carbon estimation using trained ML model
- Personalized recommendations based on activities
- Dashboard with:
  - Total emissions
  - Daily trends graph (line chart)
  - Recent activity table
- Admin and user profile management
- PostgreSQL database integration

---

## 🛠 Tech Stack

- **Frontend**: React.js, Chart.js (via Recharts), CSS
- **Backend**: Node.js + Express
- **AI Model**: Python + Flask + scikit-learn
- **Database**: PostgreSQL
- **Session Auth**: Express-session + Cookies

---

## 🧩 Folder Structure
```bash
carbon_foot_print/
├── client/ # React frontend
├── server/
│ ├── CARBON_PROJECT/
│ │ ├── ML_PART/ # Python Flask AI model
│ │ │ ├── model/ # Saved ML models (carbon_model.pkl, encoder.pkl)
│ │ │ └── app.py # Flask server
│ │ └── RECOMENDATION_SYSTEM/
│ │ └── recommend_engine.py
│ ├── routes/ # Express routes
│ └── index.js # Main Express server
├── .env # Environment variables
├── .gitignore
└── README.md

```
---

## 🧪 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Dharaneeshponnuvel/carbon_foot_print.git
cd carbon_foot_print
```
## 2. Install Dependencies
- Backend:
```bash
cd server
npm install
```

- Frontend:
```bash
  cd ../client
  npm install
```
- ML FLASK:
  ```bash
    cd ../server/CARBON_PROJECT/CARBON_PROJECT/ML_PART
    pip install -r requirements.txt
  ```

## 3. Environment Variables
```bash
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_clint_id
GOOGLE_CLIENT_SECRET=your_client_secret
EMAIL_USER=user_email
EMAIL_PASS=email_pass
```

4. Start Servers
Flask AI Model:

```bash

cd server/CARBON_PROJECT/CARBON_PROJECT/ML_PART
python app.py
```
```bash
Node.js Backend:
cd server
node index.js
```
```bash
React Frontend:
cd client
npm start
```

## 📊 Sample Screenshot

## 📦 Notes
Some model files (.pkl) may be over 25MB — if you're pushing to GitHub, use Git LFS for large file storage.

Secure your .env and do not commit sensitive credentials.

## 📜 License
 - MIT License - Free to use for educational and personal projects.

