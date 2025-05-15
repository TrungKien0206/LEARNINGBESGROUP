import AttachmentService from "../services/attachment.service.js";

class AttachmentController {
  constructor() {
    this.attachmentService = AttachmentService;
  }

  async singleUpload(req, res, next) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const result = await this.attachmentService.singleUploadToCloud(file); // hoặc singleUploadToLocal(file)
      return res.status(201).json(result);
    } catch (error) {
      next(new Error("Error uploading files: " + error.message));
    }
  }

  async multipleUpload(req, res, next) {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const result = await this.attachmentService.multipleUploadToCloud(files); // hoặc multipleUploadToLocal(files)
      return res.status(201).json(result);
    } catch (error) {
      next(new Error("Error uploading files: " + error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const attachments = await this.attachmentService.getAll();
      return res.status(200).json(attachments);
    } catch (error) {
      next(new Error("Error getting attachments: " + error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const attachment = await this.attachmentService.getById(id);
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      return res.status(200).json(attachment);
    } catch (error) {
      next(new Error("Error getting attachment: " + error.message));
    }
  }
}

export default new AttachmentController();
