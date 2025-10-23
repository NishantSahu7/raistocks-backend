// middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// ✅ Ensure the uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
