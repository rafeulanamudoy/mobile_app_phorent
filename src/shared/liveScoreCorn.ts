import cron from "node-cron";
import { sportService } from "../app/modules/sports/sports.service";
import { notificationQueue } from "./notficationQuue";

export const scheduleLiveScoreFetcher = () => {

  cron.schedule("0 * * * *", async () => {
    console.log("🔁 Running scheduled live score fetcher...");

    try {
      const userUuids = await sportService.getAllUserUuids();
      console.log(" Found users:", userUuids);

      for (const uuid of userUuids) {
        const user = await sportService.getUserDataByUuid(uuid);
        console.log("👤 User data:", user);

        const upcomingMatch = await sportService.getUpcomingMatch(uuid);
        if (upcomingMatch && upcomingMatch.length > 0) {
          for (const match of upcomingMatch) {
            const matchStartTime = new Date(match.strEventTime).getTime();
            const currentTime = new Date().getTime();

            const timeDifference = matchStartTime - currentTime;
            const tenMinutes = 10 * 60 * 1000;

            if (timeDifference <= tenMinutes && timeDifference >= 0) {
              // ✅ Add job to the Bull queue
              await notificationQueue.add({ uuid, match });
              console.log(`📨 Queued notification for user ${uuid}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Error in scheduled task:", error);
    }
  });

  console.log("🕒 Live score cron job scheduled to run every 30 seconds.");
};
