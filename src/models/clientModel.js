// models/clientModel.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subscription: { type: String, required: true }, // from planName
    daysLeft: { type: Number, default: 0 },
    kyc: { type: String, default: "Pending" },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
