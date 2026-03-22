import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, Feedback as ComplaintIcon } from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { axiosClient } from "../../api/baseUrl";
import { API } from "../../constants/ApiRoutes";
import { useSnackbar } from "notistack";

interface ComplaintDialogProps {
  open: boolean;
  onClose: () => void;
  application: any;
}

const ComplaintDialog: React.FC<ComplaintDialogProps> = ({
  open,
  onClose,
  application,
}) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axiosClient.post(API.citizen.complaints.create, {
        damage_report_id: application.id,
        description: data.description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      enqueueSnackbar(t("complaint.success"), { variant: "success" });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("complaint.error"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: alpha(theme.palette.error.main, 0.05),
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ComplaintIcon color="error" />
          <Typography variant="h6" fontWeight="bold">
            {t("complaint.add")} - #{application?.report_code}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3 }}>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("complaint.application")}: #{application?.report_code}
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t("complaint.description")}
            placeholder={t("complaint.descriptionPlaceholder")}
            {...register("description", { required: true })}
            error={!!errors.description}
            helperText={errors.description ? t("common.required") : ""}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ px: 4, borderRadius: 2 }}
          >
            {t("complaint.submit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ComplaintDialog;
