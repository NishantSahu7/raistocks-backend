// controllers/supportController.js
import Support from "../models/supportModel.js";
import Client from "../models/clientModel.js";
import { sendResolutionEmail , sendReplyEmail,sendTicketCreationEmail } from "../utils/emailService.js";
import { response } from "express";
import User from "../models/userModel.js";

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

    // 🧩 Validate client
    const clientUser = await Client.findById(userId);
    if (!clientUser) {
      return res.status(404).json({ message: "Client not found" });
    }

    // 🧮 Generate sequential ticket ID
    const newTicketId = await generateTicketId();

    // 📝 Create new ticket in DB
    const newTicket = await Support.create({
      ticketId: newTicketId,
      client: clientUser.name || client,
      subject,
      category,
      opened,
      status: "Pending", // Default initial status
      userId, // Admin or client ID (depends on your logic)
      email: clientUser.email,
    });

    // 📧 Send confirmation email (non-blocking, won’t stop API if email fails)
    try {
      await sendTicketCreationEmail(
        clientUser.email,
        clientUser.name || client,
        subject,
        newTicketId
      );
      console.log("✅ Ticket creation email sent to:", clientUser.email);
    } catch (emailError) {
      console.error("❌ Failed to send ticket creation email:", emailError);
      // Note: We don’t return an error here so ticket still gets created
    }

    // ✅ Respond to frontend
    res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
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

 // ✅ Add a reply to a support ticket
// export const addTicketReply = async (req, res) => {
//   try {
//     const { message, senderId } = req.body;

//     if (!message || !senderId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const ticket = await Support.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ message: "Ticket not found" });

//     // Add the reply
//     ticket.replies.push({ message, senderId });
//     await ticket.save();

//     res.status(200).json({
//       message: "Reply added successfully",
//       replies: ticket.replies,
//     });
//   } catch (error) {
//     console.error("❌ Error adding reply:", error);
//     res.status(500).json({ message: "Server error adding reply" });
//   }
// };


export const addTicketReply = async (req, res) => {
  console.log(req.body);
  try {
    const { message, senderId } = req.body;

    if (!message || !senderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const clientUser = await Client.findById(ticket.userId);
    if (!clientUser) return res.status(404).json({ message: "Client not found" });

    // ✅ Fetch sender's name from User model
    const sender = await User.findById(senderId).select("name");
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    // Add reply with both senderId and name
    ticket.replies.push({ message, senderId, name: sender.name });
    await ticket.save();

    try {
      await sendReplyEmail(
        clientUser.email,
        ticket.subject,
        clientUser.name || ticket.client,
        message
      );
    } catch (emailError) {
      console.error("❌ Error sending reply email:", emailError);
      return res.status(500).json({
        message: "Reply added, but failed to send email",
        replies: ticket.replies,
      });
    }

    res.status(200).json({
      message: "Reply added and email sent successfully",
      replies: ticket.replies,
    });
  } catch (error) {
    console.error("❌ Error adding reply:", error);
    res.status(500).json({ message: "Server error adding reply" });
  }
};



// ✅ Get all replies for a ticket thread
export const getTicketReplies = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id)
      .populate("replies.senderId", "name email"); // optional populate for details
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json(ticket.replies);
  } catch (error) {
    console.error("❌ Error fetching replies:", error);
    res.status(500).json({ message: "Server error fetching replies" });
  }
};

