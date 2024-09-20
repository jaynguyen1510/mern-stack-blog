// service/UserService.js
import User from "../Model/UserModel.js";
import bcryptJs from "bcryptjs";
import jwtService from "../service/jwtService.js";
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
const signInUser = async (userData, res) => {
  const { userName, email, password } = userData;
  try {
    const validUser = await User.findOne({ userName: userName, email: email });
    if (!validUser) {
      return {
        status: "ERR",
        success: false,
        message: "Tài khoản không tồn tại",
      };
    }
    const validPassword = bcryptJs.compareSync(password, validUser.password);
    if (!validPassword) {
      return {
        status: "ERR",
        success: false,
        message: "Mật khẩu không đúng",
      };
    }
    const access_token = await jwtService.generalAccessToken({
      id: validUser._id,
    });
    const { password: pass, ...rest } = validUser._doc;
    return {
      status: "OK",
      success: true,
      message: "Đăng nhập thành công",
      validUser: rest, // Trả về thông tin người dùng đã loại bỏ password
    };
  } catch (error) {
    return {
      status: "ERR",
      success: false,
      message: error.message || "Lỗi khi lấy dữ liệu người dùng",
    };
  }
};
export default { createUserService, signInUser };
