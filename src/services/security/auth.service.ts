import { apiInstance } from "@/api/config";
import { BASE_URL, APIS_VERSIONS, KEY_STORE } from "@/constants";
import { API_ROUTES } from "@/api/routes";
import { useAuthStore } from "@/store/auth.store";
import { redirect } from "react-router-dom";

export const loginAction = async (username: string, password: string) => {
  const accessToken = useAuthStore.getState().token;
  if (accessToken) {
    return redirect("/dashboard");
  }
  const response = await apiInstance.post(
    `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.login}`,
    {
      username,
      password,
    }
  );
  return response.data;
};

export const dashboardLoader = async () => {
  try {
    const response = await apiInstance.post(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.refreshToken}`,
      {
        refresh: localStorage.getItem(KEY_STORE.REFRESH_TOKEN),
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return redirect("/login");
    }
  } catch (error) {
    console.log("error =>", error);
    return redirect("/login");
  }
};
