import TradeDiary from "../models/tradeDiaryModel.js";

// @desc    Create a new trade diary entry
// @route   POST /api/v1/trade-diary
// @access  Private (assumed)
export const createTrade = async (req, res) => {
  try {
    // When protection is off, crmUser ID must be sent in the request body
    // req.body.crmUser = req.user.id;

    const newTrade = await TradeDiary.create(req.body);
    console.log("req body",req.body)
    res.status(201).json({
      status: "success",
      data: {
        trade: newTrade,
      },
    });
     
    console.log("new trade ",newTrade)
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// @desc    Get all trade diary entries for a specific user
// @route   GET /api/v1/trade-diary/user/:userId
// @access  Public
export const getTradesForUser = async (req, res) => {
  try {
    const trades = await TradeDiary.find({ crmUser: req.params.userId });
    res.status(200).json({
      status: "success",
      results: trades.length,
      data: {
        trades,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Trades not found" });
  }
};

// @desc    Get a single trade diary entry by ID
// @route   GET /api/v1/trade-diary/:id
// @access  Public
export const getTradeById = async (req, res) => {
  try {
    const trade = await TradeDiary.findById(req.params.id);

    if (!trade) {
      return res
        .status(404)
        .json({ status: "fail", message: "Trade not found" });
    }

    // Ensure the user owns the trade
    // if (trade.crmUser.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     status: "fail",
    //     message: "User not authorized to view this trade",
    //   });
    // }

    res.status(200).json({ status: "success", data: { trade } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// @desc    Update a trade diary entry
// @route   PATCH /api/v1/trade-diary/:id
// @access  Public
export const updateTrade = async (req, res) => {
  try {
    const trade = await TradeDiary.findById(req.params.id);

    if (!trade) {
      return res
        .status(404)
        .json({ status: "fail", message: "Trade not found" });
    }

    // Ensure the user owns the trade
    // if (trade.crmUser.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     status: "fail",
    //     message: "User not authorized to update this trade",
    //   });
    // }

    const updatedTrade = await TradeDiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ status: "success", data: { trade: updatedTrade } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// @desc    Delete a trade diary entry
// @route   DELETE /api/v1/trade-diary/:id
// @access  Public
export const deleteTrade = async (req, res) => {
  try {
    const trade = await TradeDiary.findById(req.params.id);

    if (!trade) {
      return res
        .status(404)
        .json({ status: "fail", message: "Trade not found" });
    }

    // Ensure the user owns the trade
    // if (trade.crmUser.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     status: "fail",
    //     message: "User not authorized to delete this trade",
    //   });
    // }

    await TradeDiary.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Trade not found" });
  }
};
