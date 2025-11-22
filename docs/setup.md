# Setup Guide

Follow these instructions to set up the project locally.

## Prerequisites

- **Docker Desktop** (or docker-cli compulsory)
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

## Installation & Running

### Step 1: Docker Compose Dev

This will start the Database, Backend, and Frontend in containers using the dev build for frontend (Nginx).

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Step 2: Open Browser on Localhost:5173

This enables **hot-reloading** for frontend. Changes to your code will instantly reflect in the app.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Troubleshooting

- **Database Connection Error**: Ensure the MySQL container is running and the credentials in `.env` match `docker-compose.dev.yml`.
- **Firebase Error**: Ensure your service account keys are correct and the private key is properly formatted (newlines).
- **AI Insights Error**: Ensure your Gemini API Key is Valid.
