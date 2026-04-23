import { useState, useEffect, useCallback } from "react";
import ApiErrorHandler from "../../api/errorHandler";
import { api } from "../../api/api";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Generic hook for any axios-based API call.
 *
 * Handles the `data / loading / error` triplet so callers don't repeat
 * `useState` + `useEffect` + try/catch on every screen. Errors are routed
 * through `ApiErrorHandler` so the returned `error` is always a string.
 *
 * Most consumers should reach for the verb-specific helpers below
 * (`useGet`, `usePost`, etc.) rather than calling `useApi` directly.
 *
 * @param apiCall  Function returning a Promise — typically `() => api.get(url)`.
 *                 The hook awaits it and stores `response.data` on `data`.
 * @param options  `immediate` runs the call once on mount; `onSuccess`/`onError`
 *                 fire after each invocation.
 * @returns        `{ data, loading, error, execute, reset, setData }`. Call
 *                 `execute(...)` to fire the request manually; awaited value is
 *                 the response data on success or `undefined` on failure.
 */
export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<any>,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall(...args);
        const result = response.data;
        setData(result);

        if (onSuccess) onSuccess(result);
        return result;
      } catch (err) {
        const errorMessage = ApiErrorHandler.handle(err);
        setError(errorMessage);
        if (onError) onError(errorMessage);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { data, loading, error, execute, reset, setData };
}

/**
 * GET against `url`. Pass `{ immediate: true }` to fire on mount.
 *
 * @example
 *   const { data, loading } = useGet<User[]>("/users", { immediate: true });
 */
export function useGet<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(() => api.get(url), options);
}

/**
 * POST to `url`. Call `execute(payload)` to fire the request.
 *
 * @example
 *   const { execute, loading } = usePost<LoginPayload>("/auth/login");
 *   await execute({ email, password });
 */
export function usePost<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>((payload: any) => api.post(url, payload), options);
}

/**
 * PUT to `url`. Call `execute(payload)` to fire the request.
 */
export function usePut<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>((payload: any) => api.put(url, payload), options);
}

/**
 * DELETE against `url`. Call `execute()` to fire the request.
 */
export function useDelete<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(() => api.delete(url), options);
}

/**
 * PATCH to `url`. Call `execute(payload)` to fire the request.
 */
export function usePatch<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>((payload: any) => api.patch(url, payload), options);
}

export default useApi;
