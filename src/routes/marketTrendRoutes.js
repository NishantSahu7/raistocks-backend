import express from "express";
import {
  createMarketTrend,
  getMarketTrends,
  getMarketTrendById,
} from "../controllers/marketTrendController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional if you want auth

const router = express.Router();

// I will add the middleware to protect the routes if needed
// Public routes
router.get("/", getMarketTrends);
router.get("/:id", getMarketTrendById);

// Protected route (optional)
router.post("/", createMarketTrend); // add 'protect' if you want auth: router.post("/", protect, createMarketTrend);

export default router;
