// models/TradeSetup.js
import mongoose from "mongoose";

const tradeSetupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    modelType: {
      type: String,
      enum: ["MarketInsight", "MarketTrend", "MarketPhase", "MarketSetup"],
      required: true,
    },
    modelRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "modelType", // dynamic reference based on modelType
    },
  },
  { timestamps: true }
);

const TradeSetup = mongoose.model("TradeSetup", tradeSetupSchema);
export default TradeSetup;
