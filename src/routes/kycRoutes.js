 import express from "express";
import {
  createKyc,
  getAllKycs,
  updateKyc,
  getKycByPanNumber
} from "../controllers/kycController.js";

const router = express.Router();

router.post("/create", createKyc);       
router.get("/all", getAllKycs);          
router.put("/update/:id", updateKyc);   
router.get("/pan/:pan_number", getKycByPanNumber); 

export default router;
