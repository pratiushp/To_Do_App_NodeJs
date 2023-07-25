// routes/index.js
import express from "express";
import taskRoutes from "./taskRoute.js";
import authRoutes from "./authRoute.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/task",
    route: taskRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
