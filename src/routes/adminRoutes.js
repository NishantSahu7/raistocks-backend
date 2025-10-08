import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

 
router.get("/", protect, adminOnly, getUsers);

 router.post("/register", protect, adminOnly, registerUser);
// router.post("/register", registerUser);


 router.post("/login", loginUser);

 router.post("/logout", logoutUser);

export default router;


// Admin TOken
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTY1MGYyZjcyNWRiYmRhZTdjYzkyMyIsInJvbGUiOiJ1c2VyIiwic3ViUm9sZSI6bnVsbCwiaWF0IjoxNzU5OTI0NDY3LCJleHAiOjE3NjA1MjkyNjd9.ni_fVVGuZBRAgTXwfogm6kUQqpN0S04Ze-dTjaTNaiU