import { sportService } from "../app/modules/sports/sports.service";
import { notificationQueue } from "./notficationQuue";
import admin from "../helpers/firebaseAdmin";
import e from "cors";

const db = admin.firestore();
const formatTimeDifference = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const userLiveScore = async () => {
  try {
    const userUuids = await sportService.getAllUserUuids();
    //  console.log(userUuids,"check userUuids")

    for (const uuid of userUuids) {
      const userRef = db.collection("user").doc(uuid);
      const doc = await userRef.get();
      // console.log(doc,"check doc of user")
      // console.log(new Date().getSeconds())
      const upcomingMatch = await sportService.getUpcomingMatch(uuid);
      // console.log(new Date().getSeconds())
      // console.log(upcomingMatch, "");

      if (upcomingMatch && upcomingMatch.length > 0) {
        for (const match of upcomingMatch) {
          const matchDateTimeString = `${match.dateEvent}T${match.strEventTime}:00Z`;
          const matchStartTime = new Date(matchDateTimeString).getTime();
          const currentTime = Date.now();

          const notificationTime = matchStartTime - 10 * 60 * 1000;
          const delay = notificationTime - currentTime;

          // console.log("📅 Match:", match.strHomeTeam, "vs", match.strAwayTeam);
          // console.log("⏳ Match starts in:", formatTimeDifference(matchStartTime - currentTime));
          // console.log("⏱ Notification will be sent after:", formatTimeDifference(delay));

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

            return
            
            // console.log(`📨 Notification job scheduled for user ${uuid} - match ${match.idEvent}`);
          } else {
             return
          }
        }
      } else {
        return;
      }
    }
  } catch (error) {
    // console.error("❌ Error in live score fetcher cron job:", error);
  }
};
