import { useApi, UseApiOptions, UseApiReturn } from "./useApi";
import { api } from "../../services/api";

export function usePatch<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi<T>((payload: any) => api.patch(url, payload), options);
}
