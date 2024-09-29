import UserRouter from "./UserRouter.js";
import PostRouter from "./PostRouter.js";
const routes = (app) => {
  // API routes
  app.use("/api/user", UserRouter);
  app.use("/api/post", PostRouter);
};

export default routes;
