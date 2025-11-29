export interface IAuthState {
  nationalId: number | null | any;
  password: string | null | any
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setPersonalInfo?: any;
}
