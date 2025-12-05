import { useFirebaseNotifications } from "@/hooks/useFirebaseNotifications";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import {
  ELocalStorageKeys,
  IModule,
  ISubmodule,
  useAppLayoutStore,
  useNotification,
} from "@itsa-develop/itsa-fe-components";
import { CURRENT_MICRO_FRONTEND, KEY_STORE, MICRO_FRONTENDS } from "@/constants";
import { getClaimCodeByRefreshToken } from "@/api/config";
import { useCustomNavigation } from "@/hooks/useCustomNavigation";

export interface IHomeUIHookProps {
  modulesAgency: IModule[];
  handleNavigateRoute: (item: IModule) => void;
  handleNavigateProgram: (program: ISubmodule) => void;
}

export const useHomeUIHook = (): IHomeUIHookProps => {
  const { openNotificationWithIcon } = useNotification();
  useFirebaseNotifications();
  const modulesAgency = useAppLayoutStore((state) => state.modulesAgency);
  const currentModule = useAppLayoutStore((state) => state.setCurrentModule);
  const { navigateRoute } = useCustomNavigation();
  
  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Mensaje de primer plano recibido:", payload);
      alert(
        `Mensaje de primer plano:\n${payload.notification?.title}\n${payload.notification?.body}`
      );
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateRoute = async (item: IModule) => {
    const currentModuleId =
      localStorage.getItem(ELocalStorageKeys.moduleId) ?? -1;

    if (item.id === Number(currentModuleId)) {
      return;
    }

    if (CURRENT_MICRO_FRONTEND === item.entorno) {
      currentModule(item);
      openNotificationWithIcon({
        type: "success",
        message: `Linea ${item.name}`,
      });
      return;
    }

    const claimCode = await getClaimCodeByRefreshToken();
    let newParamsNewMicro: string | null = null;
    if (claimCode) {
      newParamsNewMicro = `?claimCode=${claimCode}&newRoute=/home&moduleId=${item.id}`;
      localStorage.removeItem(ELocalStorageKeys.moduleId);
      localStorage.removeItem(ELocalStorageKeys.agencyId);
      if (
        MICRO_FRONTENDS.backoffice
          .toLowerCase()
          .includes(item.entorno.toLowerCase())
      ) {
        const newRouteBackoffice = `${MICRO_FRONTENDS.backoffice}${newParamsNewMicro}`;
        window.location.replace(newRouteBackoffice);
      }
      if (
        MICRO_FRONTENDS.frontoffice
          .toLowerCase()
          .includes(item.entorno.toLowerCase())
      ) {
        const newRouteFrontoffice = `${MICRO_FRONTENDS.frontoffice}${newParamsNewMicro}`;
        window.location.replace(newRouteFrontoffice);
      }
    }
  };
  const handleNavigateProgram = (program: ISubmodule) => {
     localStorage.setItem(KEY_STORE.LAST_PATH, program.path ?? "");
     const path = program.path;
     const url = program.url;
     const pathPadre = program.pathPadre;

     if (path && pathPadre) {
       navigateRoute({ pathPadre, path, url });
     } else {
       openNotificationWithIcon({
         type: "info",
         message: "No se a configurado la ruta.",
         description: "Por favor, comunícate con el administrador",
       });
     }
    
  };

  return { modulesAgency, handleNavigateRoute, handleNavigateProgram };
};
