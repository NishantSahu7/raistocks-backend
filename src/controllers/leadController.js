 import Lead from "../models/leadModel.js";

// ✅ Create a new lead
export const createLead = async (req, res) => {
  try {
    const { name, contact, source, status, email } = req.body;

    if (!name || !contact || !source) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lead = await Lead.create({
      name,
      contact,
      source,
      email,
      status: status || "New Lead",
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update lead (for “Action → Update”)
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, source, status , email } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { name, contact, source, status , email},
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single lead by ID
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Delete lead (if needed)
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
