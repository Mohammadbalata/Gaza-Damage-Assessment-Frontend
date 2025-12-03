import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { api } from '../services/api';

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
}

/**
 * Generic hook for API calls with axios
 */
export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<any>,
  options: UseApiOptions = {}
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
        const result = response.data.data;
        setData(result);
        
        if (onSuccess) onSuccess(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || err.message
            : 'An unexpected error occurred';

        if (onError) onError(errorMessage);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, onSuccess, onError]
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

  return { data, loading, error, execute, reset };
}

/**
 * Hook for GET requests
 */
export function useGet<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(
    () => api.get(url),
    options
  );
}

/**
 * Hook for POST requests
 */
export function usePost<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(
    (payload: any) => api.post(url, payload),
    options
  );
}

/**
 * Hook for PUT requests
 */
export function usePut<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(
    (payload: any) => api.put(url, payload),
    options
  );
}

/**
 * Hook for DELETE requests
 */
export function useDelete<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(
    () => api.delete(url),
    options
  );
}

/**
 * Hook for PATCH requests
 */
export function usePatch<T = any>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(
    (payload: any) => api.patch(url, payload),
    options
  );
}

export default useApi;

