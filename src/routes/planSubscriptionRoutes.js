import express from "express";
import {
  createPlanSubscription,
  deletePlanSubscription,
  getAllPlans,
  updatePlanSubscription,
} from "../controllers/planSubscriptionController.js";

const router = express.Router();

router.post("/", createPlanSubscription);

router.get("/", getAllPlans);

router.delete("/:id", deletePlanSubscription);

router.put("/:id", updatePlanSubscription);

export default router;
