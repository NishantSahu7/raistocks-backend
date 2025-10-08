import express from "express";
import {
  createMarketPhase,
  getMarketPhases,
  getMarketPhaseById,
} from "../controllers/marketPhaseController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional if you want auth

const router = express.Router();

// Public routes
router.get("/", getMarketPhases);
router.get("/:id", getMarketPhaseById);

// Protected route (optional)
router.post("/", createMarketPhase); // add 'protect' if you want auth: router.post("/", protect, createMarketPhase);

export default router;
