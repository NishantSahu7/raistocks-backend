import Client from "../models/clientModel.js";

export const getInvoiceById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // 🧾 GST Logic — amount is INCLUSIVE of 18%
    const totalAmount = client.amount; // including GST
    const gstRate = 0.18;
    const baseAmount = totalAmount / (1 + gstRate); // taxable value
    let gstBreakup = {};

    if (client.state?.toLowerCase() === "chhattisgarh") {
      // 🏠 Intra-state → CGST + SGST
      const cgst = baseAmount * 0.09;
      const sgst = baseAmount * 0.09;
      gstBreakup = {
        type: "CGST + SGST",
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        totalTax: (cgst + sgst).toFixed(2),
      };
    } else {
      // 🌐 Inter-state → IGST
      const igst = baseAmount * 0.18;
      gstBreakup = {
        type: "IGST",
        igst: igst.toFixed(2),
        totalTax: igst.toFixed(2),
      };
    }

    // 🧾 Invoice data
    const invoiceData = {
      id: `GST-INV-${new Date().getFullYear()}-${client._id
        .toString()
        .slice(-5)
        .toUpperCase()}`,
      clientName: client.name,
      date: new Date(client.createdAt).toISOString().split("T")[0],
      gstin: process.env.COMPANY_GSTIN,
      items: [
        {
          description: `${client.subscription} Plan (${client.planType})`,
          amount: parseFloat(baseAmount.toFixed(2)),
        },
      ],
      taxRate: gstRate,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      gstBreakup,
      method: client.method || "Unknown",
      status: client.status || "Pending",
      email: client.email,
      phone: client.phone,
      state: client.state,
      razorpayOrderId: client.razorpayOrderId,
      razorpayPaymentId: client.razorpayPaymentId,
    };

    res.status(200).json(invoiceData);
  } catch (err) {
    console.error("❌ Error in getInvoiceById:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
