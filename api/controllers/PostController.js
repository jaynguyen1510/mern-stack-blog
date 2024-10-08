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
  if (!body.title || !body.content) {
    return res.status(200).json({
      status: "ERR",
      success: false,
      message: "Có vẻ như tiêu đề hoặc nội dung của bạn bị thiếu.",
    });
  }
  if (!body.category) {
    return res.status(200).json({
      status: "ERR",
      success: false,
      message: "Bài viết của bạn nên có danh mục",
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
const getAllPost = async (req, res, next) => {
  try {
    const postResponse = await PostService.getAllPosts(req);
    return res.status(200).json(postResponse);
  } catch (error) {
    return next(
      customErrorHandler(res, 500, "Không thể lấy danh sách bài viết")
    );
  }
};
const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const userIdFormParams = req.params.userId;
  const idFormUser = req.user.id;
  const isAdmin = req.user.isAdmin;

  console.log("delete post", postId, userIdFormParams);

  const result = { userIdFormParams, postId, idFormUser, isAdmin }; // Gộp postId và userId

  try {
    const postResponse = await PostService.deletePost(result);
    return res.status(200).json(postResponse);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Không thể xóa bài viết"));
  }
};

const updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const userIdFormParams = req.params.userId;
  const { title, content, category, image } = req.body;
  const isAdmin = req.user.isAdmin;
  const idFormUser = req.user.id;
  const result = {
    userIdFormParams,
    postId,
    idFormUser,
    isAdmin,
    title,
    content,
    category,
    image,
  }; // Gộp postId và userId
  try {
    const updatePostResponse = await PostService.updatePost(result);
    return res.status(200).json(updatePostResponse);
  } catch (error) {
    return next(customErrorHandler(res, 500, "Không thể cập nhật bài viết"));
  }
};
export default { createPost, getAllPost, deletePost, updatePost };
