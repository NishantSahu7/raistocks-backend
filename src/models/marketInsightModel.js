import mongoose from "mongoose";
import { attachTradeSetupHooks } from "../middleware/tradeSetupSync.js";

const marketInsightSchema = new mongoose.Schema({
  marketInfo: String,
  title: String,
  comment: String,
  sentiment: { type: String, default: null },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// 🧩 Attach trade setup sync middleware
attachTradeSetupHooks(marketInsightSchema, "MarketInsight", doc => ({
  title: doc.title,
  comment: doc.comment,
}));

export default mongoose.model("MarketInsight", marketInsightSchema);
