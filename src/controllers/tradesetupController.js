// controllers/tradeSetupController.js
import TradeSetup from "../models/tradesetupModel.js";

// === Create TradeSetup ===
export const createTradeSetup = async (req, res) => {
  try {
    const { title, comment, modelType, modelRef } = req.body;

    if (!title || !modelType || !modelRef) {
      return res.status(400).json({ message: "Title, modelType and modelRef are required" });
    }

    const tradeSetup = await TradeSetup.create({
      title,
      comment,
      modelType,
      modelRef,
    });

    res.status(201).json({ success: true, data: tradeSetup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Get All TradeSetups (with populated models) ===
export const getAllTradeSetups = async (req, res) => {
  try {
    const tradeSetups = await TradeSetup.find()
      .populate("modelRef")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tradeSetups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Get Single TradeSetup ===
export const getTradeSetupById = async (req, res) => {
  try {
    const tradeSetup = await TradeSetup.findById(req.params.id).populate("modelRef");

    if (!tradeSetup) {
      return res.status(404).json({ success: false, message: "TradeSetup not found" });
    }

    res.status(200).json({ success: true, data: tradeSetup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Delete TradeSetup ===
export const deleteTradeSetup = async (req, res) => {
  try {
    const tradeSetup = await TradeSetup.findByIdAndDelete(req.params.id);

    if (!tradeSetup) {
      return res.status(404).json({ success: false, message: "TradeSetup not found" });
    }

    res.status(200).json({ success: true, message: "TradeSetup deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
