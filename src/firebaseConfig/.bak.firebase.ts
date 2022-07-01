import "firebase/compat/messaging";
import firebase from "firebase/compat/app";
import localforage from "localforage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FCM_APP_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
};

const firebaseCloudMessaging = {
  init: async () => {
    if (!firebase?.apps?.length) {
      const app = firebase?.initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      try {
        const tokenInLocalForage = await localforage.getItem("fcm_token");

        // Return the token if it is already in our local storage
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};

export { firebaseCloudMessaging };

// export const app = firebase.initializeApp(firebaseConfig);
// export const messaging = firebase.messaging(app);

// export async function getFCMToken() {
//   try {
//     const token = await messaging.getToken({
//       vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
//     });
//     return token;
//   } catch (e) {
//     console.log("getFCMToken error", e);
//     return undefined;
//   }
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       resolve(payload);
//     });
//   });
