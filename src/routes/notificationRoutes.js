import express from "express";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getNotifications); // ?userId=123
router.patch("/:id/read", markAsRead);

export default router;
