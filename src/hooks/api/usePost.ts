import { useApi, UseApiOptions, UseApiReturn } from "./useApi";
import { api } from "../../services/api";

export function usePost<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi<T>((payload: any) => api.post(url, payload), options);
}
