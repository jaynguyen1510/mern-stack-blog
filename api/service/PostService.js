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
    const startIndex = parseInt(getAllDataPost.params.startIndex) || 0;
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
      data: getAllPosts,
      totalPost: totalPost,
      lastMonthPost: lastMonthPost,
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

export default { createPost, getAllPosts };
