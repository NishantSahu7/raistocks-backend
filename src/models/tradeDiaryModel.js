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
     },
    tradeTitle: {
      type: String,
       trim: true,
    },
    action: {
      type: String,
     },
    entry: {
      type: Number,
     },
    yourEntry: {
      type: Number,
     },
    exit: {
      type: Number,
     },
    yourExit: {
      type: Number,
     },
    qty: {
      type: Number,
     },
    pnl: { type: Number,  },
    result: { type: String,  },
  },
  { timestamps: true }
);

const TradeDiary = mongoose.model("TradeDiary", tradeDiarySchema);

export default TradeDiary;
