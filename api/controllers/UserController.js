import UserService from "../service/UserService.js";
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
    const { access_token, ...newRespond } = response;
    // Xử lý khi đăng nhập thành công
    res.cookie("access_token", access_token, {
      HttpOnly: true,
      Secure: false,
      samesite: "strict",
    });
    return res.status(200).json({ ...newRespond, access_token });
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

export default { createUser, signInUser, signInGoogle };
