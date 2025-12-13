import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  DialogProps,
  CircularProgress,
} from "@mui/material";
import { X as CloseIcon } from "lucide-react";

interface FormDialogProps extends Omit<DialogProps, "children"> {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg";
}

/**
 * Form dialog with loading state and submission support
 */
export const FormDialog = React.forwardRef<HTMLDivElement, FormDialogProps>(
  (
    {
      open,
      title,
      onClose,
      onSubmit,
      submitLabel = "حفظ",
      cancelLabel = "إلغاء",
      isLoading = false,
      children,
      maxWidth = "sm",
      ...rest
    },
    ref
  ) => {
    return (
      <Dialog
        ref={ref}
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth
        {...rest}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          {title}
          <Button
            onClick={onClose}
            disabled={isLoading}
            size="small"
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <CloseIcon size={20} />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {children}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <Button
                onClick={onSubmit}
                variant="contained"
                disabled={isLoading}
                color="primary"
              >
                {isLoading ? "جاري..." : submitLabel}
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
          )}
        </DialogActions>
      </Dialog>
    );
  }
);

FormDialog.displayName = "FormDialog";

export default FormDialog;
