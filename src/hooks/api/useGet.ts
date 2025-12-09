import { useApi, UseApiOptions, UseApiReturn } from "./useApi";
import { api } from "../../services/api";

export function useGet<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi<T>(() => api.get(url), { immediate: true, ...options });
}
