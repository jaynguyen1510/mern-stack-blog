import User from "../Model/UserModel.js";
import bcryptJs from "bcryptjs";

const createUserService = async (userData) => {
  const { userName, email, password } = userData;
  // Kiểm tra dữ liệu đầu vào
  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return {
      status: "ERR",
      message: "Vui lòng nhập đầy đủ thông tin bắt buộc",
    };
  }
  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcryptJs.hash(password, 10);
    // Tạo người dùng mới
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();
    // Trả về kết quả thành công
    return {
      status: "OK",
      message: "Tạo tài khoản thành công",
    };
  } catch (error) {
    // Xử lý lỗi
    console.error("Error creating user:", error);
    return {
      status: "ERR",
      message: "Có lỗi xảy ra khi tạo tài khoản",
    };
  }
};

export default { createUserService };
