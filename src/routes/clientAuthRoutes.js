import express from "express";
import { loginClient, logoutClient } from "../controllers/clientAuthController.js";

const router = express.Router();

router.post("/login", loginClient);
router.post("/logout", logoutClient);

export default router;
