import express from "express";
import UserController from "../controllers/UserController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.signInUser);
router.post("/google", UserController.signInGoogle);
router.post("/log-out-user", verifyToken, UserController.logOutUser);
router.put("/update-profile/:userId", verifyToken, UserController.updateUser);
router.delete(
  "/delete-profile/:userId",
  verifyToken,
  UserController.deleteUser
);
router.get("/get-all-user", verifyToken, UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
export default router;
