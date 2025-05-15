import File from "../models/file.model.js";

class AttachmentController {
  async uploadToLocal(req, res, netx) {
    const file = await File.create({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
    });
    return res.status(201).json(file);
  }

  async uploadToCloud(req, res, next) {
    const file = await File.create({
      filename: req.file.originalname,
      url: req.file.path,
      cloudinaryId: req.file.filename,
    });
    return res.status(201).json(file);
  }
}
