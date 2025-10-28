 import express from "express";
import {
  createMarketSetup,
  getMarketSetups,
  getMarketSetupById,
  deleteMarketSetup,
} from "../controllers/marketsetupController.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "market_setups", // ✅ folder name in Cloudinary
    resource_type: "image",
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createMarketSetup);
router.get("/", getMarketSetups);
router.get("/:id", getMarketSetupById);
router.delete("/:id", deleteMarketSetup);

export default router;
