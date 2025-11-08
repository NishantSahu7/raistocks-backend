 import Client from "../models/clientModel.js";
import Support from "../models/supportModel.js";
import { Subscription } from "../models/subscription.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 🧮 Total Clients
    const totalClients = await Client.countDocuments();

    // 🧮 KYC Pending
    const kycPending = await Client.countDocuments({ kyc: "Pending" });

    // 🧮 Open Support Tickets (not resolved)
    const openTickets = await Support.countDocuments({
      status: { $ne: "Resolved" },
    });

    // 🧮 Active Subscriptions (clients with Success status)
    const activeSubscriptions = await Client.countDocuments({
      status: { $in: ["Success", "Test Success"] },
    });

    // 🧮 Total Revenue (sum of all successful payments)
    const totalRevenueData = await Client.aggregate([
      { $match: { status: { $in: ["Success", "Test Success"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    // 🧾 Optional: Count total subscriptions/payments too
    const totalPayments = await Subscription.countDocuments({
      paymentStatus: { $in: ["Success", "captured", "Test Success"] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        kycPending,
        openTickets,
        activeSubscriptions,
        totalRevenue,
        totalPayments,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
