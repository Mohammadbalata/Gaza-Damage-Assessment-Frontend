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
setError?: any
}

export interface SignUpPayload {
  nationalId?: string | null;
  password?: string;
  pathSignUp: string; // e.g., "verify-id" or "register"
}
