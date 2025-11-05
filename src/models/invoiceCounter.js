import mongoose from "mongoose";

const invoiceCounterSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // "YYYY-MM-DD"
  seq: { type: Number, default: 0 },
});

export const InvoiceCounter = mongoose.model(
  "InvoiceCounter",
  invoiceCounterSchema
);
