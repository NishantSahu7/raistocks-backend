import express from "express";
import {
  addTradeAction,
  getTradeActions,
} from "../controllers/tradeActionsController.js";

const router = express.Router();

// ✅ Matches frontend: /api/trades/:tradeId/actions
router.post("/:tradeId", addTradeAction);
router.get("/:tradeId", getTradeActions);

export default router;
