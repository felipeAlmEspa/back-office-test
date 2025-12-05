import {
  getNumberFromStorage,
  IAgency,
  IUserInformation,
  TExtendedMenuItem,
  useControlActions,
} from "@itsa-develop/itsa-fe-components";
import { MenuProps } from "antd";
import { useCustomNavigation } from "@/hooks/useCustomNavigation";
import { useGetPermissions } from "@/services/security/security.service";
import { useAppLayoutStore } from "@itsa-develop/itsa-fe-components";
import { useUserInformation } from "@/services/security/security.service";
import { useNotification } from "@itsa-develop/itsa-fe-components";
import { useAuthStore } from "@/store/auth.store";
import { ReactNode, useCallback, useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";
import { CURRENT_MICRO_FRONTEND, KEY_STORE } from "@/constants";
import { getClaimCodeByRefreshToken } from "@/api/config";
import { ELocalStorageKeys } from "@itsa-develop/itsa-fe-components";
import { navigateToMicroFrontend } from "@/helper";
import { useNavigate } from "react-router-dom";

export interface IMainLayoutUIProps {
  onClickOptionMenu: (option: { key: string; item: TExtendedMenuItem }) => void;
  isLoadingNavigation: boolean;
  isLoadingPermissions: boolean;
  userActions: MenuProps;
  children?: ReactNode;
  localPath: string;
  isProfileDrawerOpen: boolean;
  onCloseProfileDrawer: () => void;
  userInformation: IUserInformation | undefined;
  isLoadingUserInformation: boolean;
  currentModuleId: number | undefined;
}

export const useMainLayoutUI = (): IMainLayoutUIProps => {
  const navigate = useNavigate();
  const { setCurrentPath } = useControlActions();
  const localPath = location.pathname;
  const { navigateRoute, isLoadingExternalPath: isLoadingNavigation } =
    useCustomNavigation();
  const { data: permissions, isLoading: isLoadingPermissions } =
    useGetPermissions();
  const { setUserName, setUserRole } = useAppLayoutStore();
  const setAgencies = useAppLayoutStore((state) => state.setAgencies);
  const setCurrentModule = useAppLayoutStore((state) => state.setCurrentModule);
  const setModulesAgency = useAppLayoutStore((state) => state.setModulesAgency);
  const currentModule = useAppLayoutStore((state) => state.currentModule);
  const currentModuleId = currentModule?.id;
  const { data: userInformation, isLoading: isLoadingUserInformation } =
    useUserInformation();
  const userName = userInformation?.name;

  const { logout } = useAuthStore();
  const [userOptions, setUserOptions] = useState<MenuProps>({});
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const { openNotificationWithIcon } = useNotification();

  const onOpenProfileDrawer = () => setIsProfileDrawerOpen(true);
  const onCloseProfileDrawer = () => setIsProfileDrawerOpen(false);

  const agencies = useMemo(() => {
    if (!isLoadingPermissions) {
      return permissions?.agencies || [];
    }
    return [];
  }, [permissions, isLoadingPermissions]);

  const setModulesAgencyCallback = useCallback(
    (agencies: IAgency[]) => {
      const moduleId = getNumberFromStorage(ELocalStorageKeys.moduleId);
      if (moduleId) {
        for (const agency of agencies) {
          if (!agency.modules) continue;
          for (const module of agency.modules) {
            if (module.id === moduleId) {
              setCurrentModule(module);
              setModulesAgency(agency.modules);
              return;
            }
          }
        }
      }
    },
    [setCurrentModule, setModulesAgency]
  );

  const userRoles = useMemo(() => {
    return userInformation?.roles ?? [];
  }, [userInformation?.roles]);

  useEffect(() => {
    setCurrentPath(localPath);
  }, [localPath, setCurrentPath]);

  useEffect(() => {
    if (currentModuleId) {
      if (!isLoadingUserInformation) {
        const userModule = userRoles.find(
          (role) => role.moduleId === currentModuleId
        );
        setUserName(userInformation?.name || "");
        if (userModule) {
          setUserRole(userModule);
        }
      }
    }
  }, [
    currentModuleId,
    isLoadingUserInformation,
    setUserName,
    setUserRole,
    userInformation,
    userRoles,
  ]);

  useEffect(() => {
    if (agencies) {
      setAgencies(agencies);
      setModulesAgencyCallback(agencies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencies]);

  useEffect(() => {
    if (!isLoadingUserInformation && userName) {
      setUserName(userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, isLoadingUserInformation]);

  useEffect(() => {
    setUserOptions({
      items: [
        {
          key: "profile",
          label: userName || "Sin Nombre Usuario",
          icon: <UserOutlined />,
          onClick: () => {
            onOpenProfileDrawer();
          },
        },
        {
          key: "logout",
          label: "Cerrar Sesión",
          icon: <LogoutOutlined className="text-red-500" />,
          onClick: () => {
            logout();
          },
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    const entorno = currentModule?.entorno || ""; // en este caso me va ha dar BACKOFFICE
    if (
      CURRENT_MICRO_FRONTEND.toLowerCase() === entorno.toLowerCase() ||
      !currentModule
    ) {
      return;
    }
    const getNavClaimCode = async () => {
      const claimCode = await getClaimCodeByRefreshToken();
      let newParamsNewMicro: string | null = null;
      if (claimCode) {
        newParamsNewMicro = `?claimCode=${claimCode}&newRoute=/home&moduleId=${currentModule?.id}`;
        localStorage.removeItem(ELocalStorageKeys.moduleId);
        localStorage.removeItem(ELocalStorageKeys.agencyId);
        navigateToMicroFrontend(entorno, newParamsNewMicro);
      }
    };
    getNavClaimCode();
  }, [currentModule, navigate]);

  const onClickOptionMenu = (option: {
    key: string;
    item: TExtendedMenuItem;
  }) => {
    localStorage.setItem(KEY_STORE.LAST_PATH, option.key);
    const path = option.item.data?.path;
    const url = option.item.data?.url;
    const pathPadre = option.item.data?.pathPadre;

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

  const normalizeLocalPath = useMemo(() => {
    const lastPath = localStorage.getItem(KEY_STORE.LAST_PATH);
    if (lastPath) {
      return lastPath;
    }
    return localPath.replace(/^\/+/, "");
  }, [localPath]);

  return {
    onClickOptionMenu,
    isLoadingNavigation,
    isLoadingPermissions,
    userActions: userOptions,
    localPath: normalizeLocalPath,
    isProfileDrawerOpen,
    onCloseProfileDrawer,
    userInformation,
    isLoadingUserInformation,
    currentModuleId,
  };
};
