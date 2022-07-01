importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAjN7xJlTZuY0ULCJl-oO9uN8M8Onhv2hY",
  authDomain: "web-notification-eab20.firebaseapp.com",
  projectId: "web-notification-eab20",
  storageBucket: "web-notification-eab20.appspot.com",
  messagingSenderId: "510617331086",
  appId: "1:510617331086:web:2967e726267bec229cf0df",
  measurementId: "G-P1HB2W86L6",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "🚀 ~ file: firebase-messaging-sw.js ~ line 17 ~ payload",
    payload
  );

  const notificationTitle = "Hello world is awesome";

  const notificationOptions = {
    body: "Your notificaiton message .",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Not necessary, but if you want to handle clicks on notifications
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   const pathname = event.notification?.data?.FCM_MSG?.notification?.data?.link;
//   if (!pathname) return;
//   const url = new URL(pathname, self.location.origin).href;

//   event.waitUntil(
//     self.clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientsArr) => {
//         const hadWindowToFocus = clientsArr.some((windowClient) =>
//           windowClient.url === url ? (windowClient.focus(), true) : false
//         );

//         if (!hadWindowToFocus)
//           self.clients
//             .openWindow(url)
//             .then((windowClient) =>
//               windowClient ? windowClient.focus() : null
//             );
//       })
//   );
// });
