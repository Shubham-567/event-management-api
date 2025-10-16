import express from "express";
import dotenv from "dotenv";
import { testDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json()); // to parse JSON requests

app.get("/api", (req, res) => {
  res.send("Event management API is running...");
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await testDB();
  console.log(`Server running on port ${PORT}`);
});
