import React from "react";
import { Alert, AlertProps } from "@mui/material";

interface ErrorAlertProps extends Omit<AlertProps, "children"> {
  message?: string | null;
  error?: string | null;
  visible?: boolean;
}

export function ErrorAlert({
  message,
  error,
  visible = true,
  severity = "error",
  ...rest
}: ErrorAlertProps) {
  const displayMessage = error || message;

  if (!visible || !displayMessage) {
    return null;
  }

  return (
    <Alert severity={severity} {...rest}>
      {displayMessage}
    </Alert>
  );
}

export default ErrorAlert;
