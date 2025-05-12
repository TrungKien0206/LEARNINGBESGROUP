import { GetCurrentDate } from "./dateUtil.js";

export const RandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 số ngẫu nhiên
};

export const GetExpiredOtp = () => {
  const time = GetCurrentDate(); // Trả về Date
  time.setMinutes(time.getMinutes() + 5); // Thêm 5 phút
  return time;
};
