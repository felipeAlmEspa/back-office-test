import { APIS_VERSIONS, BASE_URL, KEY_STORE } from "@/constants";
import { API_ROUTES } from "./routes";
import type {
  IExchangeCodeResponse,
  ILoginResponse,
  RefreshTokenResponse,
} from "@/view/Security/interfaces";
import { useAuthStore } from "@/store/auth.store";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AxiosErrorType } from "@/types/axios";
import { apiValidateAuthToken, flattenErrors } from "@/helper";
import { clearLocalStorage } from "@itsa-develop/itsa-fe-components";
import humps from "humps";

export type ApiError = {
  url?: string;
  method?: string;
  status?: number;
  message: string;
  details: unknown;
  payload?: unknown;
};
let refreshInFlight: Promise<string | null> | null = null;

const simpleAxiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getInstance = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const finalBaseUrl = `${BASE_URL}`;
      const tempToken = useAuthStore.getState().token;

      config.baseURL = finalBaseUrl;
      if (config.headers && tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const originalRequest = error?.config ?? {};
      const isAuthEndpoint =
        typeof originalRequest?.url === "string" &&
        (originalRequest.url?.includes(API_ROUTES.refreshToken) ||
          originalRequest.url?.includes(API_ROUTES.revaliteRefresh));

      if (status === 401 && !isAuthEndpoint && !(originalRequest)._retry) {
        (originalRequest)._retry = true;
        try {
          const newToken = await refreshAccessTokenInternal();
          if (newToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (e) {
          console.log('refreshAccessTokenInternal error =>',e);
          // Fall through to reject
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiInstance = getInstance(simpleAxiosInstance);

export const revalidateToken = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const { setToken } = useAuthStore.getState();
    const revalidate = await axios.post(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.revaliteRefresh}`,
      {
        refresh: refreshToken,
      }
    );
    const access = revalidate.data.result?.access;
    const newRefresh = revalidate.data.result?.refresh;
    if (revalidate.data.code === 1 && access) {
      setToken(access);
      if (newRefresh) localStorage.setItem(KEY_STORE.REFRESH_TOKEN, newRefresh);
      return access;
    }
    return null;
  } catch (err) {
    console.error("fetchAccessToken: Error revalidando refresh token", err);
    const logout = useAuthStore.getState().logout;
    await logout();
    return null;
  }
};

// Single in-flight refresh pipeline to avoid parallel refresh requests
const refreshAccessTokenInternal = async (): Promise<string | null> => {
  if (refreshInFlight) return await refreshInFlight;

  const run = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(KEY_STORE.REFRESH_TOKEN);
    if (!refreshToken) {
      clearLocalStorage();
      return null;
    }
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.refreshToken}`,
        { refresh: refreshToken }
      );
      const access = response.data.result?.access;
      const newRefresh = response.data.result?.refresh;
      if (!access) return null;
      const { setToken } = useAuthStore.getState();
      setToken(access);
      if (newRefresh) localStorage.setItem(KEY_STORE.REFRESH_TOKEN, newRefresh);
      return access;
    } catch {
      // Try revalidation as fallback
      return await revalidateToken(refreshToken);
    }
  };

  refreshInFlight = run()
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    }) as Promise<string | null>;

  return await refreshInFlight;
};

const errorHandler = async (error: unknown): Promise<ApiError> => {
  if (axios.isAxiosError<AxiosErrorType>(error)) {
    const apiError = error.response?.data;
    const apiPayload = error.config?.data;
    apiValidateAuthToken(error);
    const newError: ApiError = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: apiError?.message ?? error.message,
      details: flattenErrors(apiError?.details ?? {}),
      payload: apiPayload,
    };
    console.error("ERROR API ELIMINAR PARA PRODUCCION =>", newError);
    return newError;
  }
  return {
    message: (error as Error)?.message || "Error desconocido",
    details: null,
  };
};

const request = async <TResponse>(
  fn: () => Promise<AxiosResponse<TResponse>>
) => {
  try {
    const response = await fn();
    const responseData = response.data as { result: TResponse };
    const resultCamelCase = humps.camelizeKeys(responseData.result);
    return resultCamelCase as TResponse;
  } catch (error) {
    const newError = await errorHandler(error);
    throw newError;
  }
};

export const get = <TParams, TResponse>(url: string, params?: TParams) => {
  const decamelizedParams = humps.decamelizeKeys(params);
  return request<TResponse>(() =>
    apiInstance.get(url, { params: decamelizedParams })
  );
};

export const post = <TData, TResponse>(url: string, data?: TData) => {
  const decamelizedData = humps.decamelizeKeys(data);
  return request<TResponse>(() => apiInstance.post(url, decamelizedData));
};

export const patch = <TData, TResponse, TParams>(
  url: string,
  data?: TData,
  params?: TParams
) => {
  const decamelizedData = humps.decamelizeKeys(data);
  const decamelizedParams = humps.decamelizeKeys(params);
  return request<TResponse>(() =>
    apiInstance.patch(url, decamelizedData, { params: decamelizedParams })
  );
};

export const destroy = <TParams, TResponse>(url: string, params?: TParams) => {
  const decamelizedParams = humps.decamelizeKeys(params);
  return request<TResponse>(() =>
    apiInstance.delete(url, { params: decamelizedParams })
  );
};

export const deleteWithData = <TData, TResponse>(url: string, data?: TData) => {
  const decamelizedData = humps.decamelizeKeys(data);
  return request<TResponse>(() =>
    apiInstance.delete(url, { data: decamelizedData })
  );
};

export const put = <TData, TResponse>(url: string, data?: TData) => {
  const decamelizedData = humps.decamelizeKeys(data);
  return request<TResponse>(() => apiInstance.put(url, decamelizedData));
};

export const fetchAccessToken = async (): Promise<string | null> => {
  const { token, setToken } = useAuthStore.getState();

  if (token) {
    return token;
  }
  const access = await refreshAccessTokenInternal();
  if (access) {
    setToken(access);
  }
  return access;
};

export const getTokenByClaimCode = async (
  claimCode: string
): Promise<string | null> => {
  try {
    const { setToken } = useAuthStore.getState();
    const response = await axios.get<IExchangeCodeResponse>(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.exchangeCode}?claim_code=${claimCode}`
    );
    if (response.data.code === 1 && response.data.result?.access) {
      setToken(response.data.result?.access);
      localStorage.setItem(
        KEY_STORE.REFRESH_TOKEN,
        response.data.result?.refresh
      );
      return response.data.result?.access;
    }
    return null;
  } catch (error) {
    console.error(
      "getTokenByClaimCode: Error obteniendo token por claim code",
      error
    );
    return null;
  }
};

export const getClaimCodeByRefreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(KEY_STORE.REFRESH_TOKEN);
  if (!refreshToken) {
    return null;
  }
  const response = await apiInstance.post<ILoginResponse>(
    `${APIS_VERSIONS.security}${API_ROUTES.refreshToken}`,
    {
      refresh: refreshToken,
      rcc: true,
    }
  );
  if (response.data.code === 1 && response.data.result) {
    return response.data.result;
  }
  return null;
};

export const fetchRefreshToken = async (): Promise<{
  access: string;
  refresh: string;
} | null> => {
  const access = await refreshAccessTokenInternal();
  const refresh = localStorage.getItem(KEY_STORE.REFRESH_TOKEN);
  if (access && refresh) return { access, refresh };
  return null;
};
