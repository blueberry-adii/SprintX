import mysql from "mysql2/promise";

export let db = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

export async function connectDB() {
  try {
    db = mysql.createPool({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    });
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
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        pfp_url TEXT,
        academic_goals JSON,
        upcoming_exams JSON,
        recommendations JSON,
        settings_dark_mode TINYINT(1) DEFAULT 0,
        settings_color_theme ENUM('Ocean','Royal','Sky','Sunset') DEFAULT 'Ocean',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_uid (uid)
      );
    `);

    try {
      await db.query(`ALTER TABLE users ADD COLUMN email VARCHAR(255) NOT NULL AFTER uid`);
      console.log("Added email column to users table");
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        console.log("Email column already exists or error adding it:", err.message);
      }
    }

    // Ensure settings_color_theme column exists and has correct default
    try {
      await db.query(`ALTER TABLE users MODIFY COLUMN settings_color_theme ENUM('Ocean','Royal','Sky','Sunset') DEFAULT 'Ocean'`);
    } catch (err: any) {
      console.log("Error modifying settings_color_theme column:", err.message);
    }

    // Migration: Set default theme for existing users who might have NULL or invalid theme
    await db.query(`UPDATE users SET settings_color_theme = 'Ocean' WHERE settings_color_theme IS NULL OR settings_color_theme = ''`);
    console.log("Ensured default theme 'Ocean' for all users.");

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
        CREATE TABLE IF NOT EXISTS daily_routine (
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
