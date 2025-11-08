import express from "express";
import { getDashboardStats } from "../models/dashboardController";

const router = express.Router();

// GET /api/dashboard
router.get("/", getDashboardStats);

export default router;
