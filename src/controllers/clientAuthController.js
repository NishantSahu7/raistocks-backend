import jwt from "jsonwebtoken";
import  Client  from "../models/clientModel.js";

export const loginClient = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Create token (you can use sessions if preferred)
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      client,
      token,
    });
  } catch (error) {
    console.error("Error logging in client:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
