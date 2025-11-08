import Client from "../models/clientModel.js";
import Support from "../models/supportModel.js";
import { Subscription } from "../models/subscriptionModel.js";

export const    getDashboardStats = async (req, res) => {
  try {
    // 1️⃣ Total Clients
    const totalClients = await Client.countDocuments();

    // 2️⃣ KYC Pending
    const kycPending = await Client.countDocuments({ kyc: "Pending" });

    // 3️⃣ Open / Pending Support Tickets
    const openTickets = await Support.countDocuments({
      status: { $in: ["Pending", "Open"] },
    });

    // 4️⃣ Active Subscriptions
    const activeSubscriptions = await Subscription.countDocuments({
      status: "Success",
    });

    // 5️⃣ Total Revenue (sum of all successful payments)
    const revenueData = await Subscription.aggregate([
      { $match: { status: "Success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // ✅ Final dashboard response
    res.status(200).json({
      success: true,
      data: {
        totalClients,
        kycPending,
        openTickets,
        activeSubscriptions,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
