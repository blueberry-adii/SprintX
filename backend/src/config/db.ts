import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

export async function connectDB() {
  try {
    const conn = await db.getConnection();
    console.log("MySQL Connected 🎉");
    conn.release();
  } catch (err) {
    console.error("MySQL Connection Failed X....", err);
    process.exit(1);
  }
}

export const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255),
        pfp_url TEXT,
        academic_goals JSON DEFAULT JSON_ARRAY(),
        upcoming_exams JSON DEFAULT JSON_ARRAY(),
        recommendations JSON DEFAULT JSON_ARRAY(),
        settings_dark_mode TINYINT(1) DEFAULT 0,
        settings_color_theme ENUM('Ocean','Royal','Sky','Sunset') DEFAULT 'Ocean',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_uid (uid)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        deadline DATETIME,
        duration_mins INT DEFAULT 0,
        priority ENUM('Low','Medium','High','Urgent') DEFAULT 'Medium',
        category ENUM('Study','Health','Personal','Work','Other') DEFAULT 'Study',
        status ENUM('Pending','Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tasks_uid (uid),
        INDEX idx_tasks_deadline (deadline)
      );
    `);

    await db.query(`
        CREATE TABLE daily_routine (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(255) NOT NULL,
        log_date DATE NOT NULL,

        felt_today ENUM('Terrible','Bad','Okay','Good','Great') NOT NULL,

        study_hours DECIMAL(4,2) DEFAULT 0,
        screen_hours DECIMAL(4,2) DEFAULT 0,
        exercise_mins INT DEFAULT 0,

        wake_up_time TIME,
        sleep_time TIME,

        wellbeing_score TINYINT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY unique_user_day (uid, log_date),
        INDEX idx_user_date (uid, log_date)
      );
    `);

    console.log("Database tables ensured.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};
