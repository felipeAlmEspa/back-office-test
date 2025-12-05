import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_PAGINATION_CONFIG,
  useTable,
  cleanObject,
} from "@itsa-develop/itsa-fe-components";
import { TablePaginationConfig } from "antd";
import { useUrlSearchParamsFilters } from "@/hooks/useUrlSearchParamsFilters";

export interface UseGenericFiltersResult<
  TKeys extends string,
  TFilters extends Record<string, unknown>
> {
  filters: Partial<TFilters> & { page?: number; perPage?: number };
  setFilters: (
    next: Partial<TFilters> & { page?: number; perPage?: number }
  ) => void;
  pagination: TablePaginationConfig;
  onChangePagination: (pagination?: TablePaginationConfig) => void;
  paramValues: Record<TKeys, string>;
  paramSetters: Record<TKeys, (value: string) => void>;
  debounced: Record<TKeys, (value: string) => void>;
  loadingByKey: Record<TKeys, boolean>;
}

export interface UseGenericFiltersOptions<
  TKeys extends string,
  TFilters extends Record<string, unknown>
> {
  keys: readonly TKeys[];
  debounceMs?: number | Partial<Record<TKeys, number>>;
  enableLoading?: boolean;
  mapParamsToFilters?: (values: Record<TKeys, string>) => Partial<TFilters>;
  initialFilters?: Partial<TFilters>;
}

export const useFilterTableUI = <
  TKeys extends string,
  TFilters extends Record<string, unknown>
>(
  options: UseGenericFiltersOptions<TKeys, TFilters>
): UseGenericFiltersResult<TKeys, TFilters>  => {
  const {
    keys,
    debounceMs = 300,
    enableLoading = true,
    mapParamsToFilters,
    initialFilters,
  } = options;

  const { pagination, onChangePagination } = useTable(
    DEFAULT_PAGINATION_CONFIG
  );
  const { values: paramValues, setters: paramSetters } =
    useUrlSearchParamsFilters(keys);

  const [filters, setFilters] = useState<
    Partial<TFilters> & { page?: number; perPage?: number }
  >(
    cleanObject({
      page: pagination.current,
      perPage: pagination.pageSize,
      ...(initialFilters || {}),
    })
  );

  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const loadingRef = useRef<Record<string, boolean>>({});
  const [, forceRender] = useState(0);

  const getDelayFor = (key: TKeys) => {
    return typeof debounceMs === "number" ? debounceMs : debounceMs[key] ?? 300;
  };

  const setLoading = (key: TKeys, value: boolean) => {
    if (!enableLoading) return;
    loadingRef.current[key] = value;
    forceRender((x) => x + 1);
  };

  const debounceDep = typeof debounceMs === "number" ? debounceMs : JSON.stringify(debounceMs);

  const { debounced, loadingByKey } = useMemo(() => {
    const debouncedFns = {} as Record<TKeys, (value: string) => void>;
    const loadingState = {} as Record<TKeys, boolean>;

    keys.forEach((key) => {
      loadingState[key] = Boolean(loadingRef.current[key]);
      debouncedFns[key] = (value: string) => {
        if (timeoutsRef.current[key]) {
          clearTimeout(timeoutsRef.current[key]);
        }
        setLoading(key, true);
        timeoutsRef.current[key] = setTimeout(() => {
          paramSetters[key](value);
          setLoading(key, false);
        }, getDelayFor(key));
      };
    });

    return { debounced: debouncedFns, loadingByKey: loadingState } as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, paramSetters, debounceDep, enableLoading]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach((t) => clearTimeout(t));
    };
  }, []);

  // Sync URL params + pagination into filters via optional mapping
  useEffect(() => {
    const mapped = mapParamsToFilters
      ? mapParamsToFilters(paramValues)
      : ({} as Partial<TFilters>);
    setFilters(
      cleanObject({
        page: pagination.current,
        perPage: pagination.pageSize,
        ...(mapped || {}),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramValues, pagination.current, pagination.pageSize]);

  return {
    filters,
    setFilters,
    pagination,
    onChangePagination,
    paramValues,
    paramSetters,
    debounced,
    loadingByKey,
  };
}
