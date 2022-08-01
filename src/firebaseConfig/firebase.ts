// import firebase from "firebase/app";
// import "firebase/messaging";
import localforage from "localforage";
// import { notification } from "antd";

import { getLists } from "../network/api/notificationAPI";
// import Fav from "../components/common/headers/notification/icon";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FCM_APP_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
};

export const firebaseCloudMessaging = {
  init: async () => {
    if (!firebase?.apps?.length) {
      const app = firebase?.initializeApp(firebaseConfig);
      const messaging = firebase.messaging(app);

      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.addEventListener("message", async (event) => {
          // console.log("(event for the service worker)", event, event.data);

          await getLists();
        });

        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then(async (objServiceWorker) => {
            // console.log("[service worker registered]", objServiceWorker);
            messaging.useServiceWorker(objServiceWorker);
          })
          .catch((err) => console.error(`OOps! ${err}`));
      }

      try {
        const token = await localforage.getItem("fcm_token");

        // Return the token if it is already in our local storage
        if (token !== null) {
          return token;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};
