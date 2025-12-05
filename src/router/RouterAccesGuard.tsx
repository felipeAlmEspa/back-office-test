import React, { FC, ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useValidateRoute } from "@/services/security/security.service";
import { AxiosErrorType } from "@/types/axios";
import { useAppLayoutStore } from "@itsa-develop/itsa-fe-components";
import { useFindParentPath } from "@/hooks/useFindProgramInfoByPath";
import { LoadingModule } from "@/components/Loadings/LoadingModule";

interface RouteAccessGuardProps {
  children?: ReactNode;
  path?: string;
  agenId?: number;
  redirectOnDenied?: string;
  redirectOnInvalid?: string;
  loadingFallback?: ReactNode;
}

export const RouteAccessGuard: FC<RouteAccessGuardProps> = ({
  children,
  path = "",
  agenId = 4,
  redirectOnDenied = "/404",
  redirectOnInvalid = "/home",
  loadingFallback = <LoadingModule />,
}) => {
  const location = useLocation();
  const [pathStore, setPathStore] = useState("");
  const [resolvingParent, setResolvingParent] = useState(false);
  const agenciesPermissions = useAppLayoutStore((state) => state.agencies);
  const { findParentPath } = useFindParentPath();

  useEffect(() => {
    const effectivePath = path.includes(":") ? location.pathname : path;
    const isPublic = effectivePath === "" || effectivePath === "/" || effectivePath === "home";
    if (isPublic) return;

    setResolvingParent(true);
    if (agenciesPermissions) {
      const parentPath = findParentPath(effectivePath);
      if (parentPath) {
        setPathStore(parentPath);
      }
      setResolvingParent(false);
    } else {
      setResolvingParent(false);
    }

  }, [agenciesPermissions, findParentPath, path, location.pathname]);

  // Rutas públicas que no requieren validación
  const effectivePath = path.includes(":") ? location.pathname : path;
  const isPublic = effectivePath === "" || effectivePath === "/" || effectivePath === "home";

  // Solo consulta cuando haga falta
  const enabled = !isPublic && pathStore.length > 0;
  const {
    data: routeAccess,
    error,
    isLoading,
    isFetching,
    isError,
  } = useValidateRoute(
    { path: pathStore, agencyId: agenId },
    { enabled, retry: false }
  );
  const code = (error as AxiosErrorType)?.response?.data?.code;

  // 1) Público → render directo
  if (isPublic) return <>{children}</>;

  // 1.5) Resolviendo parentPath → mostrar loading
  if (!isPublic && resolvingParent) return loadingFallback;

  // 2) Si aún no está habilitada la validación (no hay parentPath) mostrar loading
  if (!enabled) return loadingFallback;

  // 3) Cargando validación
  if (isLoading || isFetching) return loadingFallback;

  // 4) Sesión inválida/expirada (code === -1) → redirige
  if (code === -1) return <Navigate to={redirectOnInvalid} replace />;

  // 5) Error de red/servidor → niega acceso
  if (isError) return <Navigate to={redirectOnDenied} replace />;

  // 6) Acceso concedido
  if (routeAccess === true) return <>{children}</>;

  // 7) Acceso denegado explícito
  return <Navigate to={redirectOnDenied} replace />;
};