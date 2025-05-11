// util/otpUtil.js
import { GetCurrentDate } from "./dateUtil.js";

export const RandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Trả về chuỗi 6 chữ số
};

export const GetExpiredOtp = () => {
  const time = GetCurrentDate(); // Giả sử trả về một đối tượng Date
  const expireTime = time.setMinutes(time.getMinutes() + 5); // Thêm 5 phút, trả về timestamp mili giây
  return expireTime;
};
