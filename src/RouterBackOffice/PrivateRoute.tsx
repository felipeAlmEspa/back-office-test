import { Navigate, RouteObject } from "react-router-dom";
import HomeUI from "@/view/Main/Home/HomeUI.controller";
import TestAsyncPage from "@/view/TestAsyncPage/TestAsyncPage";

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="home" replace />,
  },
  {
    path: "home",
    element: <HomeUI />,
  },
  {
    path: "security/accesses/roles",
    element: <TestAsyncPage />,
  },
];
