import express from "express";
import uploadLocal from "./apis/upload.route.js";
import uploadCloud from "./apis/cloudAttachment.route.js";
import userRoutes from "./apis/user.route.js";
const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/upload", uploadLocal);
routes.use("/cloud", uploadCloud);

export default routes;
