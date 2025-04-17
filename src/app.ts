import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";

import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";

import { notificationQueue } from "./shared/notficationQuue";
import "./shared/notfication.process";
// ✅ Bull Board Setup
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { runCornJob } from "./shared/runCornJob";

// Setup Bull Board Adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(notificationQueue)],
  serverAdapter,
});

// Initialize Express App
const app: Application = express();
const prisma = new PrismaClient();

// ✅ Connect Prisma (MongoDB)
prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
  });

// ✅ Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ✅ Bull Board UI
app.use("/admin/queues", serverAdapter.getRouter()); // Open at: http://localhost:<port>/admin/queues

// ✅ Health Check Route
app.get("/", (_req: Request, res: Response) => {
  res.send({
    message: "🚀 Welcome to the API main route",
  });
});

// ✅ API Routes
app.use("/api/v1", router);

// ✅ Start Cron Job
// scheduleLiveScoreFetcher();
runCornJob()

// ✅ Global Error Handler
app.use(GlobalErrorHandler);

// ✅ 404 Handler
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
