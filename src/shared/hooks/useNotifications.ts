import { useCallback } from "react";
import { useSnackbar } from "notistack";

export interface UseNotificationReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export function useNotification(): UseNotificationReturn {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const showError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "error" });
    },
    [enqueueSnackbar]
  );

  const showInfo = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "info" });
    },
    [enqueueSnackbar]
  );

  const showWarning = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: "warning" });
    },
    [enqueueSnackbar]
  );

  return { showSuccess, showError, showInfo, showWarning };
}

export default useNotification;
