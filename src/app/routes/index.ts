import express from "express";


import { sportsRoute } from "../modules/sports/sports.route";
import { notificationRoute } from "../modules/notification/notification.route";

const router = express.Router();

const moduleRoutes = [
  // {
  //   path: "/users",
  //   route: userRoutes,
  // },

  // {
  //   path: "/auth",
  //   route: authRoute,
  // },
  {
    path:"/sports",
    route:sportsRoute
  },
  {
    path:"/notification",
    route:notificationRoute
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
