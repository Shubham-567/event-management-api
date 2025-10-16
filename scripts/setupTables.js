import { pool } from "../config/db.js";

const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        datetime TIMESTAMP NOT NULL,
        location VARCHAR(255) NOT NULL,
        capacity INT CHECK (capacity > 0 AND capacity <= 1000)
    );

    CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        event_id INT REFERENCES events(id) ON DELETE CASCADE,
        UNIQUE (user_id, event_id) 
    );`;

const setupTables = async () => {
  try {
    await pool.query(query);
    console.log("Tables created successfully");
    process.exit();
  } catch (err) {
    console.error("Error creating tables", err);
    process.exit(1);
  }
};

setupTables();


