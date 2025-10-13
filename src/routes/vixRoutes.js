import express from "express";
import {
  createVix,
  getVixEntries,
  getVixById,
  updateVix,
  deleteVix,
} from "../controllers/vixController.js";

const router = express.Router();

// Routes
router.post("/", createVix);          // Create new VIX entry
router.get("/", getVixEntries);       // Get all VIX entries
router.get("/:id", getVixById);       // Get a specific VIX entry
router.put("/:id", updateVix);        // Update VIX entry
router.delete("/:id", deleteVix);     // Delete VIX entry

export default router;
