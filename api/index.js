import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Cấu hình CORS
const corsOptions = {
  origin: "http://localhost:5173", // Miền của frontend
  credentials: true, // Cho phép cookie
};

// Sử dụng CORS với cấu hình đã định nghĩa
app.use(cors(corsOptions));

// Middleware để xử lý JSON
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

// Middleware xử lý lỗi
app.use((error, req, res, next) => {
  const status = error.status || 400;
  const message = error.message || "Internal Server Error";
  res.status(status).json({
    status: status,
    success: false,
    message,
  });
});

// Đăng ký các routes
routes(app);

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connect MongoDB successfully");
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
