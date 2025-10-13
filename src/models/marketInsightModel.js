// models/MarketInsight.js
import mongoose from "mongoose";

const marketInsightSchema = new mongoose.Schema(
  {
    marketInfo: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
    },
    comment: {
      type: String,
    },
    sentiment: {
      type: String,
      // allow null when no sentiment provided; frontend will send null if none selected
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MarketInsight = mongoose.model("MarketInsight", marketInsightSchema);
export default MarketInsight;
