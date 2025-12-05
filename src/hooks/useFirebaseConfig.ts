import { MessagePayload } from "firebase/messaging";
import { createContext, useContext } from "react";

export type FcmState = {
  supported: boolean;
  permission: NotificationPermission; // 'default' | 'denied' | 'granted'
  token: string | null;
  // Pide permiso + obtiene token (registra SW si hace falta)
  enablePush: () => Promise<string | null>;
  // Muestra un toast in-app (fallback si no hay push)
  showToast: (title: string, body?: string) => void;
  // Último mensaje recibido en foreground
  lastMessage: MessagePayload | null;
};
export const NotificationCtx = createContext<FcmState | null>(null);
export const useNotifications = () => {
  const ctx = useContext(NotificationCtx);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return ctx;
};
