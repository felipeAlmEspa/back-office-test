import { apiInstance, getClaimCodeByRefreshToken } from "@/api/config";
import { API_ROUTES } from "@/api/routes";
import { APIS_VERSIONS, CURRENT_SERVER_MICRO_FRONTEND } from "@/constants";
import { findProgramIdByPath, getFormModeFromPath } from "@/helper";
import {
  ELocalStorageKeys,
  getNumberFromStorage,
  IValidateRouteResponse,
  useNotification,
} from "@itsa-develop/itsa-fe-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export interface IUseCustomNavigationProps {
  pathPadre: string;
  path: string;
  url?: string | null;
}

export const useCustomNavigation = () => {
  const [isLoadingExternalPath, setIsLoadingExternalPath] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { openNotificationWithIcon } = useNotification();

  const navigateToMicroFrontend = async (path: string, url: string) => {
    const currentMicro = CURRENT_SERVER_MICRO_FRONTEND;
    const validLocalRoute = url
      .toLowerCase()
      .includes(currentMicro.toLowerCase());
    if (validLocalRoute) {
      navigate(`/${path}`);
      return;
    }

    const claimCode = await getClaimCodeByRefreshToken();
    let newParamsNewMicro: string | null = null;

    if (claimCode) {
      newParamsNewMicro = `?claimCode=${claimCode}&newRoute=${path}`;
    }

    // Si es otro micro, hace redirect completo para mejor UX
    const base = `${url}${newParamsNewMicro ? `${newParamsNewMicro}` : ""}`;
    if (base) {
      setIsLoadingExternalPath(true);
      window.location.replace(base);
    } else {
      navigate(path);
    }
  };

  const navigateRoute = async ({
    pathPadre,
    path,
    url,
  }: IUseCustomNavigationProps): Promise<boolean> => {
    try {
      if (path === "/" || path === "/home" || path === "") {
        navigate(path);
        return true;
      }

      setIsLoading(true);
      const agenId = getNumberFromStorage(ELocalStorageKeys.agencyId);
      const { data } = await apiInstance.get<IValidateRouteResponse>(
        APIS_VERSIONS.security + API_ROUTES.validateRoute,
        {
          params: { path: pathPadre, agency_id: agenId },
        }
      );

      const ok = data?.code === 1 && !!data?.result;

      if (ok) {
        await navigateToMicroFrontend(path, url || "");
        return true;
      } else {
        const action = getFormModeFromPath(pathPadre);
        const localPath = location.pathname;
        if (action !== null) {
          const { data } = await apiInstance.get<IValidateRouteResponse>(
            APIS_VERSIONS.security + API_ROUTES.validatePermissions,
            {
              params: {
                program_id: findProgramIdByPath(localPath),
                agency_id: agenId,
                action: action,
              },
            }
          );
          const okPermissions = data?.code === 1 && !!data?.result;
          if (okPermissions) {
            navigate(path);
            return true;
          } else {
            navigate("/not-found");
            return false;
          }
        } else {
          navigate("/not-found");
          return false;
        }
      }
    } catch {
      openNotificationWithIcon({
        type: "error",
        message: "No se pudo validar el acceso.",
        description:
          "Al parecer no tienes acceso a esta ruta. Comunícate con el administrador.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { navigateRoute, isLoading, isLoadingExternalPath };
};
