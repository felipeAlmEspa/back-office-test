import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { APIS_VERSIONS, KEY_STORE } from "@/constants";
import { clearLocalStorage } from "@itsa-develop/itsa-fe-components";
import { apiInstance } from "@/api/config";
import { joinmModPath } from "@/helper";
import { API_ROUTES } from "@/api/routes";

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: undefined,

      setToken: (token: string) => {
        set({ token }, false, "setToken");
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem(KEY_STORE.REFRESH_TOKEN);
          if (!refreshToken) {
            clearLocalStorage();
            return;
          }

          const res = await apiInstance.post(joinmModPath(APIS_VERSIONS.security, API_ROUTES.logout), {
            refresh: refreshToken,
          });
          if (res.status === 200) {
            clearLocalStorage();
            window.location.href = "/login";
            return;
          }
        } catch (error) {
          console.error("error", error);
        }
      },
    }),
    { name: "AuthStore" }
  )
);
