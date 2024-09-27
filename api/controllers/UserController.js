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
    console.log("access_token", access_token);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false, // Đặt true nếu chạy trên HTTPS
      sameSite: "strict", // Hoặc 'none' nếu cần
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
    const { userGoogle } = response;
    const access_token = userGoogle?.user?.access_token;
    // Xử lý khi đăng nhập thành công
    console.log("access_token", access_token);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false, // Đặt true nếu chạy trên HTTPS
      sameSite: "strict", // Hoặc 'none' nếu cần
    });

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
  // Check access permissions
  if (req.user.id !== req.params.userId) {
    return res
      .status(403)
      .json({ status: "ERR", message: "Không có quyền được sửa" });
  }
  // Check and hash password if provided
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }
    req.body.password = await bcryptjs.hash(req.body.password, 10); // Hash the password
  }
  // Check userName
  if (req.body.userName) {
    if (req.body.userName.length < 7 || req.body.userName.length > 20) {
      return res.status(200).json({
        status: "ERR",
        message: "Tài khoản ít nhất 7 ký tự và 20 ký tự trở xuống",
      });
    }
    if (req.body.userName.includes(" ")) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Tài khoản không chứa khoảng trống" });
    }
    if (req.body.userName !== req.body.userName.toLowerCase()) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Tài khoản chỉ chứa chữ cái và số" });
    }
    if (!/^[a-zA-Z0-9]+$/.test(req.body.userName)) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Tài khoản chỉ chứa chữ cái và số" });
    }
  }
  // Update user information in the database (assuming you have a User model)
  try {
    const userData = req.body; // Get data from body
    const userId = req.params.userId; // Get userId from params
    // Combine userId into userData
    const updatedUserData = { userId, ...userData };

    const updateUser = await UserService.updateUser(updatedUserData);
    console.log("Updated user", updateUser);

    return res.status(200).json(updateUser);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Lỗi khi cập nhật người dùng"));
  }
};

const deleteUser = async (req, res, next) => {
  // kiểm tra người dùng
  if (req.user.id !== req.params.userId) {
    return res
      .status(403)
      .json({ status: "ERR", message: "Không có quyền được xóa" });
  }
  try {
    // 2. Get userId from params
    const userId = req.params.userId;

    // 3. Call the UserService to delete the user
    const deletedUser = await UserService.deleteUser(userId);

    // 4. Check if the user was found and deleted
    if (!deletedUser) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Người dùng không tồn tại" });
    }
    // 5. Successful deletion response
    return res.status(200).json(deletedUser);
  } catch (error) {
    // 6. Error handling
    return next(customErrorHandler(res, 500, "Lỗi khi xóa người dùng"));
  }
};

const logOutUser = async (req, res, next) => {
  try {
    // Xóa cookie 'access_token' bằng cách thiết lập lại với Max-Age=0
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false, // Đặt true nếu chạy trên HTTPS
      sameSite: "strict", // Hoặc 'none' nếu cần trên cross-site requests
      path: "/", // Đảm bảo path là '/' nếu cookie được thiết lập với path này
      // domain: "localhost", // Không cần nếu cookie không có domain
    });
    // Trả về phản hồi thành công
    res.status(200).json({
      status: "OK",
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(customErrorHandler(res, 500, "Lỗi khi xóa token"));
  }
};
export default {
  createUser,
  signInUser,
  signInGoogle,
  updateUser,
  logOutUser,
  deleteUser,
};
