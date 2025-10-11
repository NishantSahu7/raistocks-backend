// routes/researchReportRoutes.js
import express from "express";
import multer from "multer";
import {
  uploadResearchReport,
  getAllReports,
  downloadReport,
  deleteReport,
} from "../controllers/researchReportController.js";

const router = express.Router();

// Multer setup (store files in memory to save as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadResearchReport);
router.get("/", getAllReports);
router.get("/download/:id", downloadReport);
router.delete("/:id", deleteReport);

export default router;
