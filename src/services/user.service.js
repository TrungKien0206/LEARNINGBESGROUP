import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import passUtil from "../util/passUtil.js";

class UserService {
  constructor() {
    this.user = User;
  }

  async Login(email, password) {
    try {
      const existedUser = await this.user.findOne({ email });
      if (!existedUser) {
        throw new Error("User not found");
      }
      console.log("existedUser: ", existedUser);

      // So sánh mật khẩu đã mã hóa
      const isMatch = await passUtil.compare(password, existedUser.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Tạo access và refresh token
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

      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);

      return { accessToken, refreshToken };
    } catch (err) {
      throw new Error("Error logging in user: " + err.message);
    }
  }

  async Register(username, email, password) {
    try {
      const existedUser = await this.user.findOne({ email });
      console.log("existedUser: ", existedUser);

      if (existedUser) {
        throw new Error("User already exists");
      }

      const hashedPass = await bcrypt.hash(password, 10);
      if (!hashedPass) {
        throw new Error("Error hashing password");
      }

      const newUser = new this.user({
        username,
        email,
        password: hashedPass,
      });
      const savedUser = await newUser.save();
      console.log("savedUser: ", newUser);
      if (!savedUser) {
        throw new Error("Error saving user");
      }
      return savedUser;
    } catch (error) {
      throw new Error("Error registering user: " + error.message);
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      // Verify refreshToken
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Find the user based on the ID in the token
      const user = await this.user.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      // Create new accessToken
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      return { accessToken };
    } catch (err) {
      throw new Error("Error refreshing token: " + err.message);
    }
  }

  async GetAll() {
    try {
      return await this.user.find({});
    } catch (error) {
      throw new Error("Error retrieving users: " + error.message);
    }
  }

  async GetById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    try {
      return await this.user.findById(id);
    } catch (error) {
      throw new Error("Error retrieving user: " + error.message);
    }
  }

  async Create(userData) {
    try {
      const newUser = new this.user(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  }

  async Update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    try {
      const updatedUser = await this.user.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async Delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    try {
      const deletedUser = await this.user.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error("User not found");
      }
      return deletedUser;
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  }
}

export default new UserService();
