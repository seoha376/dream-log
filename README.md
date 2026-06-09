# Dream Log

Dream Log is an intelligent personal dream journal application that helps users record, organize, search, and revisit dreams through date-based tracking, tagging, favorites, and AI-powered summarization.

---

## Team

* Song Seoha (Leader)
* Eungyeol Kim
* Mingyeong Kim

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios

### Backend

* Node.js
* Express
* SQLite

### Authentication

* JWT
* bcrypt

### AI Integration

* Google Gemini API
* `@google/genai`

### API Documentation

* Swagger
* Swagger UI

### Testing

* Jest
* Supertest

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
│       │   ├── DreamList.jsx
│       │   ├── DreamCreate.jsx
│       │   ├── DreamDetail.jsx
│       │   ├── DreamEdit.jsx
│       │   ├── Favorites.jsx
│       │   └── Search.jsx
│       │
│       ├── api/
│       │   ├── authApi.js
│       │   ├── dreamApi.js
│       │   └── tagApi.js
│       │
│       ├── components/
│       ├── assets/
│       └── styles/
│
├── backend/
│   └── src/
│       ├── app.js
│       ├── server.js
│       │
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
│       ├── models/
│       │   ├── User.js
│       │   ├── Dream.js
│       │   ├── Tag.js
│       │   └── DreamTag.js
│       │
│       ├── middleware/
│       ├── services/
│       ├── db/
│       ├── docs/
│       └── utils/
│
├── README.md
└── .gitignore
```

---

## Main Features

* User registration and login
* JWT-based authentication
* Dream creation, editing, deletion, and retrieval
* Dream tagging
* Favorite dreams
* Dream search
* AI-powered dream summary generation
* Swagger API documentation
* Backend unit and API tests

---

## Run Project

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Default backend URL:

```txt
http://localhost:5000
```

---

## Environment Variables

Create a `.env` file in the `backend` directory.

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
DATABASE_PATH=./src/db/database.sqlite
```

Create a `.env` file in the `frontend` directory if a custom API URL is needed.

```env
VITE_API_URL=http://localhost:5000
```

---

## API Documentation

Swagger UI is available at:

```txt
http://localhost:5000/api/docs
```

---

## Backend Scripts

```bash
cd backend
npm run dev
npm start
npm test
```

---

## Frontend Scripts

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Testing

The backend test suite uses Jest and Supertest.

```bash
cd backend
npm test
```

The tests cover authentication, protected routes, dream APIs, response handling, and error cases.

---

## Git Workflow

### Branch Rules

* Do not push directly to `main`.
* Work on a feature or test branch.
* Pull the latest changes before starting work.
* Resolve conflicts locally before pushing.
* Merge through pull requests or agreed team integration branches.

### Example Branch Names

```txt
feature/auth
feature/dream
feature/tag
feature/ai-summary
test/backend-integration
test/total-integration
```

---

## AI Use Disclosure

AI assistance was used during development for:

* Code review
* Debugging support
* Test planning
* API documentation assistance
* README drafting
* Git conflict resolution support

All generated code and documentation were reviewed, tested, modified, and understood by the project team before submission.
