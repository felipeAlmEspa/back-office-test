importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBJzglQeajaHfgA4aV1Sjrx3pB_DrlFrJs",
  authDomain: "itsa-7cd5d.firebaseapp.com",
  projectId: "itsa-7cd5d",
  storageBucket: "itsa-7cd5d.firebasestorage.app",
  messagingSenderId: "143159913615",
  appId: "1:143159913615:web:53241865c93b2628bb94fa",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Mensaje de fondo recibido: ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logoicon.png", // Puedes cambiar esto por la ruta de tu propio icono
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});