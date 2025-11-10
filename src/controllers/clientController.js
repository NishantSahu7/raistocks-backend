// controllers/clientController.js
import Client from "../models/clientModel.js";

// ✅ Create new clien
 
export const createClient = async (req, res) => {
  console.log("Creating client with data:", req.body);
  try {
    const {
      name,
      email,
      subscription,
      planType,
      duration = 0,
      kyc,
      status,
      amount = 0,
    } = req.body;

    // 🧠 Auto calculate daysLeft based on planType
    let daysLeft = 0;

    if (planType === "Trial") {
      const extractedDays = parseInt(duration.match(/\d+/)?.[0] || "14", 10);
      daysLeft = extractedDays;
    } else if (planType === "Monthly") {
      daysLeft = 30;
    } else if (planType === "Quarterly") {
      daysLeft = 90;
    } else if (planType === "Yearly") {
      daysLeft = 365;
    }

    // ✅ Save client with amount
    const client = await Client.create({
      name,
      email,
      subscription,
      planType,
      duration,
      daysLeft,
      kyc,
      status,
      amount, // 💰 include here
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single client
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ clientId: req.params.clientId });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update client
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
