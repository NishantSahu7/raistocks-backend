import express from "express";
import { loginClient, logoutClient,sendLoginOtp,verifyOtpAndLogin } from "../controllers/clientAuthController.js";

const router = express.Router();

// router.post("/login", loginClient);
router.post("/sendOtp", sendLoginOtp);
router.post("/verifyOtp", verifyOtpAndLogin);

router.post("/logout", logoutClient);

export default router;
