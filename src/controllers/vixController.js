import Vix from "../models/vixModel.js";

// ✅ Create a new VIX entry
export const createVix = async (req, res) => {
  try {
    const { vixValue } = req.body;

    if (!vixValue) {
      return res.status(400).json({ message: "vixValue is required" });
    }

    const newVix = await Vix.create({ vixValue });
    res.status(201).json(newVix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all VIX entries
export const getVixEntries = async (req, res) => {
  try {
    const vixEntries = await Vix.find().sort({ createdAt: -1 });
    res.status(200).json(vixEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a single VIX entry by ID
export const getVixById = async (req, res) => {
  try {
    const vix = await Vix.findById(req.params.id);
    if (!vix) {
      return res.status(404).json({ message: "VIX entry not found" });
    }
    res.status(200).json(vix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a VIX entry
export const updateVix = async (req, res) => {
  try {
    const updatedVix = await Vix.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedVix) {
      return res.status(404).json({ message: "VIX entry not found" });
    }
    res.status(200).json(updatedVix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a VIX entry
export const deleteVix = async (req, res) => {
  try {
    const deleted = await Vix.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "VIX entry not found" });
    }
    res.status(200).json({ message: "VIX entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
