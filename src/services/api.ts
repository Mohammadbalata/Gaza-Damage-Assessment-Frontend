import axios, { AxiosInstance, AxiosError } from "axios";

// const LOCAL_URL = 'http://localhost:3000/api'
const PROD_URL = "http://localhost:3000/api";

const api: AxiosInstance = axios.create({
  baseURL: PROD_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// type NestedApiData<T> = { data: { data: T } };
// type FlatApiData<T> = { data: T };
// // type ApiEnvelope<T> = NestedApiData<T> | FlatApiData<T> | T;

// // function isNestedApiData<T>(value: unknown): value is NestedApiData<T> {
// //   if (!value || typeof value !== "object") return false;
// //   const v = value as { data?: unknown };
// //   if (!v.data || typeof v.data !== "object") return false;
// //   return "data" in (v.data as object);
// // }

// // function isFlatApiData<T>(value: unknown): value is FlatApiData<T> {
// //   if (!value || typeof value !== "object") return false;
// //   const v = value as { data?: unknown };
// //   return v.data !== undefined;
// // }

// Normalise API responses so callers always get T
// const extractData = <T>(response: ApiEnvelope<T>): T => {
//   if (isNestedApiData<T>(response)) {
//     return response.data.data;
//   }

//   if (isFlatApiData<T>(response)) {
//     return response.data as T;
//   }

//   return response as T;
// };

// Request interceptor - Add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log POST/PATCH requests for debugging
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized response detected", error.response);
    }
    // Log error responses for debugging
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
