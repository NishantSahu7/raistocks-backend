// import TradeDiary from "../models/tradeDiaryModel.js";

// // @desc    Create a new trade diary entry
// // @route   POST /api/v1/trade-diary
// // @access  Private (assumed)
// export const createTrade = async (req, res) => {
//   try {
//     // When protection is off, crmUser ID must be sent in the request body
//     // req.body.crmUser = req.user.id;

//     const newTrade = await TradeDiary.create(req.body);
//     console.log("req body",req.body)
//     res.status(201).json({
//       status: "success",
//       data: {
//         trade: newTrade,
//       },
//     });
     
//     console.log("new trade ",newTrade)
//   } catch (err) {
//     res.status(400).json({ status: "fail", message: err.message });
//   }
// };

// // @desc    Get all trade diary entries for a specific user
// // @route   GET /api/v1/trade-diary/user/:userId
// // @access  Public
// export const getTradesForUser = async (req, res) => {
//   try {
//     // const trades = await TradeDiary.find({ crmUser: req.params.userId });
//     const trades = await TradeDiary.find({ user_id: req.params.userId });

//     res.status(200).json({
//       status: "success",
//       results: trades.length,
//       data: {
//         trades,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({ status: "fail", message: "Trades not found" });
//   }
// };

// // @desc    Get a single trade diary entry by ID
// // @route   GET /api/v1/trade-diary/:id
// // @access  Public
// export const getTradeById = async (req, res) => {
//   try {
//     const trade = await TradeDiary.findById(req.params.id);

//     if (!trade) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Trade not found" });
//     }

//     // Ensure the user owns the trade
//     // if (trade.crmUser.toString() !== req.user.id) {
//     //   return res.status(403).json({
//     //     status: "fail",
//     //     message: "User not authorized to view this trade",
//     //   });
//     // }

//     res.status(200).json({ status: "success", data: { trade } });
//   } catch (err) {
//     res.status(400).json({ status: "fail", message: err.message });
//   }
// };

// // @desc    Update a trade diary entry
// // @route   PATCH /api/v1/trade-diary/:id
// // @access  Public
// export const updateTrade = async (req, res) => {
//   try {
//     const trade = await TradeDiary.findById(req.params.id);

//     if (!trade) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Trade not found" });
//     }

//     // Ensure the user owns the trade
//     // if (trade.crmUser.toString() !== req.user.id) {
//     //   return res.status(403).json({
//     //     status: "fail",
//     //     message: "User not authorized to update this trade",
//     //   });
//     // }

//     const updatedTrade = await TradeDiary.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     res.status(200).json({ status: "success", data: { trade: updatedTrade } });
//   } catch (err) {
//     res.status(400).json({ status: "fail", message: err.message });
//   }
// };

// // @desc    Delete a trade diary entry
// // @route   DELETE /api/v1/trade-diary/:id
// // @access  Public
// export const deleteTrade = async (req, res) => {
//   try {
//     const trade = await TradeDiary.findById(req.params.id);

//     if (!trade) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Trade not found" });
//     }

//     // Ensure the user owns the trade
//     // if (trade.crmUser.toString() !== req.user.id) {
//     //   return res.status(403).json({
//     //     status: "fail",
//     //     message: "User not authorized to delete this trade",
//     //   });
//     // }

//     await TradeDiary.findByIdAndDelete(req.params.id);
//     res.status(204).json({ status: "success", data: null });
//   } catch (err) {
//     res.status(404).json({ status: "fail", message: "Trade not found" });
//   }
// };
// ✅ Get all trade diary entries for a user (with trade details)
 
import mongoose from "mongoose";
import TradeDiary from "../models/tradeDiaryModel.js";
import Trade from "../models/tradeModel.js";

/**
 * @desc    Create a new trade diary entry
 * @route   POST /api/v1/trade-diary
 * @access  Private
 */
export const createTradeDiary = async (req, res) => {
  try {
    const {
      user_id,
      trade_id,
      entry,
      exit,
      quantity,
      pnl,
      result,
      action,
      date,
    } = req.body;

    if (!user_id || !trade_id) {
      return res
        .status(400)
        .json({ status: "fail", message: "Missing user_id or trade_id" });
    }

    const trade = await Trade.findById(trade_id);
    if (!trade) {
      return res.status(404).json({ status: "fail", message: "Trade not found" });
    }

    const newTradeDiary = await TradeDiary.create({
      user_id,
      trade_id,
      trade_title: trade.trade_title || trade.title,
      recommended_entry:
        trade.recommended_entry || trade.entry || trade.entryPrice,
      recommended_exit:
        trade.recommended_exit ||
        trade.exit ||
        trade.target1 ||
        trade.target2 ||
        trade.target3,
      entry,
      exit,
      quantity,
      pnl,
      result,
      action,
      date,
    });

    res.status(201).json({
      status: "success",
      data: newTradeDiary,
    });
  } catch (err) {
    console.error("❌ Error creating trade diary:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/**
 * @desc    Get all trade diary entries for a user (with trade details)
 * @route   GET /api/v1/trade-diary/user/:userId
 * @access  Private
 */
export const getTradesForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const trades = await TradeDiary.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "trades", // MongoDB collection name for Trade model
          localField: "trade_id",
          foreignField: "_id",
          as: "tradeDetails",
        },
      },
      {
        $unwind: { path: "$tradeDetails", preserveNullAndEmptyArrays: true },
      },
      { $sort: { date: -1 } },
    ]);

    res.status(200).json({
      status: "success",
      results: trades.length,
      data: trades,
    });
  } catch (err) {
    console.error("❌ Error fetching trades:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/**
 * @desc    Get a single trade diary entry by ID (with trade details)
 * @route   GET /api/v1/trade-diary/:id
 * @access  Private
 */
export const getTradeDiaryById = async (req, res) => {
  try {
    const id = req.params.id;

    const trades = await TradeDiary.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "trades",
          localField: "trade_id",
          foreignField: "_id",
          as: "tradeDetails",
        },
      },
      { $unwind: { path: "$tradeDetails", preserveNullAndEmptyArrays: true } },
    ]);

    if (!trades.length) {
      return res
        .status(404)
        .json({ status: "fail", message: "Trade Diary entry not found" });
    }

    res.status(200).json({
      status: "success",
      data: trades[0],
    });
  } catch (err) {
    console.error("❌ Error fetching trade diary:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/**
 * @desc    Update a trade diary entry by ID
 * @route   PATCH /api/v1/trade-diary/:id
 * @access  Private
 */
export const updateTradeDiary = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await TradeDiary.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: "fail", message: "Trade diary not found" });
    }

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updating trade diary:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/**
 * @desc    Delete a trade diary entry
 * @route   DELETE /api/v1/trade-diary/:id
 * @access  Private
 */
export const deleteTradeDiary = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await TradeDiary.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "Trade diary not found" });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error("❌ Error deleting trade diary:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};

