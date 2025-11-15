// import Client from "../models/clientModel.js";
// import { InvoiceCounter } from "../models/invoiceCounter.js";

// // Helper to get next serial safely
// const getNextSerial = async () => {
//   const today = new Date();
//   const dayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

//   const counter = await InvoiceCounter.findOneAndUpdate(
//     { date: dayStr },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );

//   return String(counter.seq).padStart(5, "0"); // 00001, 00002, ...
// };

// export const getInvoiceById = async (req, res) => {
//   try {
//     const client = await Client.findOne({ clientId: req.params.clientId });

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     // 🧾 GST Logic — amount is INCLUSIVE of 18%
//     const totalAmount = client.amount;
//     const gstRate = 0.18;
//     const baseAmount = totalAmount / (1 + gstRate); // taxable value
//     let gstBreakup = {};

//     if (client.state?.toLowerCase() === "chhattisgarh") {
//       const cgst = baseAmount * 0.09;
//       const sgst = baseAmount * 0.09;
//       gstBreakup = {
//         type: "CGST + SGST",
//         cgst: parseFloat(cgst.toFixed(2)),
//         sgst: parseFloat(sgst.toFixed(2)),
//         totalTax: parseFloat((cgst + sgst).toFixed(2)),
//       };
//     } else {
//       const igst = baseAmount * 0.18;
//       gstBreakup = {
//         type: "IGST",
//         igst: parseFloat(igst.toFixed(2)),
//         totalTax: parseFloat(igst.toFixed(2)),
//       };
//     }
//     let invoiceNumber = client.invoiceId;

//     // If no invoiceId, generate one
//     if (!invoiceNumber) {
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = now
//         .toLocaleString("en-US", { month: "short" })
//         .toUpperCase();
//       const day = String(now.getDate()).padStart(2, "0");
//       const serialNumber = await getNextSerial();

//       const invoiceNumber = `INV/${year}/${month}/${day}/${serialNumber}`;
//       client.invoiceId = invoiceNumber;
//       await client.save();
//     }

//     // 🧾 Invoice data
//     const invoiceData = {
//       id: invoiceNumber,
//       clientName: client.name,
//       date: new Date(client.createdAt).toISOString().split("T")[0],
//       gstin: process.env.COMPANY_GSTIN,
//       companyAddress:
//         "H NO 236 WARD NO 12 PALAUD, NAYA RAIPUR RAIPUR, RAIPUR, CHHATTISGARH, 492101",
//       items: [
//         {
//           description: `${client.subscription} Plan (${client.planType})`,
//           amount: parseFloat(baseAmount.toFixed(2)),
//         },
//       ],
//       taxRate: gstRate,
//       totalAmount: parseFloat(totalAmount.toFixed(2)),
//       gstBreakup,
//       method: client.method || "Unknown",
//       status: client.status || "Pending",
//       email: client.email,
//       phone: client.phone,
//       state: client.state,
//       razorpayOrderId: client.razorpayOrderId,
//       razorpayPaymentId: client.razorpayPaymentId,
//     };

//     res.status(200).json(invoiceData);
//   } catch (err) {
//     console.error("❌ Error in getInvoiceById:", err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

import Client from "../models/clientModel.js";
import { InvoiceCounter } from "../models/invoiceCounter.js";

// Helper function to generate next serial
const getNextSerial = async () => {
  const today = new Date();
  const dayStr = today.toISOString().split("T")[0];

  const counter = await InvoiceCounter.findOneAndUpdate(
    { date: dayStr },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return String(counter.seq).padStart(5, "0");
};

export const getInvoiceById = async (req, res) => {
  try {
    const client = await Client.findOne({ clientId: req.params.clientId });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // GST calculation (inclusive of 18%)
    const totalAmount = client.amount;
    const gstRate = 0.18;
    const baseAmount = totalAmount / (1 + gstRate);

    let gstBreakup = {};

    if (client.state?.toLowerCase() === "chhattisgarh") {
      // CGST + SGST
      const cgstAmount = baseAmount * 0.09;
      const sgstAmount = baseAmount * 0.09;

      gstBreakup = {
        type: "CGST + SGST",
        cgstRate: "9%",
        sgstRate: "9%",
        cgstAmount: parseFloat(cgstAmount.toFixed(2)),
        sgstAmount: parseFloat(sgstAmount.toFixed(2)),
        totalTax: parseFloat((cgstAmount + sgstAmount).toFixed(2)),
      };
    } else {
      // IGST
      const igstAmount = baseAmount * 0.18;

      gstBreakup = {
        type: "IGST",
        igstRate: "18%",
        igstAmount: parseFloat(igstAmount.toFixed(2)),
        totalTax: parseFloat(igstAmount.toFixed(2)),
      };
    }

    // Invoice number reuse or generate
    let invoiceNumber = client.invoiceId;

    if (!invoiceNumber) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      const day = String(now.getDate()).padStart(2, "0");
      const serialNumber = await getNextSerial();

      invoiceNumber = `INV/${year}/${month}/${day}/${serialNumber}`;

      client.invoiceId = invoiceNumber;
      await client.save();
    }

    // Final Response
    const invoiceData = {
      id: invoiceNumber,
      clientName: client.name,
      date: new Date(client.createdAt).toISOString().split("T")[0],
      companyAddress:
        "H NO 236 WARD NO 12 PALAUD, NAYA RAIPUR RAIPUR, RAIPUR, CHHATTISGARH, 492101",

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

    return res.status(200).json(invoiceData);
  } catch (err) {
    console.error("❌ Error in getInvoiceById:", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};
