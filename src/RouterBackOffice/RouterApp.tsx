import { dashboardLoader, loginAction } from "@/services/security/auth.service";
import HomeUI from "@/view/Main/Home/HomeUI.controller";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <div>Login</div>,
    action: async ({ request }) => {
      const formData = await request.formData();
      const username = formData.get("username");
      const password = formData.get("password");
      return loginAction(username as string, password as string);
    },
  },
  {
    path: "/dashboard",
    element: <div>Dashboard</div>,
    loader: dashboardLoader,
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