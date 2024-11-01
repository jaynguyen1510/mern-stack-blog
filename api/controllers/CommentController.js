import { customErrorHandler } from "../utils/error.js";
import CommentService from "../service/CommentService.js";

const createComment = async (req, res, next) => {
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

const getComment = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const commentResponse = await CommentService.getComment(postId);
    return res.status(200).json(commentResponse);
  } catch (error) {
    return next(
      customErrorHandler(res, 500, "Không thể tải bình luận cho bài viết")
    );
  }
};
const getAllCommentForAdmin = async (req, res, next) => {
  try {
    const commentResponse = await CommentService.getAllCommentForAdmin(req);
    return res.status(200).json(commentResponse);
  } catch (error) {
    return next(
      customErrorHandler(res, 500, "Không thể tải danh sách bình luận")
    );
  }
};
const likeComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;

  if (!commentId) {
    return {
      status: "ERR",
      success: false,
      message: "Id bình luận không hợp lệ.",
    };
  }
  const total = { commentId, userId };
  try {
    const likeResponse = await CommentService.likeComment(total);
    return res.status(200).json(likeResponse);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Lỗi không thể put like "));
  }
};

const editComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;
  const isAdmin = req.user.isAdmin;
  const content = req.body.content;

  if (!commentId) {
    return {
      status: "ERR",
      success: false,
      message: "Id bình luận không hợp lệ.",
    };
  }
  const total = { commentId, userId, isAdmin, content };
  try {
    const likeResponse = await CommentService.editComment(total);
    return res.status(200).json(likeResponse);
  } catch (error) {
    return next(
      customErrorHandler(res, 500, "Lỗi không thể chỉnh sửa comment")
    );
  }
};
const deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;
  const isAdmin = req.user.isAdmin;

  if (!commentId) {
    return {
      status: "ERR",
      success: false,
      message: "Id bình luận không hợp lệ.",
    };
  }
  const total = { commentId, userId, isAdmin };

  try {
    const responseDeleteComment = await CommentService.deleteComment(total);
    return res.status(200).json(responseDeleteComment);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Lỗi không thể xóa comment"));
  }
};
export default {
  createComment,
  getComment,
  likeComment,
  editComment,
  deleteComment,
  getAllCommentForAdmin,
};
