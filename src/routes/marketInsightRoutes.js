import express from "express";
import {
  createMarketInsight,
  getAllMarketInsights,
  getMarketInsightById,
  updateMarketInsight,
  deleteMarketInsight,
} from "../controllers/marketInsightController.js";

const router = express.Router();

// CRUD routes
router.post("/", createMarketInsight); // Create
router.get("/", getAllMarketInsights); // Get all
router.get("/:id", getMarketInsightById); // Get one by ID
router.put("/:id", updateMarketInsight); // Update by ID
router.delete("/:id", deleteMarketInsight); // Delete by ID

export default router;
