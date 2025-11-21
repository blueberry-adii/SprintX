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