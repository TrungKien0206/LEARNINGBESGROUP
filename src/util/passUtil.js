import bcrypt from "bcryptjs";

class passUtil {
  async compare(pass, hashedPass) {
    if (!pass || !hashedPass) {
      throw new Error("Password or hashed password is missing");
    }
    try {
      return await bcrypt.compare(pass, hashedPass);
    } catch (err) {
      throw new Error("Error comparing password: " + err.message);
    }
  }
}

export default new passUtil();
