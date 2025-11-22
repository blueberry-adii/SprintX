# Setup Guide

Follow these instructions to set up the project locally.

## Prerequisites
- **Node.js** (v18+)
- **Docker Desktop** (recommended for DB)
- **Git**

## Environment Variables
Create a `.env` file in the root directory. You can use `.env.example` as a template.

```ini
# Database (MySQL)
DB_HOST=mysql
DB_USER=user
DB_PASSWORD=pass
DB_NAME=sprintx
DB_PORT=3306

# Firebase Admin (Backend)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Google Gemini (AI)
GEMINI_API_KEY=your-gemini-api-key

# Frontend Config
VITE_API_URL=http://localhost:5000/api/v1
```

> **Note**: If running the backend locally (outside Docker) but keeping the DB in Docker, change `DB_HOST` to `localhost` and ensure the port mapping in `docker-compose.yml` matches (e.g., `3307:3306` means use port `3307`).

## Installation & Running


### Option 1: Docker Compose (Production-like)
This will start the Database, Backend, and Frontend in containers using the production build for frontend (Nginx).

```bash
docker-compose up --build
```

### Option 2: Docker Compose (Development Mode)
This enables **hot-reloading** for both frontend and backend. Changes to your code will instantly reflect in the app.

```bash
docker-compose -f docker-compose.dev.yml up --build
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Option 3: Manual Setup

#### 1. Database
Start the MySQL container:
```bash
docker-compose up -d mysql
```

#### 2. Backend
```bash
cd backend
npm install
npm run dev
```
*Ensure your `.env` points to the correct DB host/port.*

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting
- **Database Connection Error**: Ensure the MySQL container is running and the credentials in `.env` match `docker-compose.yml`.
- **Firebase Error**: Ensure your service account keys are correct and the private key is properly formatted (newlines).
