Dream Log Repository Setup Specification
Version: Initial Setup

========================================
1. Repository Information
========================================

Repository Name:
dream-log

Project Description:
An intelligent personal dream journal application.

Repository Structure:

dream-log/

├─ frontend/
├─ backend/
├─ docs/
│   ├─ api/
│   └─ db/
│
├─ README.md
├─ .gitignore
├─ .env.example

========================================
2. Git Rules
========================================

Main Branch:
main

Recommended Feature Branch Format:

feature/auth
feature/dream
feature/calendar
feature/ui-login
feature/ui-dashboard
feature/ai-summary

PR Naming Rule:

[FE] Login UI
[FE] Dashboard Layout
[BE] Auth API
[BE] Dream CRUD

Rules:

- Do not push directly to main
- Work on feature branches
- Pull latest changes before starting
- Merge through Pull Request

========================================
3. Frontend Setup
========================================

Framework:
React + Vite

Run:

cd frontend
npm install
npm run dev

Frontend Structure:

frontend/src/

├─ pages/
│   ├─ Login.jsx
│   ├─ Register.jsx
│   ├─ Dashboard.jsx
│   ├─ DreamCreate.jsx
│   ├─ DreamDetail.jsx
│   └─ Search.jsx
│
├─ components/
├─ api/
│   ├─ authApi.js
│   ├─ dreamApi.js
│   └─ tagApi.js
│
├─ hooks/
├─ context/
└─ styles/

========================================
4. Backend Setup
========================================

Framework:
Node.js + Express

Installed Packages:

Dependencies:

express
cors
dotenv

Dev Dependencies:

nodemon

Run:

cd backend
npm install
npm run dev

Backend Structure:

backend/src/

├─ routes/
│   ├─ authRoutes.js
│   ├─ dreamRoutes.js
│   └─ tagRoutes.js
│
├─ controllers/
│   ├─ authController.js
│   ├─ dreamController.js
│   └─ tagController.js
│
├─ middleware/
│   └─ authMiddleware.js
│
├─ db/
│   └─ database.js
│
├─ models/
├─ utils/
└─ server.js

========================================
5. Backend Health Check
========================================

Endpoint:

GET /health

Response:

{
  "success": true,
  "message": "Dream Log API is running"
}

Test URL:

http://localhost:3000/health

========================================
6. Environment Variables
========================================

.env.example

PORT=3000
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
DATABASE_PATH=./src/db/dreamlog.sqlite

========================================
7. Git Ignore
========================================

Ignored:

node_modules/
.env
.DS_Store
dist/
build/
coverage/
backend/database.sqlite
backend/*.db

========================================
8. Current Milestone Status
========================================

Completed:

[O] Repository created
[O] Git initialized
[O] Frontend project created
[O] Backend project created
[O] Basic folder structure created
[O] .env.example created
[O] README draft created
[O] Health check API implemented

Next:

[ ] Database schema design
[ ] API specification
[ ] Authentication API
[ ] Login/Register UI
[ ] Dashboard UI