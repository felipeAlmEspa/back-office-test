import { LoginUI } from "../view/Security/Login/LoginUI.controller";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { arrayRoutes } from "./PrivateRoutes";
import type { IRouteLazy } from "./PrivateRoutes";
import { PublicRoute } from "./PublicRoutes";
import { AuthGate } from "./AuthGate";
import { RouteAccessGuard } from "./RouterAccesGuard";
import { ErrorPage, UIProvider } from "@itsa-develop/itsa-fe-components";
import { LoadingApp } from "@/components/Loadings/LoadingApp";
import { lazy } from "react";
import { MainLayoutUI } from "@/view/Main/MainLayout/MainLayoutUI.controller";

const convertLazyRoutes = (routes: IRouteLazy[]): RouteObject[] => {
  return routes.map((r): RouteObject => {
    const route = {} as RouteObject;
    if (r.path === "") {
      route.index = true;
    } else {
      route.path = r.path;
    }
    if (r.lazyComponent) {
      const LazyComponent = lazy(r.lazyComponent);
      route.element = (
        <RouteAccessGuard path={r.path}>
          <LazyComponent />
        </RouteAccessGuard>
      );
    }
    route.HydrateFallback = LoadingApp;

    return route;
  });
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGate>
        <UIProvider>
          <MainLayoutUI />
        </UIProvider>
      </AuthGate>
    ),
    children: convertLazyRoutes(arrayRoutes),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <UIProvider>
          <LoginUI />
        </UIProvider>
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <ErrorPage handleClick={() => window.history.back()} />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
