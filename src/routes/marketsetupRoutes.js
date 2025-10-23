import express from "express";
import {
  createMarketSetup,
  getMarketSetups,
  getMarketSetupById,
  deleteMarketSetup,
} from "../controllers/marketsetupController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // use the ensured directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ error: `Upload error: ${err.message}` });
  }
  next();
};

// Routes
router.post("/", upload.single("image"), handleMulterError, createMarketSetup);
router.get("/", getMarketSetups);
router.get("/:id", getMarketSetupById);
router.delete("/:id", deleteMarketSetup);

export default router;
