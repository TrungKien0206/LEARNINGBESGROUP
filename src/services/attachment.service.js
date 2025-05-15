import Attachment from "../models/attachment.model.js";

class AttachmentService {
  constructor() {
    this.attachment = Attachment;
  }

  async singleUploadToLocal(file) {
    try {
      if (!file) {
        throw new Error("No file uploaded");
      }
      const newAttachment = await this.attachment.create({
        fileName: file.originalname, // sửa từ filename -> fileName
        path: file.path,
      });
      return newAttachment;
    } catch (error) {
      throw new Error(`Error uploading files: ${error.message}`);
    }
  }

  async multipleUploadToLocal(files) {
    try {
      if (!files || files.length === 0) {
        throw new Error("No attachments uploaded");
      }

      const attachments = files.map((file) => ({
        fileName: file.originalname, // sửa từ filename -> fileName
        path: file.path,
      }));

      const newAttachments = await this.attachment.insertMany(attachments);
      return newAttachments;
    } catch (error) {
      throw new Error(`Error uploading files: ${error.message}`);
    }
  }

  async getAll() {
    try {
      return await this.attachment.find();
    } catch (error) {
      throw new Error(`Error getting attachments: ${error.message}`);
    }
  }

  async singleUploadToCloud(file) {
    try {
      if (!file) {
        throw new Error("No file uploaded");
      }
      const newAttachment = await this.attachment.create({
        fileName: file.originalname,
        path: file.path,
        cloudinaryId: file.filename,
      });
      return newAttachment;
    } catch (error) {
      throw new Error(`Error uploading files: ${error.message}`);
    }
  }

  async multipleUploadToCloud(files) {
    try {
      if (!files || files.length === 0) {
        throw new Error("No attachments uploaded");
      }

      const attachments = files.map((file) => ({
        fileName: file.originalname,
        path: file.path,
        cloudinaryId: file.filename,
      }));

      return await this.attachment.insertMany(attachments);
    } catch (error) {
      throw new Error(`Error uploading files: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const attachment = await this.attachment.findById(id);
      if (!attachment) {
        throw new Error("Attachment not found");
      }
      return attachment;
    } catch (error) {
      throw new Error(`Error getting attachment: ${error.message}`);
    }
  }
}

export default new AttachmentService();
