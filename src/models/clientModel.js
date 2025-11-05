import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    pan: { type: String, default: "" },
    state: { type: String, default: "" },

    // Subscription info
    subscription: { type: String, required: true }, // from planName
    planType: { type: String, default: "Monthly" }, // Monthly, Quarterly, Yearly, Trial
    duration: { type: Number, default: 30 }, // In days
    daysLeft: { type: Number, default: 30 },
    amount: { type: Number, default: 0 },

    // KYC & status
    kyc: { type: String, default: "Pending" },
    method: { type: String, default: "" },
    status: { type: String, default: "Pending" },

    // Payment reference
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
