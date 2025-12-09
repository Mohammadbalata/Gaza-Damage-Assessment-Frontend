import { useApi, UseApiOptions, UseApiReturn } from "./useApi";
import { api } from "../../services/api";

export function useDelete<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi<T>(() => api.delete(url), options);
}
