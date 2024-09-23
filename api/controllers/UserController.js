import UserService from "../service/UserService.js";
import bcryptjs from "bcryptjs";

import { customErrorHandler } from "../utils/error.js";

const createUser = async (req, res, next) => {
  const { userName, email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userName || !email || !password) {
    return customErrorHandler(res, 400, "Vui lòng nhập đầy đủ thông tin.");
  }

  try {
    // Gọi service để tạo người dùng
    const response = await UserService.createUserService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    // Xử lý lỗi từ service
    return customErrorHandler(
      res,
      500,
      error.message || "Đã xảy ra lỗi khi tạo người dùng."
    );
  }
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;
  // Kiểm tra dữ liệu đầu vào
  if (!email || !password || email === null || password === null) {
    return customErrorHandler(
      res,
      400,
      "Vui lòng nhập đầy đủ tài khoản và mật khẩu."
    );
  }
  try {
    // Gọi service để lấy dữ liệu người dùng
    const response = await UserService.signInUser(req.body);
    const { validUser } = response;
    const access_token = validUser?.user?.access_token;
    // Xử lý khi đăng nhập thành công
    res.cookie("access_token", access_token, {
      httpOnly: true, // Sửa "HttpOnly" thành "httpOnly"
      secure: false, // Đặt true nếu bạn đang chạy trên HTTPS
      sameSite: "strict",
    });
    return res.status(200).json(response);
  } catch (error) {
    // Xử lý lỗi từ service
    return customErrorHandler(
      res,
      500,
      error.message || "Đã xảy ra lỗi khi lấy dữ liệu người dùng."
    );
  }
};

const signInGoogle = async (req, res) => {
  const { userName, email, avatar } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userName || !email || !avatar) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
  }
  try {
    // Gọi service để tạo người dùng
    const response = await UserService.signInGoogle(req.body);
    return res.status(200).json(response);
  } catch (error) {
    // Xử lý lỗi từ service
    return customErrorHandler(
      res,
      500,
      error.message || "Đã xảy ra lỗi khi tạo người dùng."
    );
  }
};

const updateUser = async (req, res, next) => {
  // Kiểm tra quyền truy cập
  if (req.user.id !== req.params.userId) {
    return next(customErrorHandler(res, 400, "Không có quyền được sửa"));
  }

  // Kiểm tra và mã hóa mật khẩu nếu có
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        customErrorHandler(res, 400, "Mật khẩu phải có ít nhất 6 ký tự")
      );
    }
    req.body.password = await bcryptjs.hash(req.body.password, 10); // Mã hóa mật khẩu
  }

  // Kiểm tra userName
  if (req.body.userName) {
    if (req.body.userName.length < 7 || req.body.userName.length > 20) {
      return next(
        customErrorHandler(
          res,
          400,
          "Tài khoản ít nhất 7 ký tự và 20 ký tự trở xuống"
        )
      );
    }
    if (req.body.userName.includes(" ")) {
      return next(
        customErrorHandler(res, 400, "Tài khoản không chứa khoảng trống")
      );
    }
    if (req.body.userName !== req.body.userName.toLowerCase()) {
      return next(
        customErrorHandler(res, 400, "Tài khoản chỉ chứa chữ cái và số")
      );
    }
    if (!/^[a-zA-Z0-9]+$/.test(req.body.userName)) {
      return next(
        customErrorHandler(res, 400, "Tài khoản chỉ chứa chữ cái và số")
      );
    }
  }
  // Cập nhật thông tin người dùng vào cơ sở dữ liệu (giả định bạn có model User)
  try {
    const userData = req.body; // Lấy dữ liệu từ body
    const userId = req.params.userId; // Lấy userId từ params
    // Kết hợp userId vào userData
    const updatedUserData = { userId, ...userData };

    const updateUser = await UserService.updateUser(updatedUserData);
    console.log("Updated user", updateUser);

    return res.status(200).json(updateUser);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Lỗi khi cập nhật người dùng"));
  }
};
export default { createUser, signInUser, signInGoogle, updateUser };
