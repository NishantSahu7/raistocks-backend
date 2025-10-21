// routes/subscriptionRoutes.js
import express from "express";
import {
  createSubscriptionOrder,
  verifyPayment,
} from "../controllers/subscriptionController.js";

const router = express.Router();

// POST: Create subscription order
router.post("/create-order", createSubscriptionOrder);

// POST: Verify payment (creates/updates client)
router.post("/verify-payment", verifyPayment);

export default router;
