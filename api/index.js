import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
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
  console.log("server running on", port);
});
