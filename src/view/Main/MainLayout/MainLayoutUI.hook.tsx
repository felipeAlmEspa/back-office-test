import {
  useGetPermissions,
  useUserInformation,
} from "@/services/security/security.service";
import {
  IModule,
  useAppLayoutStore,
} from "@itsa-develop/itsa-fe-components";
import { ReactNode, useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate, useNavigation } from "react-router-dom";
export interface IMainLayoutUIProps {
  children?: ReactNode;
  onClickOptionMenu: (module: IModule) => void;
  isLoadingApp: boolean;
  userOptions: MenuProps;
  handleNavigate: (path: string) => void;
  isNavigationLoading: boolean;
}

export const useMainLayoutUI = (): IMainLayoutUIProps => {
  const initApp = useRef(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [userOptions, setUserOptions] = useState<MenuProps>({});
  const { logout } = useAuthStore();
  const {
    data: permissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = useGetPermissions();
  console.log('navigation.state =>',navigation.state);
  const isNavigationLoading = navigation.state !== "idle";
  const isLoadingApp = isLoadingPermissions;
  const setAgencies = useAppLayoutStore((state) => state.setAgencies);
  const setUserName = useAppLayoutStore((state) => state.setUserName);
  const setUserRole = useAppLayoutStore((state) => state.setUserRole);
  const { data: userInformation } = useUserInformation();
  const currentModule = useAppLayoutStore((state) => state.currentModule);
  const currentModuleId = currentModule?.id;
  const agencies = permissions?.agencies ?? [];

  const userName = userInformation?.name || "";
  const userRoles = useMemo(() => {
    return userInformation?.roles ?? [];
  }, [userInformation?.roles]);

  const onClickOptionMenu = (module: IModule) => {
    console.log('module =>',module);
  };

  useEffect(() => {
    if (initApp.current) return;
    if (isLoadingPermissions === false && isErrorPermissions === false) {
      initApp.current = true;
      setAgencies(agencies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencies]);

  useEffect(() => {
    setUserOptions({
      items: [
        {
          key: "profile",
          label: userName || "Sin Nombre Usuario",
          icon: <UserOutlined />,
          onClick: () => {},
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
    if (currentModuleId) {
      if (!isLoadingPermissions) {
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
    isLoadingPermissions,
    setUserName,
    setUserRole,
    userInformation,
    userRoles,
  ]);

  const handleNavigate = (path: string) => {
    if (path.length > 0) {
      navigate(path);
    }
  };

  return {
    onClickOptionMenu,
    isLoadingApp,
    userOptions,
    handleNavigate,
    isNavigationLoading,
  };
};
