import express from "express";
import UserController from "../controllers/UserController.js";

const router = express.Router();

router.post("/sig-up", UserController.createUser);

export default router;
