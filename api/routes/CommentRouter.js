import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import CommentController from "../controllers/CommentController.js";
const router = express.Router();

router.post(
  "/create-comment/:postId/:userId",
  verifyToken,
  CommentController.createComment
);
router.get("/get-comment/:postId", CommentController.getComment);
router.get(
  "/get-all-comment",
  verifyToken,
  CommentController.getAllCommentForAdmin
);
router.put(
  "/like-comment/:commentId",
  verifyToken,
  CommentController.likeComment
);
router.put(
  "/edit-comment/:commentId",
  verifyToken,
  CommentController.editComment
);
router.delete(
  "/delete-comment/:commentId",
  verifyToken,
  CommentController.deleteComment
);

export default router;
