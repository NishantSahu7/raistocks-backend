// controllers/researchReportController.js
import ResearchReport from "../models/researchReportModel.js";

// 📄 Upload a new report
// controllers/researchReportController.js

export const uploadResearchReport = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const newReport = new ResearchReport({
      title,
      description,
      file: req.file.buffer, // Multer handles buffer
      fileType: req.file.mimetype, // Automatically sets type
      fileName: req.file.originalname,
    });

    await newReport.save();
    res
      .status(201)
      .json({
        message: "Research report uploaded successfully",
        report: newReport,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload report", error: error.message });
  }
};

// 📋 Get all reports (titles + descriptions only)
export const getAllReports = async (req, res) => {
  try {
    // include fileName and fileType so frontend can show/download correctly
    const reports = await ResearchReport.find(
      {},
      "title description createdAt fileName fileType"
    );
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

 // 📥 Download a specific report file
export const downloadReport = async (req, res) => {
  try {
    const report = await ResearchReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const fileBuffer = report.file?.buffer || report.file;

    res.set({
      "Content-Type": report.fileType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${report.fileName || "file"}"`,
    });

    res.send(fileBuffer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to download report", error: error.message });
  }
};

// 🗑️ Delete a report
export const deleteReport = async (req, res) => {
  try {
    const deleted = await ResearchReport.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete report", error: error.message });
  }
};
