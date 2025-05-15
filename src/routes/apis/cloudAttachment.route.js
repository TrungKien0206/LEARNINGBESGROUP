import { uploadCloud } from "../../configs/cloudinary.config.js";
import AttachmentController from "../../controllers/attachment.controller.js";
import express from "express";

const router = express.Router();

router
  .route("/attachment")
  .post(
    uploadCloud.single("file"),
    AttachmentController.singleUpload.bind(AttachmentController)
  );

router
  .route("/attachments")
  .post(
    uploadCloud.array("files", 3),
    AttachmentController.multipleUpload.bind(AttachmentController)
  );

router.route("/").get(AttachmentController.getAll.bind(AttachmentController));

router
  .route("/:id")
  .get(AttachmentController.getById.bind(AttachmentController));

export default router;
