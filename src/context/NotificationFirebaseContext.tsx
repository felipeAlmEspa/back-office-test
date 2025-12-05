// // src/context/NotificationContext.tsx
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { messaging } from "@/lib/firebase";
// import { getToken, onMessage, MessagePayload } from "firebase/messaging";
// import { FcmState, NotificationCtx } from "@/hooks/useFirebaseConfig";

// export const NotificationProvider: React.FC<React.PropsWithChildren> = ({
//   children,
// }) => {
//   const [permission, setPermission] = useState<NotificationPermission>(
//     Notification.permission
//   );
//   const [token, setToken] = useState<string | null>(null);
//   const [lastMessage, setLastMessage] = useState<MessagePayload | null>(null);

//   const supported = Boolean(messaging);

//   // Pequeño toast minimalista (puedes sustituir por Sonner/AntD/etc)
//   const showToast = useCallback((title: string, body?: string) => {
//     // In-app toast (simple)
//     const id = `toast-${Date.now()}`;
//     const div = document.createElement("div");
//     div.id = id;
//     div.style.position = "fixed";
//     div.style.right = "16px";
//     div.style.bottom = "16px";
//     div.style.padding = "12px 14px";
//     div.style.maxWidth = "320px";
//     div.style.background = "#111";
//     div.style.color = "#fff";
//     div.style.borderRadius = "12px";
//     div.style.boxShadow = "0 8px 24px rgba(0,0,0,.3)";
//     div.style.fontFamily = "system-ui, sans-serif";
//     div.innerHTML = `<strong style="display:block;margin-bottom:4px">${title}</strong>${
//       body ?? ""
//     }`;
//     document.body.appendChild(div);
//     setTimeout(() => div.remove(), 4000);
//   }, []);

//   // Registra el SW (necesario para background push)
//   const ensureServiceWorker = useCallback(async () => {
//     if (!("serviceWorker" in navigator)) return null;
//     const reg = await navigator.serviceWorker.register(
//       "/firebase-messaging-sw.js"
//     );
//     return reg;
//   }, []);

//   // Pide permiso + obtiene token FCM
//   const enablePush = useCallback(async () => {
//     try {
//       if (!supported) {
//         showToast(
//           "Notificaciones no disponibles",
//           "El navegador no soporta FCM."
//         );
//         return null;
//       }
//       const reg = await ensureServiceWorker();
//       const perm = await Notification.requestPermission();
//       setPermission(perm);
//       if (perm !== "granted") {
//         showToast(
//           "Permiso denegado",
//           "No podremos enviar notificaciones push."
//         );
//         return null;
//       }
//       // Importante: pasar vapidKey y el service worker registration
//       const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
//       const tkn = await getToken(messaging!, {
//         vapidKey,
//         serviceWorkerRegistration: reg ?? undefined,
//       });
//       setToken(tkn);
//       if (!tkn) {
//         showToast(
//           "No se pudo obtener el token",
//           "Revisa VAPID key y orígenes."
//         );
//       } else {
//         showToast("Push habilitado", "Token obtenido correctamente.");
//       }
//       return tkn;
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : String(err);
//       console.error("enablePush error:", err);
//       showToast("Error habilitando push", errorMessage);
//       return null;
//     }
//   }, [supported, ensureServiceWorker, showToast]);

//   // Suscripción a mensajes en foreground
//   useEffect(() => {
//     if (!supported) return;
//     const unsub = onMessage(messaging!, (payload) => {
//       setLastMessage(payload);
//       const title = payload.notification?.title ?? "Notificación";
//       const body = payload.notification?.body ?? "";
//       // Muestra in-app toast como feedback
//       showToast(title, body);
//     });
//     return () => unsub();
//   }, [supported, showToast]);

//   const value = useMemo<FcmState>(
//     () => ({
//       supported,
//       permission,
//       token,
//       enablePush,
//       showToast,
//       lastMessage,
//     }),
//     [supported, permission, token, enablePush, showToast, lastMessage]
//   );

//   return (
//     <NotificationCtx.Provider value={value}>
//       {children}
//     </NotificationCtx.Provider>
//   );
// };
