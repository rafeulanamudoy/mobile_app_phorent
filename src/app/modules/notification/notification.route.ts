import { Router } from "express";
import auth from "../../middlewares/auth";
import { notificationController } from "./notfication.controller";


const router = Router();

router.get("/", notificationController.getNotificationsFrom);

export const notificationRoute = router;
