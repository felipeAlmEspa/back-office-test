import {
  QueryKey,
  useMutation,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { apiInstance, get, patch, post } from "@/api/config";
import { AxiosErrorType } from "@/types/axios";
import { ApiMutationOptions, ApiMutationResult } from "@/types";
import { useNotification } from "@itsa-develop/itsa-fe-components";
import humps from "humps";
import { errorMessageItemExists } from "@/helper";

export function useApiPostMutation<TRequest = unknown, TResponse = unknown>(
  showErrorNotification: boolean,
  url: string,
  options?: ApiMutationOptions<TResponse, TRequest>
): ApiMutationResult<TResponse, TRequest> {
  const { openNotificationWithIcon } = useNotification();
  return useMutation<TResponse, AxiosErrorType, TRequest>({
    mutationKey: ["POST", url],
    mutationFn: (payload: TRequest) => post<TRequest, TResponse>(url, payload),
    ...options,
    onError: (error) => {
      if (showErrorNotification === true) {
        openNotificationWithIcon({
          type: "error",
          message: error.message,
          description: errorMessageItemExists(error.message),
        });
      }
    },
  });
}

export function useApiGetQuery<TParams = unknown, TResponse = unknown>(
  key: QueryKey,
  url: string,
  params?: TParams,
  options?: Omit<
    UseQueryOptions<TResponse, AxiosErrorType, TResponse, QueryKey>,
    "queryKey" | "queryFn"
  > & {
    onError?: (error: AxiosErrorType) => void;
    onSuccess?: (data: TResponse) => void;
    onSettled?: (data?: TResponse, error?: AxiosErrorType) => void;
  }
): UseQueryResult<TResponse, AxiosErrorType> {
  const dataResponse = async () => {
    const decamelizedParams = humps.decamelizeKeys(params);
    return await get<TParams, TResponse>(url, decamelizedParams);
  };
  return useQuery<TResponse, AxiosErrorType, TResponse, QueryKey>({
    queryKey: Array.isArray(key) ? [...key, params ?? {}] : [key, params ?? {}],
    queryFn: dataResponse,
    enabled: options?.enabled ?? true,
    ...options,
  });
}

export type PatchVariables<TData, TParams> = {
  data?: TData;
  params?: TParams;
};

export function useApiPatchMutation<
  TData = unknown,
  TResponse = unknown,
  TParams = unknown
>(
  showErrorNotification: boolean,
  url: string,
  mutationOptions?: UseMutationOptions<
    TResponse,
    AxiosErrorType,
    PatchVariables<TData, TParams>,
    unknown
  >
): UseMutationResult<
  TResponse,
  AxiosErrorType,
  PatchVariables<TData, TParams>,
  unknown
> {
  const { openNotificationWithIcon } = useNotification();
  return useMutation<
    TResponse,
    AxiosErrorType,
    PatchVariables<TData, TParams>,
    unknown
  >({
    mutationKey: ["PATCH", url],
    mutationFn: ({ data, params }) =>
      patch<TData, TResponse, TParams>(url, data, params),
    ...mutationOptions,
    onError: (error) => {
      if (showErrorNotification === true) {
        openNotificationWithIcon({
          type: "error",
          message: error.message,
          description: error.response?.data.message,
        });
      }
    },
  });
}

export function useApiGetMutation<TRequest = unknown, TResponse = unknown>(
  showErrorNotification: boolean,
  url: string,
  options?: ApiMutationOptions<TResponse, TRequest>
): ApiMutationResult<TResponse, TRequest> {
  const { openNotificationWithIcon } = useNotification();
  return useMutation<TResponse, AxiosErrorType, TRequest>({
    mutationKey: ["GET", url],
    mutationFn: (payload: TRequest) => get<TRequest, TResponse>(url, payload),
    ...options,
    onError: (error) => {
      if (showErrorNotification === true) {
        openNotificationWithIcon({
          type: "error",
          message: error.message,
          description: error.response?.data.message,
        });
      }
    },
  });
}

export function useApiDeleteMutation<
  TResponse = unknown,
  TVariables extends string | number = number
>(
  showErrorNotification: boolean,
  baseUrl: string,
  mutationOptions?: UseMutationOptions<
    TResponse,
    AxiosErrorType,
    TVariables,
    unknown
  >
): UseMutationResult<TResponse, AxiosErrorType, TVariables, unknown> {
  const { openNotificationWithIcon } = useNotification();

  return useMutation<TResponse, AxiosErrorType, TVariables>({
    mutationKey: ["DELETE", baseUrl],
    mutationFn: async (id: TVariables) => {
      const { data } = await apiInstance.delete<TResponse>(`${baseUrl}/${id}/`);
      return data;
    },
    onError: (error) => {
      if (showErrorNotification) {
        openNotificationWithIcon({
          type: "error",
          message: error.message,
          description: error.response?.data.message,
        });
      }
    },
    ...mutationOptions,
  });
}

export function useApiGetMutationById<TResponse = unknown>(
  apiKey: QueryKey,
  showErrorNotification: boolean,
  baseUrl: string,
  options?: ApiMutationOptions<TResponse, number>,
): ApiMutationResult<TResponse, number> {
  const { openNotificationWithIcon } = useNotification();
  return useMutation<TResponse, AxiosErrorType, number>({
    mutationKey: apiKey
      ? Array.isArray(apiKey)
        ? ["GET", ...apiKey, baseUrl]
        : ["GET", apiKey, baseUrl]
      : ["GET", baseUrl],
    mutationFn: (id: number) => get<undefined, TResponse>(`${baseUrl}${id}/`),
    ...options,
    onError: (error) => {
      if (showErrorNotification === true) {
        openNotificationWithIcon({
          type: "error",
          message: error.message,
          description: error.response?.data.message,
        });
      }
    },
  });
}


