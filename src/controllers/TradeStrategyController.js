import TradeStrategy from "../models/tradeStrategyModel.js";

// ✅ Create a new Trade Strategy
export const createTradeStrategy = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const tradeStrategy = await TradeStrategy.create({
      title,
      description,
      date: date || Date.now(),
      createdBy: req.user ? req.user._id : null, // if using auth
    });

    res.status(201).json({
      message: "Trade Strategy created successfully",
      tradeStrategy,
    });
  } catch (error) {
    console.error("Create Trend Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all Trade Strategies
export const getTradeStrategys = async (req, res) => {
  try {
    const tradeStrategies = await TradeStrategy.find().sort({ date: -1 });
    res.json(tradeStrategies);
  } catch (error) {
    console.error("Get Trade Strategies Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a single Trade Strategy by ID
export const getTradeStrategyById = async (req, res) => {
  try {
    const tradeStrategy = await TradeStrategy.findById(req.params.id);
    if (!tradeStrategy) {
      return res.status(404).json({ message: "Trade Strategy not found" });
    }
    res.json(tradeStrategy);
  } catch (error) {
    console.error("Get Trade Strategy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
