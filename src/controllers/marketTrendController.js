import MarketTrend from "../models/marketTrendModel.js";

// ✅ Create a new market trend
export const createMarketTrend = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const trend = await MarketTrend.create({
      title,
      description,
      date: date || Date.now(),
      createdBy: req.user ? req.user._id : null, // if using auth
    });

    res.status(201).json({
      message: "Market trend created successfully",
      trend,
    });
  } catch (error) {
    console.error("Create Trend Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all market trends
export const getMarketTrends = async (req, res) => {
  try {
    const trends = await MarketTrend.find().sort({ date: -1 });
    res.json(trends);
  } catch (error) {
    console.error("Get Trends Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a single market trend by ID
export const getMarketTrendById = async (req, res) => {
  try {
    const trend = await MarketTrend.findById(req.params.id);
    if (!trend) {
      return res.status(404).json({ message: "Market trend not found" });
    }
    res.json(trend);
  } catch (error) {
    console.error("Get Trend Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
