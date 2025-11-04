import mongoose from "mongoose";

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { _id: true }); // subService ka bhi _id generate hoga

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  subServices: [subServiceSchema],
}, { _id: true }); // service ka _id automatically generate hoga

const pricingOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Monthly", "Quarterly", "Yearly","Trial"],
    required: false,
  },
  price: { type: Number, default: 0 },
  features: [{ type: String }],
  services: [serviceSchema], // nested services with subServices
});

const planSubscriptionSchema = new mongoose.Schema({
  planName: { type: String, required: true }, // e.g. "Premium", "Trader"
  description: { type: String },
  isFree: { type: Boolean, default: false },
  duration: { type: String }, // e.g. "15 Days" (for trial)
  accessLevel: { type: String },
  emailSupport: { type: Boolean, default: false },
  adminApproval: { type: Boolean, default: false },
  pricingOptions: [pricingOptionSchema],
});

export default mongoose.model("SubscriptionPlan", planSubscriptionSchema);
