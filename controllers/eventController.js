import {
  cancelRegistration,
  createEvent,
  getEventById,
  getEventStats,
  getUpcomingEvents,
  registerUserForEvent,
} from "../models/eventModel.js";
import { getUserById } from "../models/UserModel.js";

// create event
export const createEventController = async (req, res) => {
  try {
    const { title, datetime, location, capacity } = req.body;

    if (!title || !datetime || !location || !capacity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (capacity <= 0 || capacity > 1000) {
      return res
        .status(400)
        .json({ error: "Capacity must be between 1 and 1000" });
    }

    const event = await createEvent({ title, datetime, location, capacity });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
};

// get event details
export const getEventController = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (err) {
    console.error("Error getting event: ", err);
    return res.status(500).json({ error: "server error" });
  }
};

// register user
export const registerUserController = async (req, res) => {
  try {
    req.body = req.body ? req.body : {};

    const { id } = req.params; // event id from url
    const { userId } = req.body; // user id from request body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventDate = new Date(event.datetime);
    if (eventDate < new Date()) {
      return res.status(400).json({ error: "Cannot register for past event" });
    }

    if (event.registrations.find((r) => r.id === userId)) {
      return res.status(409).json({ error: "User is already registered" });
    }

    if (event.registrations.length >= event.capacity) {
      return res.status(400).json({ error: "Event is full" });
    }

    await registerUserForEvent(id, userId);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user: ", err);
    return res.status(500).json({ error: "server error" });
  }
};

// cancel registration
export const cancelRegistrationController = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!event.registrations.find((r) => r.id == userId)) {
      return res
        .status(400)
        .json({ error: "User is not registered for this event" });
    }

    await cancelRegistration(id, userId);
    return res
      .status(200)
      .json({ message: "Registration canceled successfully" });
  } catch (err) {
    console.error("Error canceling registration: ", err);
    return res.status(500).json({ error: "server error" });
  }
};

// list all  upcoming events
export const listLUpcomingEventsController = async (req, res) => {
  try {
    let events = await getUpcomingEvents();

    if (!events) {
      return res.status(404).json({ error: "No upcoming events found" });
    }

    // sort events
    events.sort((a, b) => {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return a.location.localCompare(b.location);
    });

    return res.status(200).json({ events });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
};

// get event stats
export const getEventStatsController = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await getEventStats(id);

    if (!stats) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json({ stats });
  } catch (err) {
    console.error("Error getting event stats: ", err);
    return res.status(500).json({ error: "server error" });
  }
};
