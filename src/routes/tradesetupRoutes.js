// routes/tradeSetupRoutes.js
import express from "express";
import {
  createTradeSetup,
  getAllTradeSetups,
  getTradeSetupById,
  deleteTradeSetup,
} from "../controllers/tradesetupController.js";

const router = express.Router();

router.post("/", createTradeSetup);
router.get("/", getAllTradeSetups);
router.get("/:id", getTradeSetupById);
router.delete("/:id", deleteTradeSetup);

export default router;
