import Bull from "bull";
import { sendPushNotification } from "./notification.service";


// Create Bull queue
export const notificationQueue = new Bull("notification-queue", {
  redis: {
    host: "127.0.0.1", // Use your Redis host
    port: 6379,         // Default Redis port
  },
});

// Queue processor
notificationQueue.process(async (job) => {
  const { uuid, match } = job.data;
  await sendPushNotification(uuid, match);
});
