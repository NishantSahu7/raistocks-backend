// controllers/subscriptionController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import { Subscription } from "../models/subscription.js";
import Client from "../models/clientModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order & Save Subscription
export const createSubscriptionOrder = async (req, res) => {
  try {
    console.log("Received req.body:", req.body);

    const { name, email, phone, dob, pan, planId, planName, amount } = req.body || {};

    if (!name || !email || !phone || !dob || !planId || !planName || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    console.log("Creating Razorpay order with amount:", amount);

    // ✅ Create Razorpay order
    let order;
    try {
      order = await razorpay.orders.create({
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
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

    // ✅ Save subscription in DB
    const subscription = new Subscription({
      name,
      email,
      phone,
      dob,
      pan,
      planId,
      planName,
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
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// ✅ Verify Payment & Auto-Create/Update Client
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const subscription = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!subscription)
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      subscription.razorpayPaymentId = razorpay_payment_id;
      subscription.razorpaySignature = razorpay_signature;
      await subscription.save();

      // ✅ Auto-create or update Client record
      const existingClient = await Client.findOne({ email: subscription.email });

      if (existingClient) {
        // Update plan if user upgrades
        existingClient.subscription = subscription.planName;
        await existingClient.save();
        console.log("Existing client updated with new plan:", subscription.planName);
      } else {
        // Create new client
        await Client.create({
          name: subscription.name,
          email: subscription.email,
          subscription: subscription.planName,
        });
        console.log("New client created:", subscription.email);
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
