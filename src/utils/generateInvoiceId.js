import moment from "moment";
import { Subscription } from "../models/subscription.js";

export const generateInvoiceId = async () => {
  const date = moment();
  const year = date.format("YYYY");
  const month = date.format("MMM").toUpperCase();
  const day = date.format("DD");

  // Count existing subscriptions for the day
  const startOfDay = date.startOf("day").toDate();
  const endOfDay = date.endOf("day").toDate();

  const countToday = await Subscription.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // Next running number
  const nextNumber = countToday + 1;
  const formattedNumber = String(nextNumber).padStart(5, "0");

  return `INV/${year}/${month}/${day}/${formattedNumber}`;
};
