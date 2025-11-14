import jwt from "jsonwebtoken";
import Client from "../models/clientModel.js";
import { sendLoginOtpEmail } from "../utils/emailService.js";
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


/**
 * VERIFY OTP AND LOGIN
 * ---------------------------------------------------
 * Checks the OTP, logs in user by setting JWT cookie
 */
export const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email & OTP are required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Validate OTP
    if (client.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (client.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Clear OTP after successful login
    client.otp = undefined;
    client.otpExpiry = undefined;
    await client.save();

    // Generate JWT
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      client,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SEND LOGIN OTP
 * ---------------------------------------------------
 */
export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let client = await Client.findOne({ email });

    // If client not exists, auto-create
    if (!client) {
      client = await Client.create({ email });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry (10 minutes)
    client.otp = otp;
    client.otpExpiry = Date.now() + 10 * 60 * 1000;
    await client.save();

    // Send Email via Resend
    await sendLoginOtpEmail(email, client.name, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

