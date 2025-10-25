// controllers/supportController.js
import Support from "../models/supportModel.js";
import Client from "../models/clientModel.js";
import { sendResolutionEmail } from "../utils/emailService.js";

// 🧮 Utility: Generate sequential Ticket IDs
let ticketCounter = 100;
const generateTicketId = async () => {
  const lastTicket = await Support.findOne().sort({ createdAt: -1 });
  return lastTicket
    ? (parseInt(lastTicket.ticketId) + 1).toString()
    : (++ticketCounter).toString();
};

// ✅ CREATE — New support ticket
export const createTicket = async (req, res) => {
  try {
    const { client, subject, category, opened, userId } = req.body;

    const clientUser = await Client.findById(userId);
    if (!clientUser) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newTicketId = await generateTicketId();

    const newTicket = await Support.create({
      ticketId: newTicketId,
      client: clientUser.name || client,
      subject,
      category,
      opened,
      status: "Pending", // 👈 Always start as "Pending"
      userId,
      email: clientUser.email,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("❌ Error creating ticket:", error);
    res.status(500).json({ message: "Server error creating ticket" });
  }
};

// ✅ READ — Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res.status(500).json({ message: "Server error fetching tickets" });
  }
};

// ✅ READ — Get single ticket
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("❌ Error fetching ticket:", error);
    res.status(500).json({ message: "Server error fetching ticket" });
  }
};

// ✅ UPDATE — Update ticket fields
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Support.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("❌ Error updating ticket:", error);
    res.status(500).json({ message: "Server error updating ticket" });
  }
};

// ✅ DELETE — Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Support.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting ticket:", error);
    res.status(500).json({ message: "Server error deleting ticket" });
  }
};

// ✅ READ — Get client's email by ticket ID
export const getEmailByTicketId = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const clientUser = await Client.findById(ticket.userId);
    if (!clientUser)
      return res.status(404).json({ message: "Client not found" });

    res.status(200).json({ email: clientUser.email });
  } catch (error) {
    console.error("❌ Error fetching client email:", error);
    res.status(500).json({ message: "Server error fetching client email" });
  }
};

// ✅ UPDATE — Mark ticket resolved & send resolution email
export const markTicketResolved = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const clientUser = await Client.findById(ticket.userId);
    if (!clientUser)
      return res.status(404).json({ message: "Client not found" });

    try {
      // 📧 Send resolution email
      await sendResolutionEmail(
        clientUser.email,
        ticket.subject,
        clientUser.name || ticket.client
      );

      // ✅ Update ticket status
      ticket.status = "Resolved";
      await ticket.save();

      res.status(200).json({
        message: "Ticket resolved and email sent successfully",
        ticket,
      });
    } catch (emailError) {
      console.error("❌ Email send failed:", emailError);
      return res.status(500).json({
        message: "Failed to send email, ticket not marked as resolved",
      });
    }
  } catch (error) {
    console.error("❌ Error resolving ticket:", error);
    res.status(500).json({
      message: "Failed to resolve ticket and send email",
    });
  }
};
