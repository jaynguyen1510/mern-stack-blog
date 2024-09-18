import UserService from "../service/UserService.js";
import { customErrorHandler, customSuccessHandler } from "../utils/error.js";

const createUser = async (req, res, next) => {
  const { userName, email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return customErrorHandler(res, 400, "Vui lòng nhập đầy đủ thông tin.");
  }
  try {
    // Gọi service để tạo người dùng
    const response = await UserService.createUserService(req.body);
    // Trả về kết quả thành công
    return customSuccessHandler(res, 200, response.message, {
      userName,
      email,
    });
  } catch (error) {
    // Xử lý lỗi từ service
    return customErrorHandler(res, 400, error.message);
  }
};

export default { createUser };
