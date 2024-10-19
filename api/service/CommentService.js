import Comments from "../Model/CommentsModel.js"; // Đảm bảo đường dẫn chính xác

const createComment = async (commentData) => {
  const { userId, postId, content } = commentData;

  try {
    // Tạo comment mới với từ khóa new
    const newComment = new Comments({
      userId,
      postId,
      content,
    });

    // Lưu comment vào database
    await newComment.save();

    // Trả về kết quả thành công
    return {
      status: "OK",
      success: true,
      message: "Tạo comment thành công",
      data: newComment, // Trả về thông tin comment đã tạo
    };
  } catch (error) {
    console.error("Error creating comment:", error);

    // Trả về lỗi khi tạo comment
    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi tạo comment: " + error.message, // Trả về thông báo lỗi chi tiết
    };
  }
};
const getComment = async (postId) => {
  try {
    const getComment = await Comments.find({ postId }).sort({ createdAt: -1 });
    return {
      status: "OK",
      success: true,
      message: "Lấy comment thành công",
      data: getComment, // Trả về thông tin comment đã lấy
    };
  } catch (error) {
    console.error("Error creating comment:", error);

    // Trả về lỗi khi lấy comment
    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi lấy comment: " + error.message, // Trả về thông báo lỗi chi tiết
    };
  }
};

const likeComment = async ({ commentId, userId }) => {
  try {
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return {
        status: "ERR",
        success: false,
        message: "Comment không tồn tại",
      };
    }

    const userIndex = comment.likes.indexOf(userId);
    let actionMessage;

    if (userIndex === -1) {
      // Thêm like
      comment.numberOfLikes += 1;
      comment.likes.push(userId);
      actionMessage = "Bạn đã like bình luận này";
    } else {
      // Bỏ like
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
      actionMessage = "Bạn đã bỏ like bình luận này";
    }

    await comment.save();

    return {
      status: "OK",
      success: true,
      message: actionMessage, // Trả về thông báo dựa trên hành động like/unlike
      data: comment, // Trả về thông tin comment đã thay đổi like
    };
  } catch (error) {
    console.error("Error put like:", error);

    return {
      status: "ERR",
      success: false,
      message: "Lỗi khi thực hiện hành động: " + error.message, // Trả về thông báo lỗi chi tiết
    };
  }
};

export default { createComment, getComment, likeComment };
