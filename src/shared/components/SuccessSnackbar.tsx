import { Snackbar, Alert, SnackbarProps } from "@mui/material";

interface SuccessSnackbarProps extends Omit<SnackbarProps, "children"> {
  open: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export function SuccessSnackbar({
  open,
  message,
  onClose,
  autoHideDuration = 5000,
  ...rest
}: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      {...rest}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;
