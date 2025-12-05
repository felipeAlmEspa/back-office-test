import { useNavigate } from "react-router-dom";
import { findFullPath } from "@/helper";

type Primitive = string | number | boolean | null | undefined;

type QueryValue = Primitive | Primitive[];

export type QueryParams = Record<string, QueryValue>;

function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const usp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null) return;
        usp.append(key, String(v));
      });
    } else {
      usp.set(key, String(value));
    }
  });

  const query = usp.toString();
  return query ? `?${query}` : "";
}

export interface NavigateWithQueryOptions {
  replace?: boolean;
}

export const useNavigateWithQuery = () => {
  const navigate = useNavigate();

  const navigateWithQuery = (
    targetRoute: string,
    params?: QueryParams,
    options?: NavigateWithQueryOptions
  ) => {
    // const full = findFullPath(targetRoute);
    // if (!full) return;
    const qs = buildQuery(params);
    const replace = options?.replace === true;
    navigate(`/${targetRoute}${qs}` as string, { replace });
  };

  const goBack = (
    fallbackRoute?: string,
    fallbackParams?: QueryParams,
    options?: NavigateWithQueryOptions
  ) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    if (!fallbackRoute) return;
    const full = findFullPath(fallbackRoute);
    if (!full) return;
    const qs = buildQuery(fallbackParams);
    const replace = options?.replace ?? true;
    navigate(`/${full}${qs}` as string, { replace });
  };

  return { navigateWithQuery, goBack };
};


