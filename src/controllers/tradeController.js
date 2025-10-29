import Trade from "../models/tradeModel.js";

// Create a new trade
export const createTrade = async (req, res) => {
  try {
    const trade = new Trade(req.body);
    await trade.save();
    res
      .status(201)
      .json({ success: true, message: "Trade added successfully", trade });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


 // ✅ Get all trades including actions
export const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.aggregate([
      {
        $lookup: {
          from: "tradeactions",  // MongoDB auto pluralizes collection names
          localField: "_id",
          foreignField: "tradeId",
          as: "actions",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Trades fetched successfully",
      trades,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get single trade by ID
export const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade)
      return res
        .status(404)
        .json({ success: false, message: "Trade not found" });
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update trade
export const updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!trade)
      return res
        .status(404)
        .json({ success: false, message: "Trade not found" });
    res
      .status(200)
      .json({ success: true, message: "Trade updated successfully", trade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Update trade status  
export const updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log('Updating trade status:', { tradeId: req.params.id, newStatus: status });
    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!trade)
      return res
        .status(404)
        .json({ success: false, message: "Trade not found" });
    res.status(200).json({ success: true, message: "Trade status updated", trade });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Delete trade
export const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);
    if (!trade)
      return res
        .status(404)
        .json({ success: false, message: "Trade not found" });
    res
      .status(200)
      .json({ success: true, message: "Trade deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
