import {
  redirectIfAuthenticatedLoader,
  rootRedirectLoader,
  validataAccessRefreshToken,
  validateAccessRouteAsync,
} from "@/services/security/auth.service";
import { MainLayoutUI } from "@/view/Main/MainLayout/MainLayoutUI.controller";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { privateRoutes } from "./PrivateRoute";


const router = createBrowserRouter([
  {
    path: "/",
    loader: rootRedirectLoader,
    element: <div />,
  },
  {
    path: "/login",
    loader: redirectIfAuthenticatedLoader,
    lazy: () =>
      import("@/view/Security/Login/LoginUI.controller").then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: "/",
    element: <MainLayoutUI />,
    loader: validataAccessRefreshToken,
    children: privateRoutes.map((route: RouteObject) => ({
      ...route,
      loader: validateAccessRouteAsync(route.path),
    })),
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);

export default router;