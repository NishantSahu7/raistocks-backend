import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadById
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js"; // Optional if you want auth

const router = express.Router();

// ✅ All routes are protected for admin
// for admin routes are protected for now.. 
// let me know which are needed to be protected
router.route("/")
  .post(createLead)   // Add new lead
  .get(getLeads);     // Get all leads

router.route("/:id")
  .get(getLeadById)   // ✅ Get single lead by ID
  .patch(updateLead)    // Update lead
  .delete(deleteLead); // Delete lead

export default router;
