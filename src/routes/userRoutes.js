import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  updatePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", protect, getUsers);
router.put("/password", protect, updatePassword);
router.post("/logout", logoutUser);

export default router;
