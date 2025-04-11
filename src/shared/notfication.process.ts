import { notificationServices } from "../app/modules/notification/notification.service";
import { notificationQueue } from "./notficationQuue";

notificationQueue.process(async (job) => {

    const { uuid, match } = job.data;
    const title = `Upcoming Match: ${match.strHomeTeam} vs ${match.strAwayTeam}`
    const body=`The match will start in 10 minutes!`
    console.log("now i am bull quey menaing notificaitation que")
    await notificationServices.sendPushNotification(uuid, match,title,body);
  });
  