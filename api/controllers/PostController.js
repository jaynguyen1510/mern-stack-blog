import PostService from "../service/PostService.js";
import { customErrorHandler } from "../utils/error.js";

const createPost = async (req, res, next) => {
  const body = req.body;
  const bodyAdmin = req.user.isAdmin === true;
  const userId = req.user.id;

  // Kiểm tra quyền admin
  if (!bodyAdmin) {
    return res.status(200).json({
      status: "ERR",
      success: false,
      message: "Bạn không có quyền tạo bài viết.",
    });
  }
  if (!body.title && !body.content) {
    return res.status(200).json({
      status: "ERR",
      success: false,
      message: "Tiêu đề và nội dung bài viết không được để trống.",
    });
  }
  // Gộp userId và body vào một đối tượng mới
  const postData = { userId, ...body };

  try {
    const postResponse = await PostService.createPost(postData);
    return res.status(200).json(postResponse);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Lỗi khi tạo bài viết"));
  }
};

export default { createPost };
