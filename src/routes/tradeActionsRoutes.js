import express from "express";
import {
  addTradeAction,
  getTradeActions,
} from "../controllers/tradeActionsController.js";

const router = express.Router();

// ✅ Matches frontend: /api/trades/:tradeId/actions
router.post("/:tradeId/actions", addTradeAction);
router.get("/:tradeId/actions", getTradeActions);

export default router;
