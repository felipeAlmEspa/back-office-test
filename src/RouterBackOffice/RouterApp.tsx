import { validataAccessRefreshToken } from "@/services/security/auth.service";
import HomeUI from "@/view/Main/Home/HomeUI.controller";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    action: validataAccessRefreshToken,
    lazy: () => import("@/view/Security/Login/LoginUI.controller").then((module) => ({
      Component: module.default,
    })),
  },
  {
    path: "/dashboard",
    element: <div>Dashboard</div>,
    loader: validataAccessRefreshToken,
    children: [
      {
        path: "/dashboard/home",
        element: <HomeUI />,
      },
    ],
  },
  {
    path: "**",
    element: <div>404</div>,
  },
]);

export default router;