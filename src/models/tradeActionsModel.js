// models/tradeAction.model.ts
import mongoose from "mongoose";
import Trade from "./tradeModel.js";

const tradeActionSchema = new mongoose.Schema(
  {
    tradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
      required: true,
    },
    type: {
      type: String,
      enum: ["update", "book_profit", "stoploss_hit", "exit" , "trail_sl" , "trail_sl_hit"],
      required: true,
    },
    price: { type: Number, required: true },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 🧠 Middleware: after creating a TradeAction
tradeActionSchema.post("save", async function (doc) {
  try {
    await Trade.findByIdAndUpdate(
      doc.tradeId,
      { createdAt: doc.createdAt },
      { new: true }
    );
  } catch (err) {
    console.error("Error updating Trade.createdAt from TradeAction:", err);
  }
});

export default mongoose.model("TradeAction", tradeActionSchema);
