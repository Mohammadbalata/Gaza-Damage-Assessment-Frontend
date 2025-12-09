import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  DialogProps,
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

export function FormDialog({
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
}: FormDialogProps) {
  return (
    <Dialog
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
        }}
      >
        {title}
        <Button
          onClick={onClose}
          disabled={isLoading}
          size="small"
          sx={{ minWidth: "auto", p: 0 }}
        >
          <CloseIcon size={20} />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box
          component="div"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        {onSubmit && (
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? "جاري..." : submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default FormDialog;
