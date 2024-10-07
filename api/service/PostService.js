import Post from "../Model/PostModel.js";

const createPost = async (dataPost) => {
  console.log("Creating post", dataPost); // In ra dữ liệu bài viết đang được tạo

  try {
    // Giải nén userId và các thuộc tính khác từ dataPost
    const { userId, title } = dataPost;

    // Kiểm tra xem tiêu đề (không phân biệt chữ hoa chữ thường) đã tồn tại trong cơ sở dữ liệu chưa
    const existingPost = await Post.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingPost) {
      return {
        status: "ERR",
        success: false,
        message: "Bài viết đã tồn tại.",
      }; // Trả về thông báo nếu bài viết đã tồn tại
    }

    // Tạo slug từ tiêu đề bài viết
    const slug = title
      .split(" ") // Chia chuỗi thành mảng bằng cách sử dụng khoảng trắng làm dấu phân cách
      .join("-") // Kết hợp các phần tử trong mảng lại với nhau bằng dấu '-'
      .toLowerCase() // Chuyển tất cả các ký tự thành chữ thường
      .replace(/[^a-z0-9-]/g, "-"); // Loại bỏ tất cả ký tự không phải là chữ cái, số hoặc dấu '-', thay thế chúng bằng '-'

    // Tạo một đối tượng bài viết mới với slug
    const newPost = new Post({
      ...dataPost, // Sao chép tất cả các thuộc tính từ dataPost
      slug, // Thêm slug vào đối tượng
      userId: userId,
    });

    // Lưu bài viết vào cơ sở dữ liệu
    await newPost.save();
    return {
      status: "OK",
      success: true,
      message: "Bài viết đã được tạo thành công!",
      data: newPost, // Trả về thông tin bài viết đã tạo
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi tạo bài viết: " + error.message, // Trả về thông báo lỗi chi tiết
    };
  }
};

const getAllPosts = async (getAllDataPost) => {
  try {
    const startIndex = parseInt(getAllDataPost.query.startIndex) || 0;
    console.log("Backend Start Index:", startIndex); // Đảm bảo rằng giá trị này được in ra

    const limit = parseInt(getAllDataPost.query.limit) || 9;
    const sorDirection = getAllDataPost.query.order === "asc" ? 1 : -1;
    const getAllPosts = await Post.find({
      ...(getAllDataPost.query.userId && {
        userId: getAllDataPost.query.userId,
      }),
      ...(getAllDataPost.query.category && {
        category: getAllDataPost.query.category,
      }),
      ...(getAllDataPost.query.slug && {
        slug: getAllDataPost.query.slug,
      }),
      ...(getAllDataPost.query.postId && {
        _id: getAllDataPost.query.postId,
      }),
      ...(getAllDataPost.query.searchTerm && {
        $or: [
          {
            title: { $regex: getAllDataPost.query.searchTerm, $option: "i" },
          },
          {
            content: { $regex: getAllDataPost.query.searchTerm, $option: "i" },
          },
        ],
      }),
    })
      .sort({ updatedAt: sorDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPost = await Post.countDocuments();
    const timeNow = new Date();
    const oneMonthAgo = new Date(
      timeNow.getFullYear(),
      timeNow.getMonth() - 1,
      timeNow.getDate()
    );

    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return {
      status: "OK",
      success: true,
      message: "Lấy danh sách bài viết thành công!",
      dataPost: {
        data: getAllPosts,
        totalPost: totalPost,
        lastMonthPost: lastMonthPost,
      },
    };
  } catch (error) {
    console.error("Error getting all posts:", error);
    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi lấy danh sách bài viết: " + error.message,
    };
  }
};

const deletePost = async (fromId) => {
  // Tách postId và userId
  const { userIdFromParams, postId, idFromUser, isAdmin } = fromId;
  try {
    if (userIdFromParams !== idFromUser || !isAdmin || postId === null) {
      return {
        status: "ERR",
        success: false,
        message: "Bạn không có quyền xóa bài viết này!",
      };
    } else {
      const deletedPostFromId = await Post.findByIdAndDelete(postId);
      if (deletedPostFromId === null) {
        return {
          status: "ERR",
          success: false,
          message: "Bài viết không tồn tại hoặc đã bị xóa rồi!",
        };
      }
      return {
        status: "OK",
        success: true,
        message: "Bạn đã xóa bài viết này!",
        deletedPostFromId,
      };
    }
  } catch (error) {
    console.error("Error getting all posts:", error);
    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi xóa danh sách bài viết: " + error.message,
    };
  }
};

const updatePost = async (updatedPostData) => {
  const {
    userIdFormParams,
    idFormUser,
    isAdmin,
    postId,
    title,
    content,
    category,
    image,
  } = updatedPostData;
  console.log("Updating post", isAdmin, idFormUser, userIdFormParams);

  if (!isAdmin || idFormUser !== userIdFormParams) {
    return {
      status: "ERR",
      success: false,
      message: "Bạn không có quyền cập nhật bài viết này!",
    };
  }
  try {
    const updateNewPost = await Post.findByIdAndUpdate(
      postId, // ID của bài viết bạn muốn cập nhật
      {
        $set: {
          // Cập nhật các trường trong bài viết
          title: title, // Cập nhật trường "title" với giá trị mới
          content: content, // Cập nhật trường "content" với giá trị mới
          category: category, // Cập nhật trường "category" với giá trị mới
          image: image, // Cập nhật trường "image" với giá trị mới
        },
      },
      { new: true } // Tùy chọn này yêu cầu trả về tài liệu đã cập nhật
    );
    return {
      status: "OK",
      success: true,
      message: "Bài viết đã được cập nhật thành công!",
      data: updateNewPost, // Trả về bài viết đã được cập nhật
    };
  } catch (error) {
    console.error("Error getting all posts:", error);
    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi cập nhật danh sách bài viết: " + error.message,
    };
  }
};

export default { createPost, getAllPosts, deletePost, updatePost };
