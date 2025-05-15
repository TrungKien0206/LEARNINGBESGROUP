import mongoose from "mongoose";

const fileShema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("File", fileShema);
