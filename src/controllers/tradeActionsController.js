// controllers/tradeAction.controller.ts
import Trade from "../models/tradeModel.js";
import TradeAction from "../models/tradeActionsModel.js";

export const addTradeAction = async (req, res) => {
  try {
    const { tradeId, type, title, price, comment } = req.body;

    // Check if trade exists
    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    const action = await TradeAction.create({
      tradeId,
      type,
      title,
      price,
      comment,
    });

    res.status(201).json({ message: "Action added successfully", action });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding action", error });
  }
};

export const getTradeActions = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const actions = await TradeAction.find({ tradeId }).sort({ createdAt: -1 });
    res.status(200).json(actions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching actions", error });
  }
};
