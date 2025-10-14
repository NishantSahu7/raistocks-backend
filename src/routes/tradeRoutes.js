import express from "express";
import {
  createTrade,
  getAllTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
} from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", createTrade);         // Add new trade
router.get("/", getAllTrades);         // Get all trades
router.get("/:id", getTradeById);      // Get single trade
router.put("/:id", updateTrade);       // Update trade
router.delete("/:id", deleteTrade);    // Delete trade

export default router;
