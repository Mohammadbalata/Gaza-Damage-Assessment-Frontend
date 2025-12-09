import { useApi, UseApiOptions, UseApiReturn } from "./useApi";
import { api } from "../../services/api";

export function usePut<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi<T>((payload: any) => api.put(url, payload), options);
}
