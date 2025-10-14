import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    segment: { type: String, required: true }, // e.g. Cash, F&O, etc.
    tradeType: { type: String, required: true }, // e.g. Swing, Intraday
    action: { type: String, enum: ["Buy", "Sell"], required: true },
    on: { type: String, required: true }, // e.g. Reliance, Banknifty
    entryPrice: { type: Number, required: true },
    stoploss: { type: String, default: "NA" },
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
      enum: ["Active", "Closed", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
