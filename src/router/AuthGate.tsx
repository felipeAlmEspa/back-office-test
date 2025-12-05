import { fetchAccessToken, getTokenByClaimCode } from "@/api/config";
import { LoadingApp } from "@/components/Loadings/LoadingApp";
import { CURRENT_MICRO_FRONTEND } from "@/constants";
import { useUrlSearchParamsFilters } from "@/hooks/useUrlSearchParamsFilters";
import { useAuthStore } from "@/store/auth.store";
import { ELocalStorageKeys } from "@itsa-develop/itsa-fe-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const { token, setToken } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const location = useLocation();
  const { values, removeParam } = useUrlSearchParamsFilters([
    "claimCode",
    "newRoute",
    "moduleId",
  ]);
  const [routeParams, setRouteParams] = useState("");
  const ran = useRef(false);

  const claimCode = values.claimCode;
  const newRoute = values.newRoute;
  const moduleId = values.moduleId;

  const clearParams = useCallback(() => {
    removeParam("claimCode");
    removeParam("newRoute");
    removeParam("moduleId");
  }, [removeParam]);

  useEffect(() => {
    if (ran.current) return;

    localStorage.setItem(
      ELocalStorageKeys.currentEnvironment,
      CURRENT_MICRO_FRONTEND.toUpperCase()
    );
    if (moduleId) {
      localStorage.setItem(ELocalStorageKeys.moduleId, moduleId);
    }

    (async () => {
      try {
        if (token && !claimCode) return;

        let newToken: string | null = null;

        if (claimCode) {
          newToken = await getTokenByClaimCode(claimCode);
        } else {
          newToken = await fetchAccessToken();
        }

        if (newToken) {
          clearParams();
          if (newRoute) {
            setRouteParams(newRoute);
            setToken(newToken);
            window.location.replace(newRoute);
            return;
          }
        }
        ran.current = true;
      } catch (error) {
        console.error("error", error);
      } finally {
        setChecked(true);
        ran.current = true;
      }
    })();
  }, [token, claimCode, newRoute, setToken, clearParams, moduleId, values]);

  if (!checked) return <LoadingApp />;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (routeParams.length > 0) {
    return <Navigate to={routeParams} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
