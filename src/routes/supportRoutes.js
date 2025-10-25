// routes/supportRoutes.js
import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getEmailByTicketId,
  markTicketResolved,
} from "../controllers/supportController.js";


const router = express.Router();

// ✅ Create a new support ticket
router.post("/", createTicket);

// ✅ Get all support tickets
router.get("/", getAllTickets);

// ✅ Get a specific ticket by ID
router.get("/:id", getTicketById);

// ✅ Update ticket details (status, subject, etc.)
router.put("/:id", updateTicket);

// ✅ Delete a ticket
router.delete("/:id", deleteTicket);

// ✅ Get the email of the user for a given ticket (for email button click)
router.get("/:id/email", getEmailByTicketId);

// ✅ Mark ticket as resolved (after sending email)
router.put("/:id/resolve", markTicketResolved);

export default router;
