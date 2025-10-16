import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// create a connection pool
export const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,

  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  ssl: {
    rejectUnauthorized: false,
  },
});

export const testDB = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB connect: ", res.rows[0].now);
  } catch (err) {
    console.error("DB connection error: ", err);
  }
};
