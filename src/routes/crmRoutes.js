import express from "express";
import {
  createCRM,
  getAllCRM,
  getCRMById,
  updateCRM,
  deleteCRM,
} from "../controllers/crmusersController.js";
import { protect } from "../middleware/authMiddleware.js"; // optional

const router = express.Router();

// ✅ Admin-only CRM routes
router.route("/")
  .post(protect, createCRM) // Create CRM user
  .get(protect, getAllCRM); // Get all CRM users

router.route("/:id")
  .get(protect, getCRMById) // Get single user
  .put(protect, updateCRM)  // Update
  .delete(protect, deleteCRM); // Delete

export default router;
