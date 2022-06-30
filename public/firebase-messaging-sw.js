importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAlpxyCiOCPZTvCnRrV_Ss5K56GPu6yzzU",
  authDomain: "canonizer-test-sks.firebaseapp.com",
  projectId: "canonizer-test-sks",
  storageBucket: "canonizer-test-sks.appspot.com",
  messagingSenderId: "278119939224",
  appId: "1:278119939224:web:b489136c0ae4dc1206a4ed",
  measurementId: "G-0K2WRVE0EL",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
