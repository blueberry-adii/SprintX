# Database Schema

The application uses a relational MySQL database. Below is the schema definition.

## Tables

### `users`
Stores user profile information and application settings.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto-incrementing primary key |
| `uid` | VARCHAR(255) | Firebase User ID (Unique) |
| `email` | VARCHAR(255) | User email address |
| `full_name` | VARCHAR(255) | User's display name |
| `pfp_url` | TEXT | Profile picture URL |
| `academic_goals` | JSON | List of academic goals |
| `upcoming_exams` | JSON | List of upcoming exams |
| `recommendations` | JSON | AI or system recommendations |
| `settings_dark_mode` | TINYINT(1) | 1 for Dark Mode, 0 for Light Mode |
| `settings_color_theme` | ENUM | 'Ocean', 'Royal', 'Sky', 'Sunset' (Default: 'Ocean') |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### `tasks`
Stores individual tasks created by users.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto-incrementing primary key |
| `uid` | VARCHAR(255) | Foreign key to Firebase User ID |
| `title` | VARCHAR(255) | Task description |
| `deadline` | DATETIME | Due date and time |
| `duration_mins` | INT | Estimated duration in minutes |
| `priority` | ENUM | 'Low', 'Medium', 'High', 'Urgent' |
| `category` | ENUM | 'Study', 'Health', 'Personal', 'Work', 'Other' |
| `status` | ENUM | 'Pending', 'Completed' |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### `daily_routine`
Logs daily metrics for users.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto-incrementing primary key |
| `uid` | VARCHAR(255) | Foreign key to Firebase User ID |
| `log_date` | DATE | The date of the log |
| `felt_today` | ENUM | 'Terrible', 'Bad', 'Okay', 'Good', 'Great' |
| `study_hours` | DECIMAL(4,2) | Hours spent studying |
| `screen_hours` | DECIMAL(4,2) | Hours spent on screens |
| `exercise_mins` | INT | Minutes of exercise |
| `wake_up_time` | TIME | Time woke up |
| `sleep_time` | TIME | Time went to sleep |
| `wellbeing_score` | TINYINT | Calculated or user-input score |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Relationships
- **One-to-Many**: A `User` (identified by `uid`) can have multiple `Tasks`.
- **One-to-Many**: A `User` (identified by `uid`) can have multiple `DailyRoutine` entries.
- **Uniqueness**: `daily_routine` has a unique constraint on `(uid, log_date)` to ensure only one log per day per user.
