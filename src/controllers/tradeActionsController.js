import Trade from "../models/tradeModel.js";
import TradeAction from "../models/tradeActionsModel.js";

// ✅ Add a new action for a trade
export const addTradeAction = async (req, res) => {
  try {
    const { tradeId } = req.params; // ✅ Take from params, not body
    const { type, title, price, comment, actionDateTime, trialSl } = req.body;
    console.log("body",req.body)
  
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
      trialSl,
      actionDateTime: new Date(actionDateTime),
    });

    // If the action is an exit, mark the trade as Closed in backend
    try {
      if (String(type || "").toLowerCase() === "exit") {
        if (String(type || "").toLowerCase() === "exit") {
  console.log("➡️ Exit triggered with price:", price, typeof price);
  await Trade.findByIdAndUpdate(tradeId, {
    status: "Closed",
    exit: price,
  });
}

        await Trade.findByIdAndUpdate(tradeId, { status: "Closed" ,
          exit: price,
        });
      }
    } catch (err) {
      console.error("Failed to update trade status after action:", err);
      // don't fail the action creation because of status update failure
    }

    res.status(201).json({
      message: "Action added successfully",
      action,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding action", error });
  }
};

// ✅ Get all actions for a specific trade
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
