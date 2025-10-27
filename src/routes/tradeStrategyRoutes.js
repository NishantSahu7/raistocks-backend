import express from "express";
import {
  createTradeStrategy,
  getTradeStrategys,
  getTradeStrategyById,
} from "../controllers/TradeStrategyController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional if you want auth

const router = express.Router();

// Public routes
router.get("/", getTradeStrategys);
router.get("/:id", getTradeStrategyById);

// Protected route (optional)
router.post("/", createTradeStrategy); // add 'protect' if you want auth: router.post("/", protect, createTradeStrategy);

export default router;
