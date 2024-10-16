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
      isAdmin: validUser.isAdmin,
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
        isAdmin: userGoogle.isAdmin,
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
        isAdmin: newUser.isAdmin,
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

const updateUser = async (userData) => {
  const updatedUser = await User.findByIdAndUpdate(
    userData.userId,
    {
      $set: {
        userName: userData.userName,
        email: userData.email,
        avatar: userData.avatar,
        password: userData.password,
      },
    },
    { new: true }
  );
  const { password, ...rest } = updatedUser._doc;
  return {
    status: "OK",
    success: true,
    message: "Cập nhật thông tin thành công",
    user: {
      ...rest, // Giữ lại các thông tin từ đối tượng rest
    }, // Trả về thông tin người dùng đã loại bỏ password
  };
};
const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  return {
    status: "OK",
    success: true,
    message: "Người dùng đã được xóa",
    deletedUser,
  };
};

const getAllUsers = async (userId) => {
  const isAdmin = userId.user.isAdmin;
  if (!isAdmin) {
    return {
      status: "ERR",
      success: false,
      message: "Bạn không có quyền truy cập dữ liệu người dùng",
    };
  }

  try {
    const startIndex = parseInt(userId.query.startIndex) || 0;
    const limit = parseInt(userId.query.limit) || 2;
    const sorDirection = userId.query.sort === "asc" ? 1 : -1;
    const getAllUser = await User.find({})
      .sort({ createdAt: sorDirection })
      .skip(startIndex)
      .limit(limit);
    const totalUser = await User.countDocuments();
    const timeNow = new Date();
    const oneMonthAgo = new Date(
      timeNow.getFullYear(),
      timeNow.getMonth() - 1,
      timeNow.getDate()
    );
    const lasMontCreateUser = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const userWithoutPassword = getAllUser.map((user) => {
      const { password, ...rests } = user._doc;
      return rests;
    });

    return {
      status: "OK",
      success: true,
      message: "Lấy danh sách người dùng thành công!",
      dataAllUser: {
        data: userWithoutPassword,
        totalUser: totalUser,
        lasMontCreateUser: lasMontCreateUser,
      },
    };
  } catch (error) {
    return {
      status: "ERR",
      success: false,
      message: error.message || "Lỗi khi lấy dữ liệu người dùng",
    };
  }
};

const getUserById = async (userId) => {
  try {
    const userById = await User.findById(userId);
    if (!userById) {
      return {
        status: "ERR",
        success: false,
        message: "Người dùng không tồn tại",
      };
    }
    const { password, ...rest } = userById._doc;
    return {
      status: "OK",
      success: true,
      message: "Lấy thông tin người dùng thành công",
      userById: rest, // Trả về thông tin người dùng đã loại bỏ password
    };
  } catch (error) {
    return {
      status: "ERR",
      success: false,
      message: error.message || "Lỗi khi lấy thông tin người dùng",
    };
  }
};
export default {
  createUserService,
  signInUser,
  signInGoogle,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
