import express from "express";
import {
  createTrade,
  getAllTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
  updateTradeStatus
} from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", createTrade);         // Add new trade
router.get("/", getAllTrades);         // Get all trades
router.get("/:id", getTradeById);      // Get single trade
router.put("/:id", updateTrade);  
router.patch("/:id/status", updateTradeStatus); // Update trade status
     // Update trade
router.delete("/:id", deleteTrade);    // Delete trade

export default router;
