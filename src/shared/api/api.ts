import axios, { AxiosInstance, AxiosError } from "axios";
import { clearAuthToken, getAuthToken } from "../utils/storage";

const PROD_URL = "https://admin.sawabuildgaza.com/api";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || PROD_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

type NestedApiData<T> = { data: { data: T } };
type FlatApiData<T> = { data: T };
type ApiEnvelope<T> = NestedApiData<T> | FlatApiData<T> | T;

function isNestedApiData<T>(value: unknown): value is NestedApiData<T> {
  if (!value || typeof value !== "object") return false;
  const v = value as { data?: unknown };
  if (!v.data || typeof v.data !== "object") return false;
  return "data" in (v.data as object);
}

function isFlatApiData<T>(value: unknown): value is FlatApiData<T> {
  if (!value || typeof value !== "object") return false;
  const v = value as { data?: unknown };
  return v.data !== undefined;
}

export const extractData = <T>(response: ApiEnvelope<T>): T => {
  if (isNestedApiData<T>(response)) {
    return response.data.data;
  }
  if (isFlatApiData<T>(response)) {
    return response.data as T;
  }
  return response as T;
};

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (
      (config.method === "post" || config.method === "patch") &&
      config.data
    ) {
      console.log(
        `[API] ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect if a token existed (real expiry) and we're not already on the sign-in page
      const hadToken = getAuthToken() !== null;
      const onSignIn = window.location.pathname.startsWith("/sign-in");
      if (hadToken && !onSignIn) {
        clearAuthToken();
        window.location.assign("/sign-in");
      }
    }
    if (error.response?.status === 400) {
      const errorData = error.response?.data as any;
      console.error("[API] 400 Bad Request Details:", {
        url: error.config?.url,
        method: error.config?.method,
        sentData: error.config?.data,
        backendMessage:
          errorData?.message || errorData?.error || errorData?.msg,
        backendErrors: errorData?.errors || errorData?.details,
        fullResponseData: errorData,
      });
      console.table(errorData);
    }
    return Promise.reject(error);
  }
);

export { api };
export const axiosClient = api;
export default api;
