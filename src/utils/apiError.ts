import axios, { type AxiosError } from "axios";
import type { ErrorType } from "@/types/axios";

export const isAxiosErrorWithApiData = (
  error: unknown
): error is AxiosError<ErrorType> => {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as Partial<ErrorType> | undefined;
  return typeof data?.message === "string" && typeof data?.code === "number";
};

export const getApiError = (error: unknown): ErrorType => {
  if (isAxiosErrorWithApiData(error) && error.response?.data) {
    return error.response.data;
  }
  return {
    message: (error as Error)?.message || "Error desconocido",
    code: -1,
    result: null,
  };
};

export const getApiErrorMsg = (error: unknown): string => {
  return getApiError(error).message;
};

export const getApiErrorCode = (error: unknown): number => {
  return getApiError(error).code;
};


