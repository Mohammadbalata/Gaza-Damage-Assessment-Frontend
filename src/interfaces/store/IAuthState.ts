export interface IAuthState {
  nationalId?: string | null | any;
  password?: string | null | any;
  user?: any | null;
  isAuthenticated?: boolean;
  loading?: boolean;
  error?: string | null;
  setPersonalInfo?: any;
  messageSuccess?: string;
  verificationQuestion?: any;
  setError?: any;
  firstName?: string;
  fatherName?: string;
  grandfatherName?: string;
  familyName?: string;
  familyMembersNumber?: number;
  phoneNumber?: string;
  email?: string;
  whatsappNumber?: string;
  pathSignUp?: string;
}
