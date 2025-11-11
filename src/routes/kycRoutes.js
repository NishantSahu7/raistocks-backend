 import express from "express";
import {
  createKyc,
  getAllKycs,
  updateKyc,
  getKycByPanNumber
} from "../controllers/kycController.js";

const router = express.Router();

router.post("/create", createKyc);       // ➕ Add new KYC
router.get("/all", getAllKycs);          // 📋 Get all KYCs
router.put("/update/:id", updateKyc);    // ✏️ Update KYC by ID
router.get("/pan/:panNumber", getKycByPanNumber); // 🔍 Get KYC by PAN number

export default router;
