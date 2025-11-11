 import express from "express";
import {
  createKyc,
  getAllKycs,
  updateKyc,
} from "../controllers/kycController.js";

const router = express.Router();

router.post("/create", createKyc);       
router.get("/all", getAllKycs);      
router.put("/update/:id", updateKyc);    

export default router;
