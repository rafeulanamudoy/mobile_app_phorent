import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { notificationServices } from "./notification.service";

const getNotificationsFrom = catchAsync(async (req: Request, res: Response) => {

  const result = await notificationServices.getNotificationsFromDB(req.query.uuid as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification retrieved successfully",
    data: result,
  });
});

export const notificationController = {
  getNotificationsFrom,
};
