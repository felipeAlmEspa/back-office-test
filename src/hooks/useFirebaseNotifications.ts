import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import { useEffect } from "react";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFirebaseNotifications = () => {
  useEffect(() => {
    const requestPermission = async () => {
      console.log("Solicitando permiso para notificaciones...");
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Permiso de notificación concedido.");
        try {
          if (!messaging) {
            console.warn("Firebase Messaging no está soportado o no se inicializó.");
            return;
          }
          let serviceWorkerRegistration: ServiceWorkerRegistration | undefined = undefined;
          if ("serviceWorker" in navigator) {
            try {
              const reg = await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js"
              );
              serviceWorkerRegistration = reg;
            } catch (err) {
              console.warn("No se pudo registrar el Service Worker de FCM:", err);
            }
          }
          const token = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration,
          });
          console.log("Token de registro firebase:", token);
          // TODO: Envía este token a tu backend de Django para asociarlo con el usuario.
          // Por ejemplo: sendTokenToDjango(token);
        } catch (error) {
          console.error("Error al obtener el token:", error);
        }
      } else {
        console.warn("Permiso de notificación denegado.");
      }
    };

    requestPermission();
  }, []);
};
