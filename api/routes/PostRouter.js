import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import PostController from "../controllers/PostController.js";

const router = express.Router();

router.post("/create-post", verifyToken, PostController.createPost);

export default router;