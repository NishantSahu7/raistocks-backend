// models/MarketInsight.js
import mongoose from "mongoose";

const globalMarketSchema = new mongoose.Schema(
  {
    country: {
      type: String,
    },
    currency: {
      type: Number,
    },
    value: {
      type: String,
    },
    globalcomment: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const GlobalMarket = mongoose.model("GlobalMarket", globalMarketSchema);
export default GlobalMarket;
