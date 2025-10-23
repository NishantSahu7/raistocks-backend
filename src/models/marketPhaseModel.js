import mongoose from "mongoose";
import { attachTradeSetupHooks } from "../middleware/tradeSetupSync.js";

const marketPhaseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

attachTradeSetupHooks(marketPhaseSchema, "MarketPhase", doc => ({
  title: doc.title,
  comment: doc.description,
}));

export default mongoose.model("MarketPhase", marketPhaseSchema);
