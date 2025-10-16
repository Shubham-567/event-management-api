import express from "express";
import dotenv from "dotenv";
import { testDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json()); // to parse JSON requests

app.get("/", (req, res) => {
  res.send("Event management API is running...");
});

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await testDB();
  console.log(`Server running on port ${PORT}`);
});
