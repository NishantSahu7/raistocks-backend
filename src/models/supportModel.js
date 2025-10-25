// models/supportModel.js
import mongoose from "mongoose";

const supportModelSchema = new mongoose.Schema(
  {
    ticketId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    opened: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

// ✅ Auto-increment logic for ticketId
supportModelSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastTicket = await mongoose
      .model("supportModel")
      .findOne({})
      .sort({ ticketId: -1 })
      .select("ticketId");

    this.ticketId = lastTicket ? lastTicket.ticketId + 1 : 101; // Start from 101
  }
  next();
});

const supportModel = mongoose.model("supportModel", supportModelSchema);
export default supportModel;
