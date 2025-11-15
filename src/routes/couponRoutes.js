 import express from "express";
import { createCoupon, getCoupons, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.post("/create", createCoupon);
router.get("/all", getCoupons);
router.delete("/delete/:id", deleteCoupon);

export default router;
