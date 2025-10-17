import mongoose from "mongoose";

const tradeDiarySchema = new mongoose.Schema(
  {
    crmUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CRM",
      required: [true, "A trade must belong to a user."],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date for the trade."],
    },
    tradeTitle: {
      type: String,
      required: [true, "Please provide a title for the trade."],
      trim: true,
    },
    action: {
      type: String,
      required: [true, "Please specify the action (e.g., Buy, Sell)."],
    },
    entry: {
      type: Number,
      required: [true, "Please provide the entry price."],
    },
    yourEntry: {
      type: Number,
      required: [true, "Please provide your entry price."],
    },
    exit: {
      type: Number,
      required: [true, "Please provide the exit price."],
    },
    yourExit: {
      type: Number,
      required: [true, "Please provide your exit price."],
    },
    qty: {
      type: Number,
      required: [true, "Please provide the quantity."],
    },
    pnl: { type: Number, required: [true, "Please provide the P&L."] },
    result: { type: String, required: [true, "Please provide the result."] },
  },
  { timestamps: true }
);

const TradeDiary = mongoose.model("TradeDiary", tradeDiarySchema);

export default TradeDiary;
