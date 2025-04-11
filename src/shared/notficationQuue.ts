import Bull from "bull";
import { notificationServices } from "../app/modules/notification/notification.service";



// Create Bull queue
export const notificationQueue = new Bull("notification-queue", {
  redis: {
    host: "127.0.0.1", // Use your Redis host
    port: 6379,         // Default Redis port
  },
});

// Queue processor
