//controllers/subscriptionController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import { Subscription } from "../models/subscription.js";
import Client from "../models/clientModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order & Save Subscription
// export const createSubscriptionOrder = async (req, res) => {
//   try {
//     console.log("Received req.body:", req.body);

//     const {
//       name,
//       email,
//       phone,
//       dob,
//       pan,
//       planId,
//       planName,
//       amount,
//       planType,
//       duration,
//     } = req.body || {};

//     if (!name || !email || !phone || !dob || !planId || !planName) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     console.log("Creating Razorpay order with amount:", amount);

//     // ✅ Create Razorpay order
//     let order;
//     try {
//       order = await razorpay.orders.create({
//         amount: Number(amount) * 100, // amount in paise
//         currency: "INR",
//         receipt: `receipt_${Date.now()}`,
//         payment_capture: true,
//       });
//       console.log("Razorpay order created:", order.id);
//     } catch (err) {
//       console.error("Full Razorpay error:", JSON.stringify(err, null, 2));
//       return res.status(err.statusCode || 500).json({
//         success: false,
//         message: "Razorpay order creation failed",
//         error: err.message,
//       });
//     }

//     // ✅ Save subscription in DB
//     const subscription = new Subscription({
//       name,
//       email,
//       phone,
//       dob,
//       pan,
//       planId,
//       planName,
//       planType: planType || "", // 🩵 safe default
//       duration: duration || 0, // 🩵 safe default
//       amount: Number(amount) || 0, // 🩵 safe default
//       razorpayOrderId: order.id,
//     });

//     await subscription.save();
//     console.log("💾 Subscription saved:", subscription.planName);

//     res.status(200).json({
//       success: true,
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (err) {
//     console.error("Error in createSubscriptionOrder:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: err.message,
//     });
//   }
// };

export const createSubscriptionOrder = async (req, res) => {
  try {
    console.log("Received req.body:", req.body);

    const {
      name,
      email,
      phone,
      dob,
      pan,
      planId,
      planName,
      amount,
      planType,
      duration,
    } = req.body || {};

    if (!name || !email || !phone || !dob || !planId || !planName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🧩 Safe defaults
    let finalPlanType = planType || "Monthly";
    let finalDuration = duration;
    let finalAmount = Number(amount) || 0;

    // 🧮 Auto duration fallback
    if (!finalDuration || finalDuration === 0) {
      if (finalPlanType === "Trial") finalDuration = 15;
      else if (finalPlanType === "Monthly") finalDuration = 30;
      else if (finalPlanType === "Quarterly") finalDuration = 90;
      else if (finalPlanType === "Yearly") finalDuration = 365;
      else finalDuration = 30; // default
    }

    console.log("✅ Finalized Plan:", {
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
      console.log("Razorpay order created:", order.id);
    } catch (err) {
      console.error("Full Razorpay error:", JSON.stringify(err, null, 2));
      return res.status(err.statusCode || 500).json({
        success: false,
        message: "Razorpay order creation failed",
        error: err.message,
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

    const subscription = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!subscription)
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });

    // ✅ Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // ✅ Save verified payment info
    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.razorpaySignature = razorpay_signature;
    await subscription.save();

    console.log("✅ Payment verified for:", subscription.email);

    // ✅ Use values directly from subscription document
    let planType = subscription.planType || "Monthly";
    let duration = subscription.duration || 30;
    let amount = subscription.amount || 0;
    let daysLeft = 0;

    if (planType === "Trial") {
      const extractedDays = parseInt(duration.match?.(/\d+/)?.[0] || "14", 10);
      daysLeft = extractedDays;
    } else if (planType === "Monthly") daysLeft = 30;
    else if (planType === "Quarterly") daysLeft = 90;
    else if (planType === "Yearly") daysLeft = 365;
    else daysLeft = duration; // fallback for custom

    // ✅ Auto-create or update Client record
    const existingClient = await Client.findOne({ email: subscription.email });

    if (existingClient) {
      existingClient.subscription = subscription.planName;
      existingClient.planType = planType;
      existingClient.duration = duration;
      existingClient.amount = amount;
      existingClient.daysLeft = daysLeft;
      await existingClient.save();
      console.log("🔄 Existing client updated:", existingClient.email);
    } else {
      await Client.create({
        name: subscription.name,
        email: subscription.email,
        subscription: subscription.planName,
        planType,
        duration,
        amount,
        daysLeft,
      });
      console.log("🆕 New client created:", subscription.email);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
