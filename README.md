# EdgeTree Analyzer

EdgeTree Analyzer is a full‑stack project that accepts directed edges like `A->B`, builds one or more hierarchies, detects cycles, computes depth for valid trees, and returns a clean summary.

## Live project

- **Frontend (Vercel)**: `https://edge-tree-analyze.vercel.app`
- **Backend (Render)**: `https://edge-tree-backend.onrender.com`
- **API Endpoint**: `https://edge-tree-backend.onrender.com/bfhl`

## Author

- **Name**: Saurabh Kumar
- **GitHub**: `https://github.com/mrsingh1072`
- **LinkedIn**: `https://www.linkedin.com/in/saurabh-singh-959b48323?utm_source=share_via&utm_content=profile&utm_medium=member_android`

## Features

- Input validation for `X->Y` format (single uppercase letters A–Z)
- Captures invalid entries and duplicate edges
- Supports multiple independent trees (multiple roots)
- Multi‑parent handling (first parent kept, later ignored)
- Cycle detection per connected component
- Depth calculation for non‑cyclic trees (longest root‑to‑leaf path, node count)
- Summary with total trees, total cycles, and largest tree root

## Tech stack

- **Backend**: Node.js, Express.js, CORS, dotenv
- **Frontend**: React + Vite, Axios, React Icons

## API usage

### `POST /bfhl`

**Request**

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

**Response shape**

```json
{
  "user_id": "",
  "email_id": "",
  "college_roll_number": "",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 0,
    "total_cycles": 0,
    "largest_tree_root": null
  }
}
```

## Run locally

### Backend (Port 5000)

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
PORT=5000
USER_ID=yourname_ddmmyyyy
EMAIL_ID=your_college_email@example.edu
COLLEGE_ROLL_NUMBER=your_roll_number
```

Start:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Backend → Render

- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: `USER_ID`, `EMAIL_ID`, `COLLEGE_ROLL_NUMBER` (Render provides `PORT`)

### Frontend → Vercel

- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`


