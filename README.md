# EdgeTree Analyzer (Full Stack)

Node/Express backend + React/Vite frontend to analyze directed edge lists, build hierarchies, detect cycles, compute depth, and return SRM-style summary.

## Folder structure

```
EdgeTree Analyzer/
  backend/
  frontend/
```

## Backend (Express) — Port 5000

### Setup

```bash
cd backend
npm install
```

### Configure identity (required by SRM rule)

Edit `backend/.env`:

- `USER_ID=yourname_ddmmyyyy`
- `EMAIL_ID=your_college_email@example.edu`
- `COLLEGE_ROLL_NUMBER=your_roll_number`

### Run

```bash
cd backend
npm run dev
```

### API

`POST /bfhl`

Request:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Response (shape):

```json
{
  "user_id": "",
  "email_id": "",
  "college_roll_number": "",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {}
}
```

## Frontend (React + Vite)

### Setup & run

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

The UI calls `http://localhost:5000/bfhl`.

## Deployment

### Backend → Render

1. Push this project to GitHub.
2. On Render, create a **New Web Service** from the repo.
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add environment variables:
   - `PORT` (Render sets it automatically; keep code using `process.env.PORT`)
   - `USER_ID`, `EMAIL_ID`, `COLLEGE_ROLL_NUMBER`
7. Deploy and copy the backend URL.

### Frontend → Vercel

1. Import the repo in Vercel.
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Deploy.

> If you deploy, update `frontend/src/services/api.js` `baseURL` to your Render backend URL.

## Making it plagiarism-free (practical checklist)

- Change identity fields in `backend/.env` to your real details.
- Change UI wording (subtitle/help text), colors, spacing, and card layouts in `frontend/src/App.css`.
- Add 2–3 extra sample datasets and a small “About” section describing your own approach.
- Record a short demo video and add screenshots to this README.

