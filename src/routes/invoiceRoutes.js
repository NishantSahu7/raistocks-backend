import express from "express";
import { getInvoiceById } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/:clientId", getInvoiceById);

export default router;
