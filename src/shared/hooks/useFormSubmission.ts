import { useCallback } from "react";
import { usePost } from "./api/useApi";
import { useNotification } from "./useNotifications";

export interface UseFormSubmissionOptions<TResponse> {
  /** Toast shown on 2xx. If omitted, no success toast is fired. */
  successMessage?: string;
  /**
   * Toast shown on error. If omitted, the error returned by
   * `ApiErrorHandler` (surfaced via `useApi.error`) is shown instead.
   */
  errorMessage?: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: string) => void;
}

export interface UseFormSubmissionReturn<TPayload, TResponse> {
  submit: (payload: TPayload) => Promise<TResponse | undefined>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Wraps `usePost` with `useNotification` so form screens don't repeat the
 * `try/catch → setLoading → enqueueSnackbar` choreography on every submit.
 *
 * Returns a stable `submit(payload)` function plus the underlying
 * loading/error state.
 *
 * @example
 *   const { submit, loading } = useFormSubmission<LoginPayload, LoginResp>(
 *     "/auth/login",
 *     { successMessage: t("auth.loginSuccess") },
 *   );
 *   const onSubmit = async (values) => {
 *     const res = await submit(values);
 *     if (res) navigate(ROUTES.HOME);
 *   };
 */
export function useFormSubmission<TPayload = unknown, TResponse = unknown>(
  url: string,
  options: UseFormSubmissionOptions<TResponse> = {},
): UseFormSubmissionReturn<TPayload, TResponse> {
  const { successMessage, errorMessage, onSuccess, onError } = options;
  const { showSuccess, showError } = useNotification();

  const post = usePost<TResponse>(url, {
    onSuccess: (data: TResponse) => {
      if (successMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(data);
    },
    onError: (err: string) => {
      showError(errorMessage ?? err);
      if (onError) onError(err);
    },
  });

  const submit = useCallback(
    (payload: TPayload) => post.execute(payload) as Promise<TResponse | undefined>,
    [post],
  );

  return {
    submit,
    loading: post.loading,
    error: post.error,
    reset: post.reset,
  };
}

export default useFormSubmission;
