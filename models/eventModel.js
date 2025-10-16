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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // lock the event row to prevent race conditions
    const { rows: eventRows } = await client.query(
      `SELECT capacity FROM events WHERE id=$1 FOR UPDATE`,
      [eventId]
    );

    if (!eventRows[0]) {
      throw new Error("Event not found");
    }

    const capacity = eventRows[0].capacity;

    // count current registrations
    const { rows: countRows } = await client.query(
      `SELECT COUNT(*) FROM registrations WHERE event_id=$1`,
      [eventId]
    );

    const totalRegistrations = parseInt(countRows[0].count, 10);

    if (totalRegistrations >= capacity) {
      throw new Error("Event is full");
    }

    // Insert registration
    const { rows } = await client.query(
      `INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *`,
      [userId, eventId]
    );

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// cancel registration
export const cancelRegistration = async (eventId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `DELETE FROM registrations WHERE event_id = $1 AND user_id = $2 RETURNING *`,
      [eventId, userId]
    );

    if (!rows[0]) {
      throw new Error("Registration not found");
    }

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
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
