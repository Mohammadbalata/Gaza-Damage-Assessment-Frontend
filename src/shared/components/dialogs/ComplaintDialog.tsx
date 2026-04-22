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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Close as CloseIcon,
  Feedback as ComplaintIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { useForm } from "react-hook-form";
import { axiosClient } from "../../api/api";
import { getToken } from "../../utils/storage";
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
  const { t, language } = useLanguage();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [complaintType, setComplaintType] = React.useState("COMPLAINT");

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
      await axiosClient.post(
        API.citizen.complaints.create,
        {
          damage_report_id: application.id,
          description: data.description,
          type: complaintType,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      if (complaintType === "COMPLAINT") {
        enqueueSnackbar(t("complaint.success"), { variant: "success" });
      } else {
        enqueueSnackbar(t("complaint.objectionSuccess"), {
          variant: "success",
        });
      }
      reset();
      onClose();
    } catch (error: any) {
      console.error(error);
      const backendMessage =
        language === "ar"
          ? error.response?.data?.message_ar
          : error.response?.data?.message_en;

      const message =
        backendMessage || error.response?.data?.message || t("complaint.error");
      enqueueSnackbar(message, { variant: "error" });
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
            {complaintType === "COMPLAINT"
              ? t("complaintType.COMPLAINT")
              : t("complaintType.OBJECTION")}{" "}
            - #{application?.report_code}
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
          <Box sx={{ mb: 4 }}>
            <RadioGroup
              row
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              sx={{ justifyContent: "center", mb: 2 }}
            >
              <FormControlLabel
                value="COMPLAINT"
                control={<Radio />}
                label={t("complaintType.COMPLAINT")}
              />
              <FormControlLabel
                value="OBJECTION"
                control={<Radio />}
                label={t("complaintType.OBJECTION")}
              />
            </RadioGroup>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={
              complaintType === "COMPLAINT"
                ? t("complaint.description")
                : t("complaintType.OBJECTION")
            }
            placeholder={
              complaintType === "COMPLAINT"
                ? t("complaint.descriptionPlaceholder")
                : t("complaint.descriptionPlaceholder")
            }
            {...register("description", { required: true, minLength: 10 })}
            error={!!errors.description}
            helperText={
              errors.description
                ? errors.description.type === "required"
                  ? t("common.required")
                  : t("complaint.validation.descriptionMinLength")
                : ""
            }
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
            {complaintType === "COMPLAINT"
              ? t("complaint.submit")
              : t("complaintType.OBJECTION")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ComplaintDialog;
