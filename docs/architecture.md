# Architecture Overview

A simple visual map of the main project directories and how they connect.

Frontend --> Backend --> Database
    \           ^
     \         /
      v       /
        Docs (guides, API reference, setup)

Diagram (simple):

```
+-----------------+     HTTP/API     +-----------------+     SQL/ORM      +---------------+
|    frontend     | ---------------> |    backend      | ---------------> |                |
| - UI / pages    |                  | - API endpoints |                  |   database     |
| - components    |                  | - controllers   |                  | -  MongoDB     |
| - client state  |                  | - services      |                  | - migrations   |
+-----------------+                  | - business logic|                  +---------------+
                                     +-----------------+
            \                                   ^
             \                                  |
              v                                 |
            +-----------------+                 |
            |      docs       |-----------------+
            | - README        |  (references for developers)
            | - architecture  |
            | - API docs      |
            +-----------------+
```

How it works (simple):
- User interacts with frontend (UI).  
- Frontend calls backend APIs (HTTP/REST or GraphQL).  
- Backend handles requests, runs business logic, and reads/writes the database.  
- Backend returns responses; frontend updates the UI.  
- Docs live alongside code to explain setup, architecture, and API usage for developers.


Typical directory responsibilities:
- frontend/: UI code, components, routes, assets, client-side state and API clients.  
- backend/: API routes, controllers, services, models, auth, config, tests.  
- docs/: architecture notes, setup guides, API references, contributor guides.

---

## Detailed Architecture

### Containerization
The application is fully containerized using Docker.
- **Frontend Container**: Serves the React app (Vite) via Nginx (production) or Vite Dev Server (development).
- **Backend Container**: Runs the Node.js/Express API.
- **Database Container**: Runs MySQL 8.0.

### Data Flow
1. **User Action**: User clicks "Add Task" on Frontend.
2. **API Request**: Frontend sends `POST /api/v1/tasks` with Firebase ID Token.
3. **Auth Middleware**: Backend verifies token with Firebase Admin SDK.
4. **Controller**: Validates input and calls Service/Model.
5. **Database**: Task is inserted into `tasks` table in MySQL.
6. **Response**: Backend returns the created task object.
7. **UI Update**: Frontend updates the task list state.

### External Services
- **Firebase Auth**: Handles user identity (Signup/Login).
- **Google Gemini**: Provides AI-powered study plans and recommendations.


