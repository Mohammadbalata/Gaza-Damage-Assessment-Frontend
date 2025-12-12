import axios, { AxiosInstance, AxiosError } from "axios";
import { extractData } from "../api/client";

// const LOCAL_URL = 'http://localhost:3000/api'
const PROD_URL = "https://backend-5549.onrender.com";

export type UserRole = "admin" | "supervisor";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Citizen {
  id: number;
  national_id: string;
  first_name?: string;
  father_name?: string;
  grandfather_name?: string;
  family_name?: string;
  full_name?: string;
  phone_number?: string;
  gender: "male" | "female";
  status: "alive" | "dead";
  verification_status:
    | "pending"
    | "national_id_verified"
    | "questions_verified"
    | "verified";
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  applicationId:string;
  citizenId: number;
  type: "before_war" | "after_war" | "temporary" | "current";
  governorate?: string | null;
  town?: string | null;
  street?: string | null;
  block_number?: string | null;
  house_number?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  citizen?: Citizen;
}

export interface Application {
  id: number;
  citizenId: number;
  status: "pending" | "verified" | "approved" | "rejected" | "closed";
  notes?: string | null;
  application_date: string;
  locationId?: number | null;
  createdById?: number | null;
  createdAt: string;
  updatedAt: string;
  citizen?: Citizen;
  location?: {
    latitude?: number;
    longitude?: number;
    governorate?: string | null;
    town?: string | null;
  } | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserDto = Partial<Omit<CreateUserDto, "password">> & {
  password?: string;
};

export type CreateApplicationDto = {
  citizenId: number;
  locationId?: number;
  status?: Application["status"];
  notes?: string;
};

type UpdateApplicationDto = Partial<CreateApplicationDto> & {
  status?: Application["status"];
};

type CreateCitizenDto = {
  national_id: string;
  first_name?: string;
  gender?: Citizen["gender"];
  status?: Citizen["status"];
  verification_status?: Citizen["verification_status"];
};

type UpdateCitizenDto = Partial<CreateCitizenDto>;

type CreateLocationDto = {
  citizenId: number;
  type: Location["type"];
  governorate?: string | null;
  town?: string | null;
  street?: string | null;
  block_number?: string | null;
  house_number?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
};

type UpdateLocationDto = Partial<CreateLocationDto>;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || PROD_URL,
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

export const adminApi = {
  listUsers: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const res = await api.get("/users", { params });
    return extractData<AdminUser[]>(res);
  },
  createUser: async (payload: CreateUserDto) => {
    const res = await api.post("/users", payload);
    return extractData<AdminUser>(res);
  },
  updateUser: async (id: number, payload: UpdateUserDto) => {
    const res = await api.patch(`/users/${id}`, payload);
    return extractData<AdminUser>(res);
  },
  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
  listApplications: async (params?: {
    page?: number;
    pageSize?: number;
    status?: Application["status"];
  }) => {
    const res = await api.get("/applications", { params });
    return extractData<Application[]>(res);
  },
  listCitizens: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const res = await api.get("/citizens", { params });
    return extractData<Citizen[]>(res);
  },
  createCitizen: async (payload: CreateCitizenDto) => {
    const res = await api.post("/citizens", payload);
    return extractData<Citizen>(res);
  },
  updateCitizen: async (id: number, payload: UpdateCitizenDto) => {
    const res = await api.patch(`/citizens/${id}`, payload);
    return extractData<Citizen>(res);
  },
  deleteCitizen: async (id: number) => {
    await api.delete(`/citizens/${id}`);
  },
  listLocations: async (params?: {
    page?: number;
    pageSize?: number;
    citizenId?: number;
  }) => {
    const res = await api.get("/locations", { params });
    return extractData<Location[]>(res);
  },
  createLocation: async (payload: CreateLocationDto) => {
    const res = await api.post("/locations", payload);
    return extractData<Location>(res);
  },
  updateLocation: async (id: number, payload: UpdateLocationDto) => {
    const res = await api.patch(`/locations/${id}`, payload);
    return extractData<Location>(res);
  },
  deleteLocation: async (id: number) => {
    await api.delete(`/locations/${id}`);
  },
  createApplication: async (payload: CreateApplicationDto) => {
    const res = await api.post("/applications", payload);
    return extractData<Application>(res);
  },
  updateApplication: async (id: number, payload: UpdateApplicationDto) => {
    const res = await api.patch(`/applications/${id}`, payload);
    return extractData<Application>(res);
  },
  deleteApplication: async (id: number) => {
    await api.delete(`/applications/${id}`);
  },
};

export const supervisorApi = {
  listApplications: async (params?: {
    page?: number;
    status?: Application["status"];
  }) => {
    const res = await api.get("/supervisor/applications", { params });
    return extractData<PaginatedResult<Application>>(res);
  },
  updateApplicationStatus: async (
    id: number,
    payload: { status: Application["status"]; notes?: string }
  ) => {
    const res = await api.patch(`/supervisor/applications/${id}`, payload);
    return extractData<Application>(res);
  },
  deleteApplication: async (id: number) => {
    await api.delete(`/supervisor/applications/${id}`);
  },
};

export { api };
