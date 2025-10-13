import CRM from "../models/crmModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

/* ======================================================
   ✅ Register (Sign-up) CRM User
====================================================== */
export const createCRM = async (req, res) => {
  try {
    const { name, email, role, password, confirmPassword, status } = req.body;

    if (!name || !email || !role || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await CRM.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "CRM user already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const crmUser = await CRM.create({
      name,
      email,
      role,
      password: hashedPassword,
      status: status || "Active",
    });

    const token = generateToken(crmUser._id);

    res.status(201).json({
      success: true,
      message: "CRM user registered successfully",
      token,
      data: {
        id: crmUser._id,
        name: crmUser.name,
        email: crmUser.email,
        role: crmUser.role,
        status: crmUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   ✅ Login CRM User
====================================================== */
export const loginCRM = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await CRM.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   ✅ Get All CRM Users
====================================================== */
export const getAllCRM = async (req, res) => {
  try {
    const users = await CRM.find().select("-password"); // exclude passwords
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   ✅ Get CRM User by ID
====================================================== */
export const getCRMById = async (req, res) => {
  try {
    const user = await CRM.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   ✅ Update CRM User
====================================================== */
export const updateCRM = async (req, res) => {
  try {
    const { name, email, role, password, status } = req.body;

    const user = await CRM.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "CRM user updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   ✅ Delete CRM User
====================================================== */
export const deleteCRM = async (req, res) => {
  try {
    const user = await CRM.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "CRM user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
