import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ==================== REGISTER USER ====================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, subRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Restrict who can create admins
    let finalRole = "user";
    let finalSubRole = null;

    if (req.user && req.user.role === "admin") {
      // If an admin is creating the account
      finalRole = role || "user";
      finalSubRole = role === "admin" ? subRole || null : null;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      subRole: finalSubRole,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        subRole: user.subRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subRole: user.subRole,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== LOGIN USER ====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        subRole: user.subRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subRole: user.subRole,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== LOGOUT USER ====================
export const logoutUser = (req, res) => {
  // On frontend, just remove the JWT token from localStorage or cookies
  res.json({ message: "User logged out successfully" });
};

// ==================== GET ALL USERS ====================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
