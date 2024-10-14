import UserRouter from "./UserRouter.js";
import PostRouter from "./PostRouter.js";
import CommentRouter from "./CommentRouter.js";
const routes = (app) => {
  // API routes
  app.use("/api/user", UserRouter);
  app.use("/api/post", PostRouter);
  app.use("/api/comment", CommentRouter);
};

export default routes;
