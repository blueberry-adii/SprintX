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

