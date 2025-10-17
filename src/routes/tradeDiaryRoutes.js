import express from "express";
import * as tradeDiaryController from "../controllers/tradeDiaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(protect); // Temporarily disabled protection

// Create a new trade entry for the logged-in user
router.route("/").post(tradeDiaryController.createTrade);

// Get all trades for a specific user by their ID
router.get("/user/:userId", tradeDiaryController.getTradesForUser);

// Routes to update or delete a specific trade by its ID
router
  .route("/:id")
  .get(tradeDiaryController.getTradeById)
  .patch(tradeDiaryController.updateTrade)
  .delete(tradeDiaryController.deleteTrade);

export default router;
