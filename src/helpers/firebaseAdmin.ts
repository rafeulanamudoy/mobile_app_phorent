import admin from "firebase-admin";
import { serviceAccount } from "../config/service.config";



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

export default admin;
