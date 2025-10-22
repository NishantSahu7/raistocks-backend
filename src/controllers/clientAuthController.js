import jwt from "jsonwebtoken";
import Client from "../models/clientModel.js";

/**
 * LOGIN CLIENT
 * ---------------------------------------------------
 * Authenticates the client by email and sets a secure
 * JWT token in an HTTP-only cookie.
 */
export const loginClient = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find client in database
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Store token securely in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access via JS
      secure: process.env.NODE_ENV === "production", // Only HTTPS in production
      sameSite: "strict", // Protect from CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      client,
    });
  } catch (error) {
    console.error("Error logging in client:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * LOGOUT CLIENT
 * ---------------------------------------------------
 * Clears the authentication cookie, effectively
 * logging the user out.
 */
export const logoutClient = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful — cookie cleared.",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
