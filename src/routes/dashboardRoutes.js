import express from "express";
import { getDashboardStats } from "../controllers/dashboardController";

const router = express.Router();

// GET /api/dashboard
router.get("/", getDashboardStats);

export default router;
