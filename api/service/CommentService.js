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
export default { createComment, getComment };
