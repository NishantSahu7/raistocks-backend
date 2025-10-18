import Razorpay from "razorpay";
import { Subscription } from "../models/subscription.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createSubscriptionOrder = async (req, res) => {
  try {
    console.log("Received req.body:", req.body);

    const { name, email, phone, dob, pan, planId, amount } = req.body || {};
    if (!name || !email || !phone || !dob || !planId || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    console.log("Creating Razorpay order with amount:", amount);

    // Create Razorpay order
    let order;
    try {
      order = await razorpay.orders.create({
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: true, // boolean instead of 1
      });
      console.log("Razorpay order created:", order);
    } catch (err) {
      console.error("Full Razorpay error:", JSON.stringify(err, null, 2));
      return res.status(err.statusCode || 500).json({
        success: false,
        message: "Razorpay order creation failed",
        error: err.error || err.message || err,
      });
    }

    // Save subscription in MongoDB
    const subscription = new Subscription({
      name,
      email,
      phone,
      dob,
      pan,
      planId,
      razorpayOrderId: order.id,
    });

    await subscription.save();
    console.log("Subscription saved in DB");

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Error in createSubscriptionOrder:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const subscription = await Subscription.findOne({ razorpayOrderId: razorpay_order_id });
    if (!subscription) return res.status(404).json({ success: false, message: "Subscription not found" });

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      subscription.razorpayPaymentId = razorpay_payment_id;
      subscription.razorpaySignature = razorpay_signature;
      await subscription.save();
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
