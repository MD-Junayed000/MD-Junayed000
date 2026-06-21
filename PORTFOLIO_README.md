# Muhammad Junayed - Portfolio Website

A full-stack portfolio website featuring an AI-powered chatbot using Retrieval-Augmented Generation (RAG). Built with Next.js on the frontend and FastAPI on the backend, with ChromaDB for vector storage and HuggingFace for LLM inference.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Browser                              │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js on Vercel)                      │
│                                                                     │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│  │ Public Pages  │  │ Admin Panel  │  │   Chat Widget          │   │
│  │ (Portfolio)   │  │ (CRUD)       │  │   (RAG Chatbot)        │   │
│  └───────────────┘  └──────────────┘  └────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ REST API
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI on Render)                       │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Auth       │  │ Public API │  │ Admin API   │  │ Chat API   │  │
│  │ (JWT)      │  │ (Read)     │  │ (CRUD)      │  │ (RAG)      │  │
│  └────────────┘  └────────────┘  └─────────────┘  └────────────┘  │
│                                                                     │
│  ┌────────────────────────┐  ┌──────────────────────────────────┐  │
│  │ SQLite (Portfolio Data)│  │ ChromaDB (Vector Store for RAG)  │  │
│  └────────────────────────┘  └──────────────────────────────────┘  │
│                                         │                           │
│                                         ▼                           │
│                              ┌──────────────────────┐              │
│                              │ HuggingFace API      │              │
│                              │ (LLM Inference)      │              │
│                              └──────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Database:** SQLite with SQLAlchemy (async)
- **Vector DB:** ChromaDB (embedded, persistent)
- **Embeddings:** sentence-transformers via HuggingFace
- **LLM:** HuggingFace Inference API (default: Mistral-7B-Instruct-v0.3)
- **Auth:** JWT-based admin authentication
- **Deployment:** Render

## Local Development Setup

### Prerequisites
- Node.js 18+ (recommended: 22)
- Python 3.11+
- Git

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your values (especially HF_API_TOKEN)

# Run the server
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local if needed (defaults to localhost:8000)

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

Change these in your `.env` file for production.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT token signing key | `dev-secret-key-change-in-production` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Hash of `admin123` |
| `HF_API_TOKEN` | HuggingFace API token for LLM inference | (required) |
| `HF_MODEL_ID` | HuggingFace model for chat | `mistralai/Mistral-7B-Instruct-v0.3` |
| `CHROMA_PERSIST_DIR` | ChromaDB data directory | `./chroma_data` |
| `CORS_ORIGINS` | Allowed CORS origins (JSON array) | `["http://localhost:3000"]` |
| `DATABASE_URL` | SQLAlchemy database URL | `sqlite+aiosqlite:///./portfolio.db` |
| `PORT` | Server port (set by Render) | `8000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/about` - About content
- `GET /api/projects` - List projects
- `GET /api/skills` - List skills
- `GET /api/research` - List research publications
- `GET /api/certificates` - List certificates
- `GET /api/resume` - Resume info

### Chat
- `POST /api/chat` - Send message to RAG chatbot

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Admin (requires JWT)
- `PUT /api/admin/about` - Update about content
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/{id}` - Update project
- `DELETE /api/admin/projects/{id}` - Delete project
- `POST /api/admin/skills` - Create skill
- `PUT /api/admin/skills/{id}` - Update skill
- `DELETE /api/admin/skills/{id}` - Delete skill
- `POST /api/admin/research` - Create research
- `PUT /api/admin/research/{id}` - Update research
- `DELETE /api/admin/research/{id}` - Delete research
- `POST /api/admin/certificates` - Create certificate
- `PUT /api/admin/certificates/{id}` - Update certificate
- `DELETE /api/admin/certificates/{id}` - Delete certificate
- `POST /api/admin/upload-photo` - Upload profile photo
- `POST /api/admin/upload-pdf` - Upload PDF for RAG processing
- `DELETE /api/admin/documents/{id}` - Remove document from vector store
- `PUT /api/admin/settings` - Update runtime settings

## Deployment

### Frontend (Vercel)

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com`)
5. Deploy

Vercel will automatically detect Next.js and configure the build.

### Backend (Render)

1. Push your repository to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repository
4. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `SECRET_KEY` - a strong random string
   - `ADMIN_USERNAME` - your admin username
   - `ADMIN_PASSWORD_HASH` - bcrypt hash of your password
   - `HF_API_TOKEN` - your HuggingFace API token
   - `HF_MODEL_ID` - model to use (optional, defaults to Mistral-7B)
   - `CORS_ORIGINS` - `["https://your-app.vercel.app"]`
   - `PORT` - automatically set by Render
6. Deploy

Alternatively, Render can auto-detect configuration from the `render.yaml` file in the backend directory.

#### Generating a Password Hash

```bash
python -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('your-password'))"
```

### Post-Deployment Checklist

- [ ] Backend health check passes: `GET /api/health`
- [ ] Frontend loads and displays portfolio sections
- [ ] Admin login works at `/admin`
- [ ] Chat widget connects to backend and returns responses
- [ ] PDF upload and RAG pipeline functions correctly
- [ ] CORS allows requests from your Vercel domain

## Project Structure

```
portfolio-website/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── admin/      # Admin panel pages
│   │   │   └── page.tsx    # Main portfolio page
│   │   ├── components/     # React components
│   │   │   ├── sections/   # Portfolio sections (About, Projects, etc.)
│   │   │   ├── chat/       # Chat widget
│   │   │   └── ui/         # Shared UI components
│   │   └── lib/            # Utilities (API client, auth helpers)
│   ├── public/             # Static assets
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── backend/                 # FastAPI backend application
│   ├── routers/            # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── admin.py        # Admin CRUD endpoints
│   │   ├── public.py       # Public read endpoints
│   │   └── chat.py         # Chatbot endpoint
│   ├── services/           # Business logic
│   │   ├── chatbot.py      # RAG chatbot service
│   │   ├── vector_store.py # ChromaDB operations
│   │   └── seed_data.py    # Initial data seeding
│   ├── models/             # Pydantic schemas
│   ├── tests/              # pytest test suite
│   ├── uploads/            # Uploaded files (gitignored)
│   ├── render.yaml         # Render deployment config
│   ├── Procfile            # Process file for deployment
│   ├── Dockerfile          # Container definition
│   └── requirements.txt
├── .gitignore
└── README.md
```

## License

This project is proprietary. All rights reserved.
