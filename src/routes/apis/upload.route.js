import attachmentService from "../../services/attachment.service.js";
import { uploadLocal } from "../../configs/multer.config.js";
import express from "express";

const router = express.Router();

// POST /api/upload/attachment
router.post("/attachment", uploadLocal.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Gọi service để lưu thông tin file vào MongoDB
    const savedFile = await attachmentService.singleUploadToLocal(req.file);

    res.status(201).json({
      message: "File uploaded and saved to MongoDB successfully",
      data: savedFile,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
