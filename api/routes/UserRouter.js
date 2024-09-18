import express from "express";
import UserController from "../controllers/UserController.js";

const router = express.Router();

router.get("/123", UserController.test);

export default router;
