import express from "express";
import { createSubscriptionOrder, verifyPayment } from "../controllers/subscriptionController.js";

const router = express.Router();

// POST: Create a subscription order
router.post("/create-order", createSubscriptionOrder);

// POST: Verify payment
router.post("/verify-payment", verifyPayment);

export default router;
