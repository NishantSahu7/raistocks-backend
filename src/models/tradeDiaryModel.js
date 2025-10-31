import mongoose from "mongoose";

// const tradeDiarySchema = new mongoose.Schema(
//   {
//     crmUser: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "CRM",
//       required: [true, "A trade must belong to a user."],
//     },
//     date: {
//       type: Date,
//      },
//     tradeTitle: {
//       type: String,
//        trim: true,
//     },
//     action: {
//       type: String,
//      },
//     entry: {
//       type: Number,
//      },
//     yourEntry: {
//       type: Number,
//      },
//     exit: {
//       type: Number,
//      },
//     yourExit: {
//       type: Number,
//      },
//     qty: {
//       type: Number,
//      },
//     pnl: { type: Number,  },
//     result: { type: String,  },
//   },
//   { timestamps: true }
// );
// const tradeDiarySchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Client",
//     required: true
//   },
//   trade_title: String,
//   recommended_entry: Number,
//   recommended_exit: Number,
//   entry: Number,
//   exit: Number,
//   quantity: Number,
//   pnl: Number,
//   result: String,
//   date: Date,
//   action: String,
// });
const tradeDiarySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  trade_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trade",  // ✅ Reference to your Trade model
    required: true
  },
  entry: Number,
  exit: Number,
  quantity: Number,
  pnl: Number,
  result: String,
  date: Date,
  action: String,
}, { timestamps: true });

const TradeDiary = mongoose.model("TradeDiary", tradeDiarySchema);

export default TradeDiary;
