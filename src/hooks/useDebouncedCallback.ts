import { useEffect, useMemo, useRef, useState } from "react";

export type DebouncedFunction<TArgs extends unknown[]> = (
  ...args: TArgs
) => void;

export interface UseDebouncedCallbackOptions {
  leading?: boolean;
  trailing?: boolean;
  enableLoading?: boolean;
}

export interface UseDebouncedCallbackReturn<TArgs extends unknown[]> {
  debouncedCallback: DebouncedFunction<TArgs>;
  isLoading: boolean;
}

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
  options: UseDebouncedCallbackOptions = { trailing: true, enableLoading: true }
): UseDebouncedCallbackReturn<TArgs> {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<TArgs | null>(null);
  const isLeadingCalledRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debounced = useMemo<DebouncedFunction<TArgs>>(() => {
    const { leading = false, trailing = true, enableLoading = false } = options;

    return (...args: TArgs) => {
      lastArgsRef.current = args;

      // Activar loading si está habilitado
      if (enableLoading && !isLeadingCalledRef.current) {
        setIsLoading(true);
      }

      const invoke = () => {
        if (trailing && lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
          lastArgsRef.current = null;
        }
        isLeadingCalledRef.current = false;
        // Desactivar loading cuando se ejecuta el callback
        if (enableLoading) {
          setIsLoading(false);
        }
      };

      const callLeadingNow = leading && !isLeadingCalledRef.current;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (callLeadingNow) {
        isLeadingCalledRef.current = true;
        callbackRef.current(...args);
        // Desactivar loading si se ejecuta inmediatamente
        if (enableLoading) {
          setIsLoading(false);
        }
      }

      timeoutRef.current = setTimeout(invoke, delayMs);
    };
  }, [delayMs, options]);

  return {
    debouncedCallback: debounced,
    isLoading: options.enableLoading ? isLoading : false,
  };
}
