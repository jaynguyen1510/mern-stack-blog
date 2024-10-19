import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import CommentController from "../controllers/CommentController.js";
const router = express.Router();

router.post(
  "/create-comment/:postId/:userId",
  verifyToken,
  CommentController.createComment
);
router.get("/get-comment/:postId/", CommentController.getComment);
router.put(
  "/like-comment/:commentId/",
  verifyToken,
  CommentController.likeComment
);

export default router;
