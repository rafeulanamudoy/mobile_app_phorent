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

  cron.schedule("*/30 * * * * *", async () => {
    console.log("🔁 Running scheduled live score fetcher...");

    try {
      const userUuids = await sportService.getAllUserUuids();
      // console.log(" Found users:", userUuids);

      for (const uuid of userUuids) {
        // const user = await sportService.getUserDataByUuid(uuid);
        // const user=await sportService.getUserDataByUuid("dwSYV7NEwISKMDHQccQJIgi3Uuq1")
        // console.log(user,"check user")
        // console.log("👤 User data:", user);

        // const upcomingMatch = await sportService.getUpcomingMatch(uuid);
        // console.log(upcomingMatch,"check upcoming match")
        const upcomingMatch=[
          {
            idLiveScore: '258453618',
            idEvent: '2246767',
            strSport: 'Ice Hockey',
            idLeague: '4930',
            strLeague: 'Danish Metal Ligaen',
            idHomeTeam: '141289',
            idAwayTeam: '140922',
            strHomeTeam: 'Odense Bulldogs',
            strAwayTeam: 'Rungsted',
            strHomeTeamBadge: 'https://r2.thesportsdb.com/images/media/team/badge/o9gxha1617311183.png',
            strAwayTeamBadge: 'https://r2.thesportsdb.com/images/media/team/badge/evg2071617310676.png',
            intHomeScore: null,
            intAwayScore: null,
            intEventScore: null,
            intEventScoreTotal: null,
            strStatus: '',
            strProgress: 'NS',
            strEventTime: '12:22',
            dateEvent: '2025-04-11',
            updated: '2025-04-11 07:24:22'
          }
        ] 
        // console.log(upcomingMatch,"checj upcoming match")
        if (upcomingMatch && upcomingMatch.length > 0) {
          for (const match of upcomingMatch) {
            const matchDateTimeString = `${match.dateEvent}T${match.strEventTime}:00Z`;
            // console.log(matchDateTimeString,"checj match data time string")
            const matchStartTime = new Date(matchDateTimeString).getTime();
            console.log(matchStartTime,"check in value")
            // console.log(matchStartTime,"check match start time")
            const currentTime = new Date().getTime();
         
            //  console.log(convirtTimeTo,"check standard my time")
            // console.log(currentTime,"check current time")
            const timeDifference = matchStartTime - currentTime;
            console.log(timeDifference,"check time difference")
            console.log("⏳ Time until match start:", formatTimeDifference(timeDifference));
         
            //  console.log(timeConvirtDifferenct,"check time difference in real")
            // console.log(timeDifference,"check time difference")
            const tenMinutes = 5 * 60 * 1000;
            // console.log(tenMinutes,"check ten minits")
           
            // const lowerBound = tenMinutes - 30 * 1000; // 9m 30s
            // const upperBound = tenMinutes + 30 * 1000; // 10m 30s
                    
            const lowerBound = tenMinutes - 30 * 1000; 
            const upperBound = tenMinutes + 30 * 1000; 
            if (timeDifference <= upperBound && timeDifference >= lowerBound) {
              console.log("now i am  in the condition to  to send notification")
              console.log(match,"check match")
          const result= await notificationQueue.add({ uuid, match }, {
                jobId: `${uuid}-${match.idEvent}`,
              });
              console.log(result,"in bull js quee condition")
              // console.log(`📨 Notification job added for user ${uuid}, match ${match.idEvent}`);
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
