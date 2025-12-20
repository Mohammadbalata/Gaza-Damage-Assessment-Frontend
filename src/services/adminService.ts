import { api, extractData } from "../api/client";
import {
  AdminUser,
  CreateUserDto,
  UpdateUserDto,
  Application,
  Citizen,
  Location,
} from "../types/entities";

/**
 * Admin API Services
 */
export const adminService = {
  // Users
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

  // Applications
  listApplications: async (params?: {
    page?: number;
    pageSize?: number;
    status?: Application["status"];
  }) => {
    const res = await api.get("/applications", { params });
    return extractData<Application[]>(res);
  },

  // Citizens
  listCitizens: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const res = await api.get("/citizens", { params });
    return extractData<Citizen[]>(res);
  },

  createCitizen: async (payload: any) => {
    const res = await api.post("/citizens", payload);
    return extractData<Citizen>(res);
  },

  updateCitizen: async (id: number, payload: any) => {
    const res = await api.patch(`/citizens/${id}`, payload);
    return extractData<Citizen>(res);
  },

  deleteCitizen: async (id: number) => {
    await api.delete(`/citizens/${id}`);
  },

  // Locations
  listLocations: async (params?: {
    page?: number;
    pageSize?: number;
    citizenId?: number;
  }) => {
    const res = await api.get("/locations", { params });
    return extractData<Location[]>(res);
  },

  createLocation: async (payload: any) => {
    const res = await api.post("/locations", payload);
    return extractData<Location>(res);
  },

  updateLocation: async (id: number, payload: any) => {
    const res = await api.patch(`/locations/${id}`, payload);
    return extractData<Location>(res);
  },

  deleteLocation: async (id: number) => {
    await api.delete(`/locations/${id}`);
  },

  // Applications (CRUD)
  createApplication: async (payload: any) => {
    const res = await api.post("/applications", payload);
    return extractData<Application>(res);
  },

  updateApplication: async (id: number, payload: any) => {
    const res = await api.patch(`/applications/${id}`, payload);
    return extractData<Application>(res);
  },

  deleteApplication: async (id: number) => {
    await api.delete(`/applications/${id}`);
  },
};

export default adminService;
