import axios, { AxiosInstance, AxiosError } from 'axios';

// const LOCAL_URL = 'http://localhost:3000/api'
const PROD_URL = 'https://backend-5549.onrender.com';

export type UserRole = 'admin' | 'supervisor';

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
  full_name?: string;
  gender?: 'male' | 'female';
  status: 'alive' | 'dead';
  verification_status:
    | 'pending'
    | 'national_id_verified'
    | 'questions_verified'
    | 'verified';
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  citizenId: number;
  type: 'before_war' | 'after_war' | 'temporary' | 'current';
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
  status: 'pending' | 'verified' | 'approved' | 'rejected' | 'closed';
  notes?: string | null;
  application_date: string;
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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>> & { password?: string };

type CreateApplicationDto = {
  citizenId: number;
  notes?: string;
  status?: Application['status'];
  createdById?: number;
};

type UpdateApplicationDto = Partial<CreateApplicationDto>;

type CreateCitizenDto = {
  national_id: string;
  full_name?: string;
  gender?: Citizen['gender'];
  status?: Citizen['status'];
  verification_status?: Citizen['verification_status'];
};

type UpdateCitizenDto = Partial<CreateCitizenDto>;

type CreateLocationDto = {
  citizenId: number;
  type: Location['type'];
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
    'Content-Type': 'application/json',
  },
});

const extractData = <T>(response: any): T => {
  if (response?.data?.data) return response.data.data as T;
  return response?.data ?? response;
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      console.warn('Unauthorized response detected', error.response);
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  listUsers: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const res = await api.get('/admin/users', { params });
    return extractData<PaginatedResult<AdminUser>>(res);
  },
  createUser: async (payload: CreateUserDto) => {
    const res = await api.post('/admin/users', payload);
    return extractData<AdminUser>(res);
  },
  updateUser: async (id: number, payload: UpdateUserDto) => {
    const res = await api.put(`/admin/users/${id}`, payload);
    return extractData<AdminUser>(res);
  },
  deleteUser: async (id: number) => {
    await api.delete(`/admin/users/${id}`);
  },
  listApplications: async (params?: {
    page?: number;
    pageSize?: number;
    status?: Application['status'];
  }) => {
    const res = await api.get('/admin/applications', { params });
    return extractData<PaginatedResult<Application>>(res);
  },
  listCitizens: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const res = await api.get('/admin/citizens', { params });
    return extractData<PaginatedResult<Citizen>>(res);
  },
  createCitizen: async (payload: CreateCitizenDto) => {
    const res = await api.post('/admin/citizens', payload);
    return extractData<Citizen>(res);
  },
  updateCitizen: async (id: number, payload: UpdateCitizenDto) => {
    const res = await api.put(`/admin/citizens/${id}`, payload);
    return extractData<Citizen>(res);
  },
  deleteCitizen: async (id: number) => {
    await api.delete(`/admin/citizens/${id}`);
  },
  listLocations: async (params?: {
    page?: number;
    pageSize?: number;
    citizenId?: number;
  }) => {
    const res = await api.get('/admin/locations', { params });
    return extractData<PaginatedResult<Location>>(res);
  },
  createLocation: async (payload: CreateLocationDto) => {
    const res = await api.post('/admin/locations', payload);
    return extractData<Location>(res);
  },
  updateLocation: async (id: number, payload: UpdateLocationDto) => {
    const res = await api.put(`/admin/locations/${id}`, payload);
    return extractData<Location>(res);
  },
  deleteLocation: async (id: number) => {
    await api.delete(`/admin/locations/${id}`);
  },
  createApplication: async (payload: CreateApplicationDto) => {
    const res = await api.post('/admin/applications', payload);
    return extractData<Application>(res);
  },
  updateApplication: async (id: number, payload: UpdateApplicationDto) => {
    const res = await api.put(`/admin/applications/${id}`, payload);
    return extractData<Application>(res);
  },
  deleteApplication: async (id: number) => {
    await api.delete(`/admin/applications/${id}`);
  },
};

export const supervisorApi = {
  listApplications: async (params?: {
    page?: number;
    status?: Application['status'];
  }) => {
    const res = await api.get('/supervisor/applications', { params });
    return extractData<PaginatedResult<Application>>(res);
  },
  updateApplicationStatus: async (
    id: number,
    payload: { status: Application['status']; notes?: string }
  ) => {
    const res = await api.patch(`/supervisor/applications/${id}`, payload);
    return extractData<Application>(res);
  },
  deleteApplication: async (id: number) => {
    await api.delete(`/supervisor/applications/${id}`);
  },
};

export { api };