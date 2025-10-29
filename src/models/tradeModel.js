// models/trade.model.ts
import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    segment: { type: String },
    tradeType: { type: String },
    action: { type: String },
    on: { type: String },
    entryPrice: { type: Number },
    stoploss: { type: String },
    target1: { type: Number },
    target2: { type: Number },
    target3: { type: Number },
    trailSl: { type: Number, default: null },
    timeDuration: { type: String, default: "Today" },
    weightageValue: { type: Number, default: 0 },
    weightageExtension: { type: String, default: "% of your capital" },
    lotSize: { type: String, default: "Optional" },
    lots: { type: Number, default: 1 },
    recommendationDateTime: { type: Date },
    title: { type: String },
    status: { type: String },
    risk: { type: String },
    brief: { type: String },
    createdAt: { type: Date, default: Date.now } // allow manual override
  },
  { timestamps: { createdAt: false, updatedAt: true } } // disable auto createdAt
);

export default mongoose.model("Trade", tradeSchema);
