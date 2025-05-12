import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import passUtil from "../util/passUtil.js";
import { mailService } from "../configs/sendMail.config.js";
import { RandomOTP } from "../util/otpUtil.js";

class UserService {
  constructor() {
    this.user = User;
  }

  async Login(email, password) {
    try {
      const existedUser = await this.user.findOne({ email });
      if (!existedUser) throw new Error("User not found");

      const checkPass = await passUtil.compare(password, existedUser.password);
      if (!checkPass) throw new Error("Password does not match");

      const accessToken = jwt.sign(
        { id: existedUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      const refreshToken = jwt.sign(
        { id: existedUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "3d" }
      );

      return { accessToken, refreshToken };
    } catch (err) {
      throw new Error("Error logging in user: " + err.message);
    }
  }

  async Register(username, email, password) {
    try {
      const existedUser = await this.user.findOne({ email });
      if (existedUser) throw new Error("User already exists");

      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = new this.user({ username, email, password: hashedPass });
      return await newUser.save();
    } catch (err) {
      throw new Error("Error registering user: " + err.message);
    }
  }

  async GetAll() {
    try {
      return await this.user.find({});
    } catch (err) {
      throw new Error("Error retrieving users: " + err.message);
    }
  }

  async GetById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await this.user.findById(id);
  }

  async Create(userData) {
    const newUser = new this.user(userData);
    return await newUser.save();
  }

  async Update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await this.user.findByIdAndUpdate(id, updateData, { new: true });
  }

  async Delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await this.user.findByIdAndDelete(id);
  }

  async ForgotPassword(email) {
    try {
      const existedUser = await this.user.findOne({ email });
      if (!existedUser) throw new Error("User not registered yet");

      const otp = RandomOTP();
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 phút sau

      await this.user.findByIdAndUpdate(existedUser._id, {
        otp,
        otpExpire,
      });

      const mailOptions = {
        emailFrom: "SGroupResetPassword@gmail.com",
        emailTo: email,
        emailSubject: "Reset Password",
        emailText: `This is your OTP: ${otp}. It will expire in 5 minutes. If you did not request this, please ignore this email.`,
      };

      const result = await mailService.sendMail(mailOptions);
      if (!result) throw new Error("Error sending email");

      return result;
    } catch (err) {
      throw new Error("Error sending forgot pass email: " + err.message);
    }
  }

  async ResetPassword(otp, email, newPassword) {
    try {
      const user = await this.user.findOne({ email });
      if (!user) throw new Error("User not found");

      if (user.otp !== otp) throw new Error("Invalid OTP");
      if (!user.otpExpire || user.otpExpire < new Date())
        throw new Error("OTP expired");

      const hashedPass = await bcrypt.hash(newPassword, 10);
      user.password = hashedPass;
      user.otp = undefined;
      user.otpExpire = undefined;

      return await user.save();
    } catch (err) {
      throw new Error("Error resetting password: " + err.message);
    }
  }

  async ChangePassword(userId, oldPassword, newPassword) {
    try {
      const user = await this.user.findById(userId);
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error("Old password is incorrect");

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;

      return await user.save();
    } catch (err) {
      throw new Error("Error changing password: " + err.message);
    }
  }
}

export default new UserService();
