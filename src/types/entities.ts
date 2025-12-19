
export enum UserRole {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
}

export enum Gender {
  MALE = "MALE",
FEMALE = "FEMALE"
  
}

export enum CitizenStatus {
  ALIVE = "ALIVE",
DEAD = "DEAD"
  
}

export enum VerificationStatus {
  PENDING = "PENDING",
NATIONAL_ID_VERIFIED = "NATIONAL_ID_VERIFIED",
QUESTIONS_VERIFIED = "QUESTIONS_VERIFIED",
VERIFIED = "VERIFIED",
  
}

export enum ApplicationStatus {
  PENDING = "PENDING",
VERIFIED = "VERIFIED",
APPROVED = "APPROVED",
REJECTED = "REJECTED",
CLOSED = "CLOSED"
  
}

export enum LocationType {
  BEFORE_WAR = "BEFORE_WAR",
AFTER_WAR = "AFTER_WAR",
TEMPORARY = "TEMPORARY",
CURRENT = "CURRENT"
}

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
  gender: Gender;
  status: CitizenStatus;
  verification_status:VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  applicationId: string;
  citizenId: number;
  type: LocationType;
  address: string;
  neighborhood: string;
  governorate?: string | null;
  town?: string | null;
  street?: string | null;
  block_number?: string | null;
  house_number?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  extraData: string;
  createdAt: string;
  updatedAt: string;
  citizen?: Citizen;
}

export interface Application {
  id: number;
  citizenId: number;
  status: ApplicationStatus;
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
  status?: ApplicationStatus;
  notes?: string;
};


