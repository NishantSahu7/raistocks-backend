// controllers/supportController.js
import Support from "../models/supportModel.js";
import CRM from "../models/crmModel.js";

// ✅ Utility: Generate Ticket ID like mock data (e.g., 101, 102, etc.)
let ticketCounter = 100; // You can persist this if needed

const generateTicketId = async () => {
  const lastTicket = await Support.findOne().sort({ createdAt: -1 });
  if (lastTicket) {
    const lastId = parseInt(lastTicket.ticketId);
    return (lastId + 1).toString();
  } else {
    return (++ticketCounter).toString();
  }
};

// ✅ Create a new support ticket
export const createTicket = async (req, res) => {
  try {
    const { client, subject, category, opened, status, userId } = req.body;

    // Find user email from CRM collection
    const crmUser = await CRM.findById(userId);
    if (!crmUser) {
      return res.status(404).json({ message: "User not found in CRM" });
    }

    const newTicketId = await generateTicketId();

    const newTicket = await Support.create({
      ticketId: newTicketId,
      client,
      subject,
      category,
      opened,
      status,
      userId,
      email: crmUser.email, // ✅ Store user email from CRM
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error creating ticket" });
  }
};

// ✅ Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error fetching tickets" });
  }
};

// ✅ Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error fetching ticket" });
  }
};

// ✅ Update ticket (e.g., change status or subject)
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Support.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Server error updating ticket" });
  }
};

// ✅ Delete a ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Support.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error deleting ticket" });
  }
};

// ✅ Get email of CRM user for a given ticket
export const getEmailByTicketId = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Use stored email or refetch if needed
    const crmUser = await CRM.findById(ticket.userId);
    if (!crmUser) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    res.status(200).json({ email: crmUser.email });
  } catch (error) {
    console.error("Error fetching user email:", error);
    res.status(500).json({ message: "Server error fetching user email" });
  }
};

// ✅ Mark ticket as resolved (after sending email)
export const markTicketResolved = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = "Resolved";
    await ticket.save();

    res.status(200).json({ message: "Ticket marked as resolved", ticket });
  } catch (error) {
    console.error("Error marking ticket resolved:", error);
    res.status(500).json({ message: "Server error marking ticket resolved" });
  }
};
