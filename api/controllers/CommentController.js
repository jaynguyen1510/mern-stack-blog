import { customErrorHandler } from "../utils/error.js";
import CommentService from "../service/CommentService.js";

const createComment = async (req, res, next) => {
  console.log("createComment", req.body);

  // Lấy dữ liệu từ request
  const { content } = req.body; // Giả sử content là một chuỗi
  const userId = req.user.id; // Lấy userId từ req.user (người dùng đã xác thực)
  const postId = req.params.postId; // Lấy postId từ params

  console.log("createComment", content, userId, postId);

  if (userId !== req.user.id) {
    return {
      status: "ERR",
      success: false,
      message: "Bạn không có quyền tạo bình luận cho bài viết của mình.",
    };
  }
  // Chuẩn bị dữ liệu bình luận
  const commentData = { content, postId, userId }; // Không cần spread nếu là các giá trị đơn lẻ

  try {
    const commentResponse = await CommentService.createComment(commentData);
    return res.status(200).json(commentResponse);
  } catch (error) {
    return next(
      customErrorHandler(res, 500, "Không thể tạo bình luận cho bài viết")
    );
  }
};
export default { createComment };
