import mongoose from "mongoose";

const marketPhaseModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // optional — if you want to know who created it
    // },
  },
  { timestamps: true }
);

const MarketPhase = mongoose.model("MarketPhase", marketPhaseModel);
export default MarketPhase;
