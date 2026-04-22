// Redux-backed auth state. Intentionally narrow:
// - sensitive credentials (password, national_id) live in local form state only
// - ephemeral sign-up fields (email, phoneNumber, whatsappNumber, name parts)
//   live in react-hook-form state on the auth pages
// - citizen profile (citizenInfo) lives in localStorage, accessed via
//   `shared/utils/storage` helpers
// Optional fields here exist solely to accommodate the signUp thunk payload,
// which still accepts them as input arguments.
export interface IAuthState {
  user?: any | null;
  isAuthenticated?: boolean;
  loading?: boolean;
  error?: string | null;
  messageSuccess?: string;
  verificationQuestion?: any;
  trackingNumber?: string;

  // --- signUp thunk input payload only (not stored in Redux) ---
  national_id?: string | null | any;
  password?: string | null | any;
  firstName?: string;
  fatherName?: string;
  grandfatherName?: string;
  familyName?: string;
  familyMembersNumber?: number;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  email?: string;
  whatsappNumber?: string;
  pathSignUp?: string;
  formData?: any;
  avatar?: File | null;
  agreeToTerms?: boolean;
  setPersonalInfo?: any;
  setError?: any;
}
