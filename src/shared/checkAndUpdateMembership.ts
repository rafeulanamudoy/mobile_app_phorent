import admin from "firebase-admin";
import { sportService } from "../app/modules/sports/sports.service";

const db = admin.firestore();

export const checkAndUpdateUserMembership = async () => {
  try {
    const userUuids = await sportService.getAllUserUuids();
    const now = new Date();

 

    for (const uuid of userUuids) {
      const userRef = db.collection("user").doc(uuid);
      const doc = await userRef.get();

      if (!doc.exists) {
      
        continue;
      }

      const data = doc.data();
      const expireDateStr = data?.["expire-date"];
      const isMember = data?.member;

      if (!expireDateStr) {
  
        continue;
      }

      if (isMember === false) {
  
        continue;
      }

      const expireDate = new Date(expireDateStr);

      if (isNaN(expireDate.getTime())) {

        continue;
      }

      if (now > expireDate) {
      

        let selectedTeam = [];
        try {
          selectedTeam = Array.isArray(data?.selectedTeam) ? data.selectedTeam : [];
        } catch (err) {
      
        }

        const firstTeam = selectedTeam.length > 0 ? [selectedTeam[0]] : [selectedTeam[0]];

        await userRef.update({
          member: false,
          selectedTeam: firstTeam,
        });

  
      } else {
        return
      }
    }
  } catch (error) {
    console.error("🔥 Error checking/updating user memberships:", error);
  }
};
