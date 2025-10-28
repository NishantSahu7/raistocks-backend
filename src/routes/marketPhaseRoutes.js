 import express from "express";
import {
  createMarketPhase,
  getMarketPhases,
  getMarketPhaseById,
  updateMarketPhase,
  deleteMarketPhase,
} from "../controllers/marketPhaseController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional if auth enabled

const router = express.Router();

// ✅ Get all
router.get("/", getMarketPhases);

// ✅ Get one by ID
router.get("/:id", getMarketPhaseById);

// ✅ Create (add protect if you want authentication)
// router.post("/", protect, createMarketPhase);
router.post("/", createMarketPhase);

// ✅ Update by ID
router.put("/:id", updateMarketPhase);

// ✅ Delete by ID
router.delete("/:id", deleteMarketPhase);

export default router;
