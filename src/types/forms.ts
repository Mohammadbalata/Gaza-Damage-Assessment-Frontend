export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export interface SubmitFormState {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  success: boolean;
}
