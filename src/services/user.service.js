import User from "../models/user.model.js";
import mongoose from "mongoose";

class UserService {
  constructor() {
    this.user = User;
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
