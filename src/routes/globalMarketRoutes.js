import express from "express";
import {
  createGlobalMarket,
  getGlobalMarkets,
  getGlobalMarketById,
  updateGlobalMarket,
  deleteGlobalMarket,
} from "../controllers/globalMarketController.js";

const router = express.Router();

router.post("/", createGlobalMarket);
router.get("/", getGlobalMarkets);
router.get("/:id", getGlobalMarketById);
router.put("/:id", updateGlobalMarket);
router.delete("/:id", deleteGlobalMarket);

export default router;
