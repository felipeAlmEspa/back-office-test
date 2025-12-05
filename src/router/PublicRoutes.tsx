import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingApp } from "@/components/Loadings/LoadingApp";
import { fetchAccessToken } from "@/api/config";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: Props) => {
  const {setToken} = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = await fetchAccessToken();
      if (token) {
        setToken(token);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    init();
  }, [setToken]);

  if (loading) {
    return <LoadingApp />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
