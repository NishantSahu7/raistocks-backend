// controllers/supportController.js
import Support from "../models/supportModel.js";
import Client from "../models/clientModel.js"; // ✅ use Client model

// Utility: Generate Ticket ID like mock data (101, 102, ...)
let ticketCounter = 100;

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

    // Find user email from Client collection
    const clientUser = await Client.findById(userId);
    if (!clientUser) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newTicketId = await generateTicketId();

    const newTicket = await Support.create({
      ticketId: newTicketId,
      client: clientUser.name || client, // use clientUser.name if exists
      subject,
      category,
      opened,
      status,
      userId,
      email: clientUser.email,
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
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error fetching ticket" });
  }
};

// ✅ Update ticket (status, subject, etc.)
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Support.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
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
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error deleting ticket" });
  }
};

// ✅ Get email of client for a given ticket
export const getEmailByTicketId = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const clientUser = await Client.findById(ticket.userId);
    if (!clientUser) return res.status(404).json({ message: "Client not found" });

    res.status(200).json({ email: clientUser.email });
  } catch (error) {
    console.error("Error fetching client email:", error);
    res.status(500).json({ message: "Server error fetching client email" });
  }
};

// ✅ Mark ticket as resolved
export const markTicketResolved = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = "Resolved";
    await ticket.save();

    res.status(200).json({ message: "Ticket marked as resolved", ticket });
  } catch (error) {
    console.error("Error marking ticket resolved:", error);
    res.status(500).json({ message: "Server error marking ticket resolved" });
  }
};
