 import express from "express";
import {
  createKyc,
  getAllKycs,
  updateKyc,
} from "../controllers/kycController.js";

const router = express.Router();

router.post("/create", createKyc);       // ➕ Add new KYC
router.get("/all", getAllKycs);          // 📋 Get all KYCs
router.put("/update/:id", updateKyc);    // ✏️ Update KYC by ID

export default router;
