import MarketInsight from "../models/marketInsightModel.js";

// Create a new Market Insight
export const createMarketInsight = async (req, res) => {
  try {
    const marketInsight = await MarketInsight.create(req.body);
    res.status(201).json({ success: true, data: marketInsight });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Market Insights
export const getAllMarketInsights = async (req, res) => {
  try {
    const insights = await MarketInsight.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Market Insight by ID
export const getMarketInsightById = async (req, res) => {
  try {
    const insight = await MarketInsight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ success: false, message: "Market Insight not found" });
    }
    res.status(200).json({ success: true, data: insight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a Market Insight by ID
export const updateMarketInsight = async (req, res) => {
  try {
    const insight = await MarketInsight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!insight) {
      return res.status(404).json({ success: false, message: "Market Insight not found" });
    }
    res.status(200).json({ success: true, data: insight });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a Market Insight by ID
export const deleteMarketInsight = async (req, res) => {
  try {
    const insight = await MarketInsight.findByIdAndDelete(req.params.id);
    if (!insight) {
      return res.status(404).json({ success: false, message: "Market Insight not found" });
    }
    res.status(200).json({ success: true, message: "Market Insight deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
