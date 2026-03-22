import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Stack,
  Paper,
  Chip,
  Fade,
  CircularProgress,
  Divider,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import {
  Feedback as ComplaintIcon,
  Event as EventIcon,
  Assignment as AppIcon,
  Schedule as TimeIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { axiosClient } from "../../api/baseUrl";
import { API } from "../../constants/ApiRoutes";
import BackButton from "../../components/Shared/BackButton";
import { useSnackbar } from "notistack";

const ComplaintDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    axiosClient
      .get(API.citizen.complaints.details(id!), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res: any) => {
        const complaintData = res.data?.complaint || res.data?.data?.complaint || res.data;
        setComplaint(complaintData);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleCloseComplaint = async () => {
    if (!window.confirm(t("complaint.closeConfirm"))) return;
    
    setClosing(true);
    try {
      await axiosClient.put(API.citizen.complaints.close(id!), {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      enqueueSnackbar(t("complaint.closeSuccess"), { variant: "success" });
      // Refresh details
      const res = await axiosClient.get(API.citizen.complaints.details(id!), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setComplaint(res.data?.complaint || res.data?.data?.complaint || res.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("complaint.closeError"), { variant: "error" });
    } finally {
      setClosing(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return "primary";
    switch (status.toUpperCase()) {
      case "PENDING":
        return "warning";
      case "RECEIVED":
        return "info";
      case "CLOSED":
        return "default";
      default:
        return "primary";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!complaint) return null;

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t("complaint.details")}
            </Typography>
          </Box>
          <BackButton language={language} to={"/citizen/my-complaints"} />
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={4}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ComplaintIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {t("complaint.code")}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {complaint.code}
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={t(`complaint.status.${complaint.status.toLowerCase()}`)}
              color={getStatusColor(complaint.status) as any}
              sx={{ fontWeight: "bold", borderRadius: 2, px: 2, py: 2 }}
            />
          </Stack>

          {complaint.status.toUpperCase() !== "CLOSED" && (
            <Box mb={4}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                disabled={closing}
                onClick={handleCloseComplaint}
                startIcon={closing ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: "bold", borderStyle: "dashed", borderWidth: 2, "&:hover": { borderWidth: 2 } }}
              >
                {t("complaint.close")}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t("complaint.description")}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography variant="body1">{complaint.description}</Typography>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t("review.identityInfo")}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ mt: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AppIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("complaint.application")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      #{complaint.damage_report?.report_code}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("citizen.submittedOn")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {new Date(complaint.created_at).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US"
                      )}
                    </Typography>
                  </Box>
                </Stack>
                {complaint.sla_deadline && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimeIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Deadline
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(complaint.sla_deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Box>

            {/* Response Section */}
            {(complaint.resolution_type || complaint.response) && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                  Official Response
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: "1px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">
                    {complaint.response || "No detailed response provided."}
                  </Typography>
                  {complaint.resolved_at && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                      Resolved at: {new Date(complaint.resolved_at).toLocaleString()}
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </Fade>
  );
};

export default ComplaintDetailsPage;
