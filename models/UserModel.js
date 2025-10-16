import { pool } from "../config/db.js";

export const createUser = async ({ name, email }) => {
  const query = `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`;
  const values = [name, email];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};
