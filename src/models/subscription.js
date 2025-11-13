// import mongoose from "mongoose";

// const subscriptionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   dob: { type: Date, required: true },
//   pan: { type: String },
//   state: { type: String },
//   planId: { type: String, required: true },
//   planName: { type: String, required: true },
//   planType: { type: String, default: "" },
//   duration: { type: Number, default: 0 },
//   amount: { type: Number, default: 0 },

//   // Razorpay payment details
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   razorpaySignature: { type: String },

//   // 🧩 New fields for transaction & invoice
//   transactionId: { type: String, default: "" },
//   paymentMethod: { type: String, default: "Unknown" },
//   status: { type: String, default: "Pending" },
//   invoiceId: { type: String, default: "" },

//   createdAt: { type: Date, default: Date.now },
// });

// export const Subscription = mongoose.model("Subscription", subscriptionSchema);
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  // 👤 Client Information
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  pan: { type: String },
  state: { type: String },

  // 🪙 Plan Details
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planType: { type: String, default: "" },
  duration: { type: Number, default: 0 }, // total duration in days
  amount: { type: Number, default: 0 },

  // 💳 Razorpay Payment Details
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  // 🧾 Transaction & Invoice Info
  transactionId: { type: String, default: "" },
  paymentMethod: { type: String, default: "Unknown" },
  status: { type: String, default: "Pending" }, // Pending, Success, Failed, Expired
  invoiceId: { type: String, unique: true },

  // 🕒 Subscription Tracking
  startDate: { type: Date, default: Date.now }, // when plan activated
  endDate: { type: Date }, // calculated automatically
  remainingDays: { type: Number, default: 0 }, // updated daily via cron
  isActive: { type: Boolean, default: true }, // false when expired
  lastReminderSent: { type: Date, default: null }, // helps avoid duplicate mails

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 🧠 Auto-calculate endDate & remainingDays before saving
subscriptionSchema.pre("save", function (next) {
  if (
    this.isNew ||
    this.isModified("duration") ||
    this.isModified("startDate")
  ) {
    if (!this.startDate) this.startDate = new Date();

    // Calculate endDate from startDate + duration days
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + this.duration);
    this.endDate = end;

    // Initialize remainingDays if missing
    if (!this.remainingDays || this.remainingDays === 0) {
      this.remainingDays = this.duration;
    }
  }

  this.updatedAt = new Date();
  next();
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
