

import cron from "node-cron";
import { sportService } from "../app/modules/sports/sports.service";
import { notificationQueue } from "./notficationQuue";

const formatTimeDifference = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const scheduleLiveScoreFetcher = () => {
 
  cron.schedule("0 * * * *", async () => {
    console.log("🔁 Running scheduled live score fetcher (every hour)...");

    try {
      const userUuids = await sportService.getAllUserUuids();

      for (const uuid of userUuids) {
        const upcomingMatch = await sportService.getUpcomingMatch(uuid); 

        if (upcomingMatch && upcomingMatch.length > 0) {
          for (const match of upcomingMatch) {
            const matchDateTimeString = `${match.dateEvent}T${match.strEventTime}:00Z`;
            const matchStartTime = new Date(matchDateTimeString).getTime();
            const currentTime = Date.now();

            const notificationTime = matchStartTime - 10 * 60 * 1000; 
            const delay = notificationTime - currentTime;

            console.log("📅 Match:", match.strHomeTeam, "vs", match.strAwayTeam);
            console.log("⏳ Match starts in:", formatTimeDifference(matchStartTime - currentTime));
            console.log("⏱ Notification will be sent after:", formatTimeDifference(delay));

           
            if (delay > 0) {
              await notificationQueue.add(
                { uuid, match },
                {
                  jobId: `${uuid}-${match.idEvent}`, 
                  delay,
                  removeOnComplete: true,
                  removeOnFail: true,
                }
              );

              console.log(`📨 Notification job scheduled for user ${uuid} - match ${match.idEvent}`);
            } else {
              console.log("⚠️ Match is too close or already started. Skipping...");
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Error in live score fetcher cron job:", error);
    }
  });

  console.log("🕒 Live score cron job scheduled to run every 1 hour.");
};
