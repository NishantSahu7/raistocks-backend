// models/researchReportModel.js
import mongoose from "mongoose";

const researchReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    file: {
      type: Buffer, // use Buffer instead of Binary
      required: [true, "File is required"],
    },
    fileType: {
      type: String, // e.g., "application/pdf"
      required: true,
    },
    fileName: {
      type: String, // original file name including extension
      required: true,
    },
  },
  { timestamps: true }
);

const ResearchReport = mongoose.model("ResearchReport", researchReportSchema);
export default ResearchReport;
