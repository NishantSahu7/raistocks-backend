import mongoose from "mongoose";
import { attachTradeSetupHooks } from "../middleware/tradeSetupSync.js";

const marketSetupSchema = new mongoose.Schema({
  on: { type: String, required: true },
  price: { type: Number, required: true },
  supportLevels: {
    type: [Number],
    validate: [arr => arr.length === 3, "Support array must have 3 levels"],
  },
  resistanceLevels: {
    type: [Number],
    validate: [arr => arr.length === 3, "Resistance array must have 3 levels"],
  },
  supportResistanceComment: String,
  phase: String,
  phaseComment: String,
  trend: String,
  trendComment: String,
  chartPattern: String,
  chartPatternComment: String,
  candlePattern: String,
  candlePatternComment: String,
  breakoutEvents: [
    {
      formation: String,
      eventComment: String,
    },
  ],
  imageUrl: String,
}, { timestamps: true });

attachTradeSetupHooks(marketSetupSchema, "MarketSetup", doc => ({
  title: doc.on,
  comment: doc.supportResistanceComment || "No comment",
}));

export default mongoose.model("MarketSetup", marketSetupSchema);
