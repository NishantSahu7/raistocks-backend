import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    segment: { type: String }, // e.g. Cash, F&O, etc.
    tradeType: { type: String }, // e.g. Swing, Intraday
    action: { type: String, },
    on: { type: String }, // e.g. Reliance, Banknifty
    entryPrice: { type: Number },
    stoploss: { type: String,},
    target1: { type: Number },
    target2: { type: Number },
    target3: { type: Number },
    timeDuration: { type: String, default: "Today" },
    weightageValue: { type: Number, default: 0 },
    weightageExtension: { type: String, default: "% of your capital" },
    lotSize: { type: String, default: "Optional" },
    lots: { type: Number, default: 1 },
    recommendationDateTime: { type: Date },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
