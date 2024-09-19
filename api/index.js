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
app.use(
  cors({
    origin: "http://localhost:5173", // Thay đổi tùy thuộc vào nguồn yêu cầu
    credentials: true,
  })
);

app.use(express.json());

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

routes(app);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connect MongoDB successfully");
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
