// import Trade from "../models/tradeModel.js";
// import { sendNotificationToAll } from "../server.js";

// // Create a new trade
// export const createTrade = async (req, res) => {
//   try {
//     const trade = new Trade(req.body);
//     await trade.save();
//     res
//       .status(201)
//       .json({ success: true, message: "Trade added successfully", trade });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };


//  // ✅ Get all trades including actions
// export const getAllTrades = async (req, res) => {
//   try {
//     const trades = await Trade.aggregate([
//       {
//         $lookup: {
//           from: "tradeactions",  // MongoDB auto pluralizes collection names
//           localField: "_id",
//           foreignField: "tradeId",
//           as: "actions",
//         },
//       },
//       { $sort: { createdAt: -1 } },
//     ]);

//     res.status(200).json({
//       success: true,
//       message: "Trades fetched successfully",
//       trades,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// // Get single trade by ID
// export const getTradeById = async (req, res) => {
//   try {
//     const trade = await Trade.findById(req.params.id);
//     if (!trade)
//       return res
//         .status(404)
//         .json({ success: false, message: "Trade not found" });
//     res.status(200).json(trade);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update trade
// export const updateTrade = async (req, res) => {
//   try {
//     const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!trade)
//       return res
//         .status(404)
//         .json({ success: false, message: "Trade not found" });
//     res
//       .status(200)
//       .json({ success: true, message: "Trade updated successfully", trade });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// // Update trade status  
// export const updateTradeStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     console.log('Updating trade status:', { tradeId: req.params.id, newStatus: status });
//     const trade = await Trade.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     if (!trade)
//       return res
//         .status(404)
//         .json({ success: false, message: "Trade not found" });
//     res.status(200).json({ success: true, message: "Trade status updated", trade });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };
// // Delete trade
// export const deleteTrade = async (req, res) => {
//   try {
//     const trade = await Trade.findByIdAndDelete(req.params.id);
//     if (!trade)
//       return res
//         .status(404)
//         .json({ success: false, message: "Trade not found" });
//     res
//       .status(200)
//       .json({ success: true, message: "Trade deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Update Trail Stoploss (trailSl)
// export const updateTrailSl = async (req, res) => {
//   try {
//     const { trailSl } = req.body;
    
//     const trade = await Trade.findByIdAndUpdate(
//       req.params.id,
//       { trailSl },
//       { new: true }
//     );

//     if (!trade)
//       return res
//         .status(404)
//         .json({ success: false, message: "Trade not found" });

//     res.status(200).json({
//       success: true,
//       message: "Trail SL updated successfully",
//       trade,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };


import Trade from "../models/tradeModel.js";
import { sendNotificationToAll } from "../server.js";

/* ===========================================================
   CREATE TRADE  (Broadcast Notification)
=========================================================== */
export const createTrade = async (req, res) => {
  try {
    const trade = await Trade.create(req.body);

    // 🔔 Broadcast notification to all clients
    sendNotificationToAll({
      title: "New Trade Created",
      message: `A new trade (${trade.title || trade.segment}) has been added.`,
      tradeId: trade._id,
      type: "trade_created",
    });

    res.status(201).json({
      success: true,
      message: "Trade added successfully",
      trade,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/* ===========================================================
   GET ALL TRADES
=========================================================== */
export const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.aggregate([
      {
        $lookup: {
          from: "tradeactions",
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


/* ===========================================================
   GET TRADE BY ID
=========================================================== */
export const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade)
      return res.status(404).json({ success: false, message: "Trade not found" });

    res.status(200).json(trade);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===========================================================
   UPDATE TRADE  (Send Notification)
=========================================================== */
export const updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!trade)
      return res.status(404).json({ success: false, message: "Trade not found" });

    // 🔔 Notify all clients
    sendNotificationToAll({
      title: "Trade Updated",
      message: `Trade ${trade.title || trade.segment} was updated.`,
      tradeId: trade._id,
      type: "trade_updated",
    });

    res.status(200).json({
      success: true,
      message: "Trade updated successfully",
      trade,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===========================================================
   UPDATE TRADE STATUS (Send Notification)
=========================================================== */
export const updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!trade)
      return res.status(404).json({ success: false, message: "Trade not found" });

    // 🔔 Notify all clients
    sendNotificationToAll({
      title: "Trade Status Updated",
      message: `Trade "${trade.title}" status changed to ${status}.`,
      tradeId: trade._id,
      type: "trade_status",
    });

    res.status(200).json({
      success: true,
      message: "Trade status updated",
      trade,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/* ===========================================================
   DELETE TRADE  (Send Notification)
=========================================================== */
export const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);

    if (!trade)
      return res.status(404).json({ success: false, message: "Trade not found" });

    // 🔔 Notify all clients
    sendNotificationToAll({
      title: "Trade Deleted",
      message: `Trade "${trade.title}" has been deleted.`,
      tradeId: trade._id,
      type: "trade_deleted",
    });

    res.status(200).json({
      success: true,
      message: "Trade deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===========================================================
   UPDATE TRAIL STOPLOSS (Send Notification)
=========================================================== */
export const updateTrailSl = async (req, res) => {
  try {
    const { trailSl } = req.body;

    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { trailSl },
      { new: true }
    );

    if (!trade)
      return res.status(404).json({ success: false, message: "Trade not found" });

    // 🔔 Notify all clients
    sendNotificationToAll({
      title: "Trail SL Updated",
      message: `Trail SL for trade "${trade.title}" updated to ${trailSl}.`,
      tradeId: trade._id,
      type: "trail_sl_updated",
    });

    res.status(200).json({
      success: true,
      message: "Trail SL updated successfully",
      trade,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
