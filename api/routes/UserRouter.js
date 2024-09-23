import express from "express";
import UserController from "../controllers/UserController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.signInUser);
router.post("/google", UserController.signInGoogle);
router.put("/update-profile/:userId", verifyToken, UserController.updateUser);

export default router;
