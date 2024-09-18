// service/UserService.js
import User from "../Model/UserModel.js";
import bcryptJs from "bcryptjs";

const createUserService = async (userData) => {
  const { userName, email, password } = userData;

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcryptJs.hash(password, 10);

    // Kiểm tra xem userName hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      throw new Error("Tên người dùng hoặc email đã tồn tại");
    }

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
      message: "Tạo tài khoản thành công.",
    };
  } catch (error) {
    // Ném lỗi để xử lý ở controller
    throw new Error(error.message || "Lỗi khi tạo người dùng");
  }
};

export default { createUserService };
