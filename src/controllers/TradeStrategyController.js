import TradeStrategy from "../models/tradeStrategyModel.js";
const createNotification = async ({ title, message, type, userId = null, tradeId = null }) => {
  // Save in DB
  await Notification.create({ title, message, type, userId });

  // Emit via Socket.io for online users
  sendNotificationToAll({ title, message, type, tradeId });
};

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
    await createNotification({
  title: "New TradeStrategy Created",
  message: `A new MarketInsight (${req.title}) has been added.`,
  type: "TradeStrategy_created",
  // tradeId: trade._id,
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
