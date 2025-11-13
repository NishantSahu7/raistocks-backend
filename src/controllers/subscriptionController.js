import Razorpay from "razorpay";
import crypto from "crypto";
import { Subscription } from "../models/subscription.js";
import Client from "../models/clientModel.js";
import { generateClientId } from "../utils/generateClientId.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------------- CREATE SUBSCRIPTION ORDER ----------------------
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
      console.error("❌ Missing required fields in request body");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Convert duration string to number (dynamic)
    let finalDuration = Number(duration);
    if (!finalDuration || finalDuration <= 0) {
      console.warn("⚠️ Duration not provided or invalid, using fallback 30 days");
      finalDuration = 30;
    }

    const finalPlanType = planType || "Monthly";
    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      console.error("❌ Invalid amount:", amount);
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    console.log("📦 Finalized Plan:", { finalPlanType, finalDuration, finalAmount });

    // Create Razorpay order
    let order;
    try {
      order = await razorpay.orders.create({
        amount: finalAmount * 100, // in paise
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

    // Save subscription
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
    console.log("💾 Subscription saved:", subscription);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Error in createSubscriptionOrder:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// ---------------------- VERIFY PAYMENT ----------------------
export const verifyPayment = async (req, res) => {
  try {
    console.log("🔹 Verifying payment with req.body:", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Find subscription
    const subscription = await Subscription.findOne({ razorpayOrderId: razorpay_order_id });
    if (!subscription) {
      console.error("❌ Subscription not found for order:", razorpay_order_id);
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    console.log("📄 Subscription found:", subscription);

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
    console.log("✅ Razorpay signature verified");

    // Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const paymentMethod = payment?.method || "Test Payment";
    const paymentStatus = payment?.status === "captured" ? "Success" : "Test Success";
    console.log("💳 Payment details:", { paymentMethod, paymentStatus });

    // Update subscription
    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.razorpaySignature = razorpay_signature;
    subscription.paymentMethod = paymentMethod;
    subscription.paymentStatus = paymentStatus;
    await subscription.save();
    console.log("💾 Subscription updated with payment info");

    // Dynamic duration & daysLeft
    const totalDuration = Number(subscription.duration) || 30;

    let daysLeft = totalDuration;

    // Create or update client
    let existingClient = await Client.findOne({ email: subscription.email });

    if (existingClient) {
      // Add remaining days for renewals
      daysLeft = (existingClient.daysLeft || 0) + totalDuration;

      existingClient.subscription = subscription.planName;
      existingClient.planType = subscription.planType || "Monthly";
      existingClient.duration = totalDuration;
      existingClient.daysLeft = daysLeft;
      existingClient.amount = subscription.amount;
      existingClient.phone = subscription.phone;
      existingClient.dob = subscription.dob;
      existingClient.pan = subscription.pan;
      existingClient.state = subscription.state;
      existingClient.razorpayOrderId = razorpay_order_id;
      existingClient.razorpayPaymentId = razorpay_payment_id;
      existingClient.method = paymentMethod;
      existingClient.status = paymentStatus;

      await existingClient.save();
      console.log("🔄 Existing client updated:", existingClient);
    } else {
      // New client
      const clientId = await generateClientId()
      await Client.create({
        clientId,
        name: subscription.name,
        email: subscription.email,
        phone: subscription.phone,
        dob: subscription.dob,
        pan: subscription.pan,
        state: subscription.state,
        subscription: subscription.planName,
        planType: subscription.planType || "Monthly",
        duration: totalDuration,
        amount: subscription.amount,
        daysLeft,
        kyc: "Pending",
        status: paymentStatus,
        method: paymentMethod,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
    }

    res.status(200).json({
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
