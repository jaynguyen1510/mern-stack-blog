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
  const { email, password } = userData;
  try {
    const validUser = await User.findOne({ email: email });
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
      validUser: {
        user: {
          ...rest, // Giữ lại các thông tin từ đối tượng rest
          access_token: access_token, // Thêm access_token vào bên trong đối tượng user
        },
      }, // Trả về thông tin người dùng đã loại bỏ password
    };
  } catch (error) {
    return {
      status: "ERR",
      success: false,
      message: error.message || "Lỗi khi lấy dữ liệu người dùng",
    };
  }
};

const signInGoogle = async (userData) => {
  const { userName, email, avatar } = userData;
  try {
    const userGoogle = await User.findOne({ email });
    if (userGoogle) {
      const access_token = await jwtService.generalAccessToken({
        id: userGoogle._id,
      });
      const { password, ...rest } = userGoogle._doc;
      return {
        status: "OK",
        success: true,
        message: "Đăng nhập thành công",
        userGoogle: {
          user: {
            ...rest, // Giữ lại các thông tin từ đối tượng rest
            access_token: access_token, // Thêm access_token vào bên trong đối tượng user
          },
        }, // Trả về thông tin người dùng đã loại bỏ password
      };
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptJs.hashSync(generatedPassword, 10);
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        avatar,
      });

      await newUser.save();
      const access_token = await jwtService.generalAccessToken({
        id: newUser._id,
      });
      const { password, ...rest } = newUser._doc;
      return {
        status: "OK",
        success: true,
        message: "Đăng nhập thành công",
        userGoogle: {
          user: {
            ...rest, // Giữ lại các thông tin từ đối tượng rest
            access_token: access_token, // Thêm access_token vào bên trong đối tượng user
          },
        }, // Trả về thông tin người dùng đã loại bỏ password
      };
    }
  } catch (error) {
    return {
      status: "ERR",
      success: false,
      message: error.message || "Lỗi khi tạo người dùng",
    };
  }
};
export default { createUserService, signInUser, signInGoogle };
