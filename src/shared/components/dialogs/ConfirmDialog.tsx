import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
  alpha,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../../app/providers/LanguageContext";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "error" | "warning" | "info" | "success";
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = "warning",
  loading = false,
}) => {
  const { t } = useLanguage();
  const theme = useTheme();

  const getColor = () => {
    switch (type) {
      case "error":
        return theme.palette.error;
      case "warning":
        return theme.palette.warning;
      case "success":
        return theme.palette.success;
      default:
        return theme.palette.primary;
    }
  };

  const colorConfig = getColor();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          boxShadow: `0 24px 48px -12px ${alpha(theme.palette.common.black, 0.2)}`,
        },
      }}
    >
      <DialogTitle sx={{ p: 2, pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(colorConfig.main, 0.1),
                color: colorConfig.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {type === "warning" ? <WarningIcon /> : <HelpIcon />}
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="text"
          sx={{
            borderRadius: 2,
            border: "1px solid transparent",
            px: 3,
            fontWeight: "bold",
            color: "text.secondary",
            "&:hover": {
              border: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {cancelText || t("common.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={type === "warning" ? "error" : (type as any)}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: "bold",
            boxShadow: `0 8px 16px -4px ${alpha(colorConfig.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 12px 20px -4px ${alpha(colorConfig.main, 0.4)}`,
            },
          }}
        >
          {confirmText || t("common.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
