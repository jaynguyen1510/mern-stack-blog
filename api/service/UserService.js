// service/UserService.js
import User from "../Model/UserModel.js";
import bcryptJs from "bcryptjs";

const createUserService = async (userData) => {
  const { userName, email, password } = userData;

  try {
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return {
        status: "ERR",
        success: false,
        message: "Tên người dùng hoặc email đã tồn tại",
      };
    }

    const hashedPassword = await bcryptJs.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    return {
      status: "OK",
      success: true,
      message: "Tạo tài khoản thành công.",
    };
  } catch (error) {
    return {
      status: "ERR",
      success: false,
      message: error.message || "Lỗi khi tạo người dùng",
    };
  }
};

export default { createUserService };
