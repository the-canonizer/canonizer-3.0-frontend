import "firebase/compat/messaging";
import firebase from "firebase/compat/app";
import localforage from "localforage";
// import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { Modal } from "antd";

// const { confirm } = Modal;
var HTMLElement = HTMLElement;

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
      // Initialize the Firebase app with the credentials
      firebase?.initializeApp(firebaseConfig);

      try {
        // const messaging = firebase.messaging();
        const tokenInLocalForage = await localforage.getItem("fcm_token");

        // Return the token if it is already in our local storage
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }

        // Request the push notification permission from browser
        // const status = await Notification.requestPermission();
        // console.log(
        //   "🚀 ~ file: firebase.ts ~ line 37 ~ init: ~ status",
        //   status
        // );
        // if (status && status === "granted") {
        //   // Get new token from Firebase
        //   const fcm_token = await messaging.getToken({
        //     vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
        //   });

        //   // Set token in our local storage
        //   if (fcm_token) {
        //     localforage.setItem("fcm_token", fcm_token);
        //     return fcm_token;
        //   }
        // } else if (status && status === "default") {
        //   // Firefox 1.0+
        //   let isFirefox = typeof window["InstallTrigger"] !== "undefined";

        //   // Safari 3.0+ "[object HTMLElementConstructor]"
        //   let isSafari =
        //     /constructor/i.test(HTMLElement) ||
        //     (function (p) {
        //       return p.toString() === "[object SafariRemoteNotification]";
        //     })(
        //       !window["safari"] ||
        //         (typeof window["safari"] !== "undefined" &&
        //           window["safari"].pushNotification)
        //     );
        //   if (isSafari || isFirefox) {
        //     confirm({
        //       title: "Want to get notification from us?",
        //       onOk() {
        //         Notification.requestPermission().then(async function (status) {
        //           if (status === "granted") {
        //             const fcm_token = await messaging.getToken({
        //               vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
        //             });
        //             console.log(
        //               "🚀 ~ file: firebase.ts ~ line 71 ~ fcm_token",
        //               fcm_token
        //             );

        //             // Set token in our local storage
        //             if (fcm_token) {
        //               localforage.setItem("fcm_token", fcm_token);
        //               return fcm_token;
        //             }
        //           }
        //         });
        //       },
        //       onCancel() {},
        //     });
        //   }
        // }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};

export { firebaseCloudMessaging };
