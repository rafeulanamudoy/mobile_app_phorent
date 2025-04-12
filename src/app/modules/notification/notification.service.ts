import ApiError from "../../../errors/ApiErrors";
import admin from "../../../helpers/firebaseAdmin";
import prisma from "../../../shared/prisma";

const db = admin.firestore();
const getNotificationsFromDB = async (receiverId: string) => {
    const notifications = await prisma.notifications.findMany({
      where: { receiverId: receiverId },
      orderBy: { createdAt: "desc" },
      take:20
    });
  
    if (notifications.length === 0) {
      throw new ApiError(404, "No notifications found for the user");
    }
  
    return notifications;
  };
const sendPushNotification = async (uuid: string, match: any,title:string,body:any) => {
    const userRef = db.collection("user").doc(uuid);
    const userDoc = await userRef.get();
    console.log(userDoc,"checj user doc")
  
    if (!userDoc.exists) {
      console.warn(`User with uuid ${uuid} not found`);
      return;
    }
  
    const userData = userDoc.data();

    if (!userData || !userData.fcm_token) {
      console.warn(`No device token found for user ${uuid}`);
      return;
    }
    console.log(userData.fcm_token,"check fcm token")
   
    const message = {
      notification: {
        title:title,
        body: body,
      },
      token: userData.fcm_token,
    };
    
  await prisma.notifications.create({
    data: {
     receiverId:uuid,
      title: title,
      body,
    },
  });
  
    try {
      await admin.messaging().send(message);
      console.log(`✅ Notification sent to user ${uuid}`);
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };
  
 export const notificationServices={
    getNotificationsFromDB,
    sendPushNotification
  }