// models/clientModel.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subscription: { type: String, required: true }, // from planName
    planType: { type: String, default: "" }, // Monthly, Quarterly, Yearly, Trial
    duration: { type: Number, default: 0 }, // For trial/custom plans
    daysLeft: { type: Number, default: 0 },
    kyc: { type: String, default: "Pending" },
    status: { type: String, default: "Active" },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
