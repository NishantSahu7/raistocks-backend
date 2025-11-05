import Razorpay from "razorpay";
import crypto from "crypto";
import { Subscription } from "../models/subscription.js";
import Client from "../models/clientModel.js";
import { generateClientId } from "../utils/generateClientId.js";

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order (Subscription Start)
export const createSubscriptionOrder = async (req, res) => {
  console.log("🟢 Received req.body:", req.body);

  try {
    const {
      name,
      email,
      phone,
      dob,
      pan,
      state,
      planId,
      planName,
      amount,
      planType,
      duration,
    } = req.body || {};

    // Validate required fields
    if (!name || !email || !phone || !dob || !planId || !planName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🧩 Defaults
    let finalPlanType = planType || "Monthly";
    let finalDuration = duration;
    let finalAmount = Number(amount) || 0;

    // Auto set duration based on plan type
    if (!finalDuration || finalDuration === 0) {
      if (finalPlanType === "Trial") finalDuration = 15;
      else if (finalPlanType === "Monthly") finalDuration = 30;
      else if (finalPlanType === "Quarterly") finalDuration = 90;
      else if (finalPlanType === "Yearly") finalDuration = 365;
      else finalDuration = 30;
    }

    console.log("📦 Finalized Plan:", {
      planType: finalPlanType,
      duration: finalDuration,
      amount: finalAmount,
    });

    // ✅ Create Razorpay order
    let order;
    try {
      order = await razorpay.orders.create({
        amount: finalAmount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      });
      console.log("✅ Razorpay order created:", order.id);
    } catch (err) {
      console.error("❌ Razorpay Error:", err);
      return res.status(err.statusCode || 500).json({
        success: false,
        message: "Razorpay order creation failed",
        error: err.message,
      });
    }

    // ✅ Save subscription record
    const subscription = new Subscription({
      name,
      email,
      phone,
      dob,
      pan,
      state,
      planId,
      planName,
      planType: finalPlanType,
      duration: finalDuration,
      amount: finalAmount,
      razorpayOrderId: order.id,
    });

    await subscription.save();
    console.log("💾 Subscription saved:", subscription.planName);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Error in createSubscriptionOrder:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // 🧩 Find subscription
    const subscription = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    // ✅ Verify Razorpay signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // ✅ Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const paymentMethod = payment?.method || "Test Payment";
    const paymentStatus =
      payment?.status === "captured" ? "Success" : "Test Success";

    // ✅ Update subscription with payment details
    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.razorpaySignature = razorpay_signature;
    subscription.paymentMethod = paymentMethod;
    subscription.paymentStatus = paymentStatus;
    await subscription.save();

    console.log("💳 Payment verified for:", subscription.email);

    // ✅ Determine duration & days left
    const planType = subscription.planType || "Monthly";
    const duration =
      planType === "Trial"
        ? 15
        : planType === "Quarterly"
        ? 90
        : planType === "Yearly"
        ? 365
        : subscription.duration || 30;

    const daysLeft = duration;

    // ✅ Create or update client
    let existingClient = await Client.findOne({ email: subscription.email });

    if (existingClient) {
      existingClient.subscription = subscription.planName;
      existingClient.planType = planType;
      existingClient.duration = duration;
      existingClient.amount = subscription.amount;
      existingClient.daysLeft = daysLeft;
      existingClient.phone = subscription.phone;
      existingClient.dob = subscription.dob;
      existingClient.pan = subscription.pan;
      existingClient.state = subscription.state;
      existingClient.razorpayOrderId = razorpay_order_id;
      existingClient.razorpayPaymentId = razorpay_payment_id;
      existingClient.method = paymentMethod;
      existingClient.status = paymentStatus;

      await existingClient.save();
      console.log("🔄 Existing client updated:", existingClient.email);
    } else {
      // ✅ Generate unique Client ID
      const clientId = await generateClientId();
      console.log("🆕 Generated Client ID:", clientId);

      await Client.create({
        clientId, // 👈 add here
        name: subscription.name,
        email: subscription.email,
        phone: subscription.phone,
        dob: subscription.dob,
        pan: subscription.pan,
        state: subscription.state,
        subscription: subscription.planName,
        planType,
        duration,
        amount: subscription.amount,
        daysLeft,
        kyc: "Pending",
        status: paymentStatus,
        method: paymentMethod,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      console.log(
        `🆕 New client created: ${subscription.email} 🪪 ID: ${clientId}`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("❌ Error in verifyPayment:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
