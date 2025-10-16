import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../models/UserModel.js";

// create new user
export const createUserController = async (req, res) => {
  try {
    const { name, email } = req.body;

    // validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    if (name.length > 100 || email.length > 100) {
      return res.status(400).json({ error: "Name or email too long" });
    }

    // check if email is valid
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // create user
    const user = await createUser({ name, email });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user: ", err);
    return res.status(500).json({ error: "server error" });
  }
};

// Get user by ID
export const getUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error getting user: ", err);
    return res.status(500).json({ error: "server error" });
  }
};
