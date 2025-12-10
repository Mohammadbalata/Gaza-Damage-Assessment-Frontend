import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  DialogProps,
  CircularProgress,
  Box,
} from "@mui/material";

interface ConfirmDialogProps extends Omit<DialogProps, "children"> {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

/**
 * Confirmation dialog with loading state support
 */
export const ConfirmDialog = React.forwardRef<
  HTMLDivElement,
  ConfirmDialogProps
>(
  (
    {
      open,
      title,
      message,
      confirmText = "تأكيد",
      cancelText = "إلغاء",
      onConfirm,
      onCancel,
      isLoading = false,
      isDangerous = false,
      ...rest
    },
    ref
  ) => {
    return (
      <Dialog ref={ref} open={open} onClose={onCancel} {...rest}>
        <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", mt: 1 }}>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant="contained"
              color={isDangerous ? "error" : "primary"}
            >
              {confirmText}
            </Button>
            {isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    );
  }
);

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
