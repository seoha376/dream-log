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
http://localhost:5000
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


## API Documentation

Swagger UI is available at:

```txt
http://localhost:5000/api/docs
```

---

## Testing

The backend test suite is implemented using **Jest** and **Supertest**.

### Test Coverage
#### Unit Tests

* authMiddleware
* response utility

#### API Tests

* User registration
* User login
* Protected route authentication
* Dream creation
* Dream retrieval
* Error handling

#### Error Cases Covered

* 400 Bad Request
* 401 Unauthorized
* 404 Not Found

### Run Tests

```bash
cd backend
npm test
```

Example output:

```txt
PASS tests/unit/authMiddleware.test.js
PASS tests/unit/response.test.js
PASS tests/api/auth.test.js
PASS tests/api/protected.test.js
PASS tests/api/dream.test.js

Test Suites: 5 passed, 5 total
Tests: 14 passed, 14 total
```

---

## Continuous Integration

GitHub Actions automatically runs the backend test suite on every push and pull request.

Workflow file:

```txt
.github/workflows/test.yml
```

The workflow performs:

* Dependency installation
* Jest test execution
* API integration test execution
* CI validation before merge

---

## AI Use Disclosure

AI assistance (ChatGPT) was used during development for:

* Code review
* Debugging support
* Test planning
* API documentation assistance
* CI/CD workflow setup
* README drafting

All generated code and documentation were reviewed, tested, modified, and understood by the project team before submission.
