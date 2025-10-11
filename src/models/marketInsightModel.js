// models/MarketInsight.js
import mongoose from "mongoose";

const marketInsightSchema = new mongoose.Schema(
  {
    marketInfo: {
      type: String,
      required: [true, "marketInfo is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    comment: {
      type: String,
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      // allow null when no sentiment provided; frontend will send null if none selected
      default: null,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    currency: {
      type: Number,
      required: [true, "Currency is required"],
    },
    value: {
      type: String,
      required: [true, "Value is required"],
    },
    globalcomment: {
      type: String,
    },
    vixValue: {
      type: String,
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
