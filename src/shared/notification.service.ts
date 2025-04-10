import admin from "../helpers/firebaseAdmin";
const db = admin.firestore();
export const sendPushNotification = async (uuid: string, match: any) => {
    const userRef = db.collection("user").doc(uuid);
    const userDoc = await userRef.get();
  
    if (!userDoc.exists) {
      console.warn(`User with uuid ${uuid} not found`);
      return;
    }
  
    const userData = userDoc.data();
    if (!userData || !userData.fcm_token) {
      console.warn(`No device token found for user ${uuid}`);
      return;
    }
  
    const message = {
      notification: {
        title: `Upcoming Match: ${match.strHomeTeam} vs ${match.strAwayTeam}`,
        body: `The match will start in 10 minutes!`,
      },
      token: userData.fcm_token,
    };
  
    try {
      await admin.messaging().send(message);
      console.log(`✅ Notification sent to user ${uuid}`);
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };
  