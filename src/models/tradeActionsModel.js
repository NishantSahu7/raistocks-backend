// models/tradeAction.model.ts
import mongoose from "mongoose";

const tradeActionSchema = new mongoose.Schema(
  {
    tradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade", // 🔗 Reference to Trade model
      required: true,
    },
    type: {
      type: String,
      enum: ["update", "book_profit", "stoploss_hit"],
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TradeAction", tradeActionSchema);
