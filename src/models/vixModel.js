// models/MarketInsight.js
import mongoose from "mongoose";

const vixSchema = new mongoose.Schema(
  {
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

const Vix = mongoose.model("Vix", vixSchema);
export default Vix;
