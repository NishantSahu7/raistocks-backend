 import express from "express";
import {
  createMarketTrend,
  getMarketTrends,
  getMarketTrendById,
  updateMarketTrend,
  deleteMarketTrend,
} from "../controllers/marketTrendController.js";
// import { protect } from "../middleware/authMiddleware.js"; // Add if authentication required

const router = express.Router();

// ✅ Public routes
router.get("/", getMarketTrends);        // Get all trends
router.get("/:id", getMarketTrendById);  // Get single trend by ID

// ✅ Create new trend (with optional auth)
// router.post("/", protect, createMarketTrend);
router.post("/", createMarketTrend);

// ✅ Update a trend by ID
router.put("/:id", updateMarketTrend);

// ✅ Delete a trend by ID
router.delete("/:id", deleteMarketTrend);

export default router;
