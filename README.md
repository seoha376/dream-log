# Dream Log

An intelligent personal dream journal application that helps users record, organize, and revisit dreams through date-based tracking, tagging, and AI-powered summarization.

---

## Team

- Song Seoha (Leader)
- Eungyeol Kim
- Mingyeong Kim

---

## Tech Stack

### Frontend
- React
- Vite

### Backend
- Node.js
- Express

### Database
- SQLite

### Authentication
- JWT
- bcrypt

### AI Integration
- OpenAI API

---

## Project Structure

```txt
dream-log/
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── DreamCreate.jsx
│       │   ├── DreamDetail.jsx
│       │   └── Search.jsx
│       │
│       ├── components/
│       ├── api/
│       │   ├── authApi.js
│       │   ├── dreamApi.js
│       │   └── tagApi.js
│       │
│       ├── hooks/
│       ├── context/
│       └── styles/
│
├── backend/
│   └── src/
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── dreamRoutes.js
│       │   └── tagRoutes.js
│       │
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── dreamController.js
│       │   └── tagController.js
│       │
│       ├── middleware/
│       │   └── authMiddleware.js
│       │
│       ├── db/
│       │   └── database.js
│       │
│       ├── models/
│       ├── utils/
│       └── server.js
│
├── docs/
│   ├── api/
│   └── db/
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Run Project

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```txt
http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on:

```txt
http://localhost:3000
```

Health check:

```txt
GET /health
```

Example response:

```json
{
  "success": true,
  "message": "Dream Log API is running"
}
```

---

## Environment Variables

Create a `.env` file based on `.env.example`

```env
PORT=3000
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
DATABASE_PATH=./src/db/dreamlog.sqlite
```

---

## Git Workflow

### Branch naming

```txt
feature/auth
feature/dream
feature/calendar
feature/ui-login
feature/ui-dashboard
feature/ai-summary
```

### Pull Request naming

```txt
[FE] Login UI
[FE] Dashboard Layout
[BE] Auth API
[BE] Dream CRUD
```

### Rules

- Do not push directly to `main`
- Create a feature branch before working
- Pull latest changes before starting work
- Merge through Pull Requests

---

## Current Progress

### Completed

- Repository setup
- Frontend initialization
- Backend initialization
- Basic folder structure
- Environment configuration
- Health check API

### Next

- Database schema design
- REST API specification
- Authentication API
- Login/Register UI
- Dashboard UI