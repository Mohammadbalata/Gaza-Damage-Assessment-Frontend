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
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Feedback as ComplaintIcon,
  Event as EventIcon,
  Visibility as ViewIcon,
  Assignment as AppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { axiosClient } from "../../../shared/api/baseUrl";
import { API } from "../../../shared/constants/ApiRoutes";
import BackButton from "../../../shared/components/BackButton";
import { ROUTES } from "../../../app/router/Routes";

const MyComplaintsPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const theme = useTheme();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    axiosClient
      .get(API.citizen.complaints.list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res: any) => {
        const complaintsData =
          res.data?.complaints || res.data?.data?.complaints || [];
        setComplaints(complaintsData.data);
        setLoading(false);
        console.log(complaintsData.data);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase().replace("-", "_")) {
      case "PENDING":
        return "warning";
      case "UNDER_REVIEW":
        return "info";
      case "RESOLVED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "primary";
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "ALL") return true;
    return c.status?.toUpperCase().replace("-", "_") === filter;
  });

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

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t("complaint.myComplaintsAndObjections")}
            </Typography>
          </Box>
          <BackButton language={language} to={ROUTES.MY_APPLICATIONS} />
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={filter}
            onChange={(_, newValue) => setFilter(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              "& .MuiTab-root": {
                py: 2,
                fontWeight: "bold",
                fontSize: "0.9rem",
                minWidth: 100,
              },
            }}
          >
            <Tab label={t("common.all")} value="ALL" />
            <Tab label={t("complaint.status.pending")} value="PENDING" />
            <Tab
              label={t("complaint.status.under_review")}
              value="UNDER_REVIEW"
            />
            <Tab label={t("complaint.status.resolved")} value="RESOLVED" />
            <Tab label={t("complaint.status.closed")} value="CLOSED" />
          </Tabs>
        </Paper>

        {filteredComplaints.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                mb: 3,
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "action.hover",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                mx: "auto",
              }}
            >
              <ComplaintIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {filter === "ALL"
                ? t("complaint.noComplaintsOrObjections")
                : t("common.noResults")}
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {filteredComplaints?.map((complaint) => (
              <Card
                key={complaint.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: (theme) =>
                      `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          color: "error.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ComplaintIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          {complaint.type === "COMPLAINT"
                            ? t("complaint.code")
                            : t("complaint.objectionCode")}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {complaint.code}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip
                      label={t(
                        `complaint.status.${complaint.status.toLowerCase().replace("-", "_")}`,
                      )}
                      color={getStatusColor(complaint.status) as any}
                      size="small"
                      sx={{ fontWeight: "bold", borderRadius: 2 }}
                    />
                  </Stack>

                  <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AppIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {t("complaint.application")}:{" "}
                        <strong>#{complaint.damage_report?.report_code}</strong>
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(complaint.created_at).toLocaleDateString(
                          language === "ar" ? "ar-EG" : "en-US",
                        )}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {complaint.description}
                    </Typography>
                  </Stack>

                  <Box sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() =>
                        navigate(`/citizen/complaints/${complaint.id}`)
                      }
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      {complaint.type === "COMPLAINT"
                        ? t("citizen.viewDetailsComplaint")
                        : t("citizen.viewDetailsObjection")}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Fade>
  );
};

export default MyComplaintsPage;
