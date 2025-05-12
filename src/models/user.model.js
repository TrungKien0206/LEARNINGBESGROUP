import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    age: { type: Number, min: 0 },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpire: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
