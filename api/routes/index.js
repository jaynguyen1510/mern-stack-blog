import UserRouter from "./UserRouter.js";
const routes = (app) => {
  // API routes
  app.use("/api/user", UserRouter);
};

export default routes;
