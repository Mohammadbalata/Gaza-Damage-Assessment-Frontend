export interface IAuthState {
  nationalId: string | null | any;
  password: string | null | any
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setPersonalInfo?: any;
  messageSuccess ?: string
verificationQuestion : any[]
}
