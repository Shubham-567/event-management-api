import express from "express";

import {
  cancelRegistrationController,
  createEventController,
  getEventController,
  getEventStatsController,
  listLUpcomingEventsController,
  registerUserController,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEventController);
router.get("/:id", getEventController);

router.post("/:id/register", registerUserController);
router.delete("/:id/register/:userId", cancelRegistrationController);

router.get("/upcoming/list", listLUpcomingEventsController);
router.get("/:id/stats", getEventStatsController);

export default router;
