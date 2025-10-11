import CRM from "../models/crmModel.js";

// ✅ Create CRM User
export const createCRM = async (req, res) => {
  try {
    const { name, email, role, password, confirmPassword, status } = req.body;

    if (!name || !email || !role || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await CRM.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "CRM user already exists" });
    }

    const crmUser = await CRM.create({
      name,
      email,
      role,
      password,
      confirmPassword,
      status: status || "Active", // Default to Active if not provided
    });

    res.status(201).json({
      success: true,
      message: "CRM user created successfully",
      data: crmUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all CRM users
export const getAllCRM = async (req, res) => {
  try {
    const crmUsers = await CRM.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: crmUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single CRM user by ID
export const getCRMById = async (req, res) => {
  try {
    const { id } = req.params;
    const crmUser = await CRM.findById(id);

    if (!crmUser) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    res.status(200).json({ success: true, data: crmUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
// ✅ Update CRM user (allow partial updates)
export const updateCRM = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password, confirmPassword, status } = req.body;

    // Only include fields that are actually sent
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (status) updateFields.status = status;
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      updateFields.password = password;
      updateFields.confirmPassword = confirmPassword;
    }

    const updatedCRM = await CRM.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCRM) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    res.status(200).json({
      success: true,
      message: "CRM user updated successfully",
      data: updatedCRM,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Delete CRM user
export const deleteCRM = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCRM = await CRM.findByIdAndDelete(id);

    if (!deletedCRM) {
      return res.status(404).json({ message: "CRM user not found" });
    }

    res.status(200).json({
      success: true,
      message: "CRM user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
