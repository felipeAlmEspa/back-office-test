import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type KeyString = string;

export interface UseUrlSearchParamsFiltersReturn<TKeys extends KeyString> {
  values: Record<TKeys, string>;
  setters: Record<TKeys, (value: string) => void>;
  searchParams: URLSearchParams;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  deleteKeys: () => void;
  removeParam: (key: TKeys) => void;
}

// Hook minimalista: solo leer y escribir claves específicas en los search params
export function useUrlSearchParamsFilters<TKeys extends KeyString>(
  keys: readonly TKeys[]
): UseUrlSearchParamsFiltersReturn<TKeys> {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = useMemo(() => {
    const result = {} as Record<TKeys, string>;
    keys.forEach((key) => {
      result[key] = searchParams.get(key) || "";
    });
    return result;
  }, [keys, searchParams]);

  const setValue = useCallback(
    (key: TKeys, value: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (value === "" || value == null) {
          params.delete(key as string);
        } else {
          params.set(key as string, value);
        }
        return params;
      });
    },
    [setSearchParams]
  );

  const setters = useMemo(() => {
    const result = {} as Record<TKeys, (value: string) => void>;
    keys.forEach((key) => {
      result[key] = (value: string) => setValue(key, value);
    });
    return result;
  }, [keys, setValue]);

  const deleteKeys = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const removeParam = useCallback((key: TKeys) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete(key as string);
      return params;
    });
  }, [setSearchParams]);

  return {
    values,
    setters,
    searchParams,
    setSearchParams,
    deleteKeys,
    removeParam,
  };
}
