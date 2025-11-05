// // models/Subscription.js
// import mongoose from "mongoose";

// const subscriptionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   dob: { type: Date, required: true },
//   pan: { type: String },
//   planId: { type: String, required: true },
//   planName: { type: String, required: true },
//   planType: { type: String, default: "" },
//   duration: { type: Number, default: 0 },
//   amount: { type: Number, default: 0 },
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   razorpaySignature: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// export const Subscription = mongoose.model("Subscription", subscriptionSchema);

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  pan: { type: String },
  state: { type: String },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planType: { type: String, default: "" },
  duration: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },

  // Razorpay payment details
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  // 🧩 New fields for transaction & invoice
  transactionId: { type: String, default: "" },
  paymentMethod: { type: String, default: "Unknown" },
  status: { type: String, default: "Pending" },
  invoiceId: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
