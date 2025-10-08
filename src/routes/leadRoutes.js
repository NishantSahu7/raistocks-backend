import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js"; // Optional if you want auth

const router = express.Router();

// ✅ All routes are protected for admin
// for admin routes are protected for now.. 
// let me know which are needed to be protected
router.route("/")
  .post(protect, createLead)   // Add new lead
  .get(protect, getLeads);     // Get all leads

router.route("/:id")
  .put(protect, updateLead)    // Update lead
  .delete(protect, deleteLead); // Delete lead

export default router;
