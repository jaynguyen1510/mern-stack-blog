import jwt from "jsonwebtoken";
import { customErrorHandler } from "./error.js";

import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("Verifying token: ", token);

  if (!token) {
    return next(customErrorHandler(res, 400, "Token không tồn tại."));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded; // Lưu thông tin người dùng vào req
    next(); // Chuyển tiếp đến middleware tiếp theo
  } catch (error) {
    return next(customErrorHandler(res, 403, "Token không hợp lệ."));
  }
};
