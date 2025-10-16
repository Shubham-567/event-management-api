import express from "express";
import {
  createUserController,
  getUserController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUserController);
router.get("/:id", getUserController);

export default router;
