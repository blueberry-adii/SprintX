# API Design

The backend exposes a RESTful API. All protected routes require a valid Firebase ID token in the `Authorization` header (Bearer token).

## Base URL

`/api/v1`

## Authentication (`/auth`)

| Method | Endpoint    | Protected | Description                                                  |
| :----- | :---------- | :-------- | :----------------------------------------------------------- |
| POST   | `/register` | Yes       | Register a new user in the database (after Firebase signup). |
| POST   | `/login`    | Yes       | Sync user login state.                                       |
| GET    | `/me`       | Yes       | Get current user profile.                                    |
| PUT    | `/profile`  | Yes       | Update user profile details.                                 |

## Dashboard (`/dashboard`)

| Method | Endpoint | Protected | Description                                                     |
| :----- | :------- | :-------- | :-------------------------------------------------------------- |
| GET    | `/`      | Yes       | Get aggregated dashboard data (weekly summary, upcoming tasks). |

## Tasks (`/tasks`)

| Method | Endpoint          | Protected | Description                 |
| :----- | :---------------- | :-------- | :-------------------------- |
| GET    | `/`               | Yes       | Get all tasks for the user. |
| POST   | `/`               | Yes       | Create a new task.          |
| PUT    | `/:id`            | Yes       | Edit an existing task.      |
| PATCH  | `/:id/complete`   | Yes       | Mark a task as completed.   |
| PATCH  | `/:id/uncomplete` | Yes       | Mark a task as pending.     |
| DELETE | `/:id`            | Yes       | Delete a task.              |

## Routines (`/routines`)

| Method | Endpoint | Protected | Description                                 |
| :----- | :------- | :-------- | :------------------------------------------ |
| GET    | `/`      | Yes       | Get routine logs (supports date filtering). |
| POST   | `/`      | Yes       | Log a new daily routine.                    |

## Insights (`/insights`)

| Method | Endpoint | Protected | Description                               |
| :----- | :------- | :-------- | :---------------------------------------- |
| GET    | `/`      | Yes       | Get productivity insights and chart data. |

## Settings (`/settings`)

| Method | Endpoint | Protected | Description                         |
| :----- | :------- | :-------- | :---------------------------------- |
| PUT    | `/theme` | Yes       | Update application theme/dark mode. |

## Error Handling

Standard HTTP status codes are used:

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized (Invalid/Missing Token)
- `404`: Not Found
- `500`: Internal Server Error
