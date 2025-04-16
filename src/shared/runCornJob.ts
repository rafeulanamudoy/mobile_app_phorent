import cron from "node-cron";

import { checkAndUpdateUserMembership } from "./checkAndUpdateMembership";
import { userLiveScore } from "./userLiveScore";

export const runCornJob = () => {
  //0 * * * *
  cron.schedule("*/30 * * * * *", async () => {
    console.log("🔁 Running scheduled live score fetcher (every hour)...");
    await userLiveScore();
 
    await checkAndUpdateUserMembership();
    
  });

  console.log("🕒 Live score cron job scheduled to run every 1 hour.");
};
