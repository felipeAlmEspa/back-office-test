import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import type { AxiosErrorType } from "@/types/axios";

export type ApiMutationOptions<TResponse, TRequest, TContext = unknown> =
  UseMutationOptions<TResponse, AxiosErrorType, TRequest, TContext>;

export type ApiMutationResult<TResponse, TRequest, TContext = unknown> =
  UseMutationResult<TResponse, AxiosErrorType, TRequest, TContext>;

export type TLabelValueNumber = {
  label: string;
  value: number;
  code: string;
};


export type ApiEnvelope<TResult> = {
  code: number;
  message: string;
  result: TResult;
  details?: unknown;
};

