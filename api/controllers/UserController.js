import UserService from "../service/UserService.js";
import { customErrorHandler, customSuccessHandler } from "../utils/error.js";

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

export default { createUser };
