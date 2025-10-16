import { pool } from "../config/db.js";

// create event
export const createEvent = async ({ title, datetime, location, capacity }) => {
  const query = `INSERT INTO events (title, datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *`;

  const values = [title, datetime, location, capacity];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// get event details with registered users
export const getEventById = async (id) => {
  const eventQuery = `SELECT * FROM events WHERE id = $1`;

  const { rows: eventRows } = await pool.query(eventQuery, [id]);

  if (!eventRows[0]) return null;

  const usersQuery = `
        SELECT u.id, u.name, u.email
        FROM users u
        JOIN registrations r ON u.id = r.user_id
        WHERE r.event_id = $1
    `;

  const { rows: usersRows } = await pool.query(usersQuery, [id]);
  return { ...eventRows[0], registrations: usersRows };
};

// register user for event
export const registerUserForEvent = async (eventId, userId) => {
  const query = `INSERt INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *`;

  const { rows } = await pool.query(query, [userId, eventId]);
  return rows[0];
};

// cancel registration
export const cancelRegistration = async (eventId, userId) => {
  const query = `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *`;

  const { rows } = await pool.query(query, [userId, eventId]);
  return rows[0];
};

// list all upcoming events
export const getUpcomingEvents = async () => {
  const query = `SELECT * FROM events WHERE datetime > NOW()`;

  const { rows } = await pool.query(query);
  return rows;
};

// get event stats
export const getEventStats = async (eventId) => {
  const eventQuery = `SELECT capacity FROM events WHERE id = $1`;

  const { rows: eventRows } = await pool.query(eventQuery, [eventId]);
  if (!eventRows[0]) return null;

  const capacity = eventRows[0].capacity;

  const countQuery = `SELECT COUNT(*) FROM registrations WHERE event_id = $1`;
  const { rows: countRows } = await pool.query(countQuery, [eventId]);
  const totalRegistrations = parseInt(countRows[0].count, 10);

  return {
    totalRegistrations,
    remainingCapacity: capacity - totalRegistrations,
    percentageUsed: ((totalRegistrations / capacity) * 100).toFixed(2),
  };
};
