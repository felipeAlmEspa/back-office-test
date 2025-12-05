import type {
  ICheckSessionRequest,
  ICheckSessionResult,
  ICloseSessionRequest,
  IExchangeCodeRequest,
  IExchangeCodeResponseResult,
  ILoginRequest,
  IResponseGeneric,
  IValidateRouteRequest,
} from "../../view/Security/interfaces";
import { API_ROUTES } from "@/api/routes";
import { useApiGetQuery } from "@/api/axiosMethods";
import {
  IUserInformation,
  IValidateRouteResponse,
  Result,
} from "@itsa-develop/itsa-fe-components";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosErrorType } from "@/types/axios";
import { APIS_VERSIONS, BASE_URL, TYPE_ENVIRONMENT } from "@/constants";
import axios, { AxiosError } from "axios";
import { apiInstance } from "@/api/config";

export const securityKeys = {
  init: () => ["security"] as const,
  microFrontends: () => [...securityKeys.init(), "microFrontends"] as const,
  validateRoute: () => [...securityKeys.init(), "validateRoute"] as const,
  getPermissions: () => [...securityKeys.init(), "getPermissions"] as const,
  userInformation: () => [...securityKeys.init(), "userInformation"] as const,
};

export const useCheckSession = (
  options?: UseMutationOptions<
    ICheckSessionResult[],
    AxiosErrorType,
    ICheckSessionRequest
  >
) => {
  const mutationFn = async (payload: ICheckSessionRequest) => {
    const { data } = await axios.post(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.checkSession}`,
      payload
    );
    return data.result;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useCloseSession = (
  options?: UseMutationOptions<
    IResponseGeneric,
    AxiosError,
    ICloseSessionRequest
  >
) => {
  const mutationFn = async (payload: ICloseSessionRequest) => {
    const { data } = await axios.patch<IResponseGeneric>(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.closeSession}?session=${payload.session}`
    );
    return data;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useLogin = (
  options?: UseMutationOptions<string, AxiosError, ILoginRequest>
) => {
  const mutationFn = async (payload: ILoginRequest) => {
    const { data } = await axios.post(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.login}`,
      payload
    );
    return data.result;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useExchangeCode = (
  options?: UseMutationOptions<
    IExchangeCodeResponseResult,
    AxiosError,
    IExchangeCodeRequest
  >
) => {
  const mutationFn = async (params: IExchangeCodeRequest) => {
    const { data } = await axios.get(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.exchangeCode}?claim_code=${params.claimCode}`
    );
    return data.result;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useValidateRoute = (
  params: IValidateRouteRequest,
  options?: Omit<
    UseQueryOptions<boolean, AxiosErrorType, boolean, QueryKey>,
    "queryKey" | "queryFn"
  >
) =>
  useApiGetQuery<IValidateRouteRequest, boolean>(
    securityKeys.validateRoute(),
    `${APIS_VERSIONS.security}${API_ROUTES.validateRoute}`,
    params,
    options
  );

export const useGetPermissions = (
  options?: Omit<
    UseQueryOptions<Result, AxiosErrorType, Result, QueryKey>,
    "queryKey" | "queryFn"
  >
) =>
  useApiGetQuery<undefined, Result>(
    securityKeys.getPermissions(),
    `${APIS_VERSIONS.security}${API_ROUTES.permissions}?mode_environment=${TYPE_ENVIRONMENT}`,
    undefined,
    options
  );

export const useUserInformation = () =>
  useApiGetQuery<undefined, IUserInformation>(
    securityKeys.userInformation(),
    `${APIS_VERSIONS.security}${API_ROUTES.userInformation}`
  );

export const validateActionExecute = async (
  actionTypeId: number,
  programId: number,
  agencyId: number
) => {
  try {
    const { data } = await apiInstance.get<IValidateRouteResponse>(
      APIS_VERSIONS.security + API_ROUTES.validatePermissions,
      {
        params: {
          program_id: programId,
          agency_id: agencyId,
          action: actionTypeId,
        },
      }
    );
    return data.result;
  } catch (error) {
    console.log("error =>", error);
    return false;
  }
};
