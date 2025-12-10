import React from "react";
import { Alert, AlertProps, Box } from "@mui/material";

interface ErrorAlertProps extends Omit<AlertProps, "children"> {
  message?: string | null;
  error?: string | null;
  visible?: boolean;
  onClose?: () => void;
}

/**
 * Error alert component with auto-closing support
 */
export const ErrorAlert = React.forwardRef<HTMLDivElement, ErrorAlertProps>(
  (
    { message, error, visible = true, severity = "error", onClose, ...rest },
    ref
  ) => {
    const displayMessage = error || message;

    if (!visible || !displayMessage) {
      return null;
    }

    return (
      <Box ref={ref}>
        <Alert severity={severity} onClose={onClose} {...rest}>
          {displayMessage}
        </Alert>
      </Box>
    );
  }
);

ErrorAlert.displayName = "ErrorAlert";

export default ErrorAlert;
