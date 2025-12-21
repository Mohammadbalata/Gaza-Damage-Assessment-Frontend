import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Fade,
  Card,
  CardContent,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Home as HomeIcon,
  Foundation as FoundationIcon,
  MonetizationOn as MonetizationOnIcon,
  MedicalServices as MedicalServicesIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useLanguage } from "../contexts/LanguageContext";
import { useGet } from "../hooks/api/useApi";
import { ROUTES } from "../routes/Routes";
import { Application } from "../types/entities";
import ErrorAlert from "../components/Shared/ErrorAlert";
import BackButton from "../components/Shared/BackButton";

const MyApplications = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    data: rawData,
    loading,
    error,
  } = useGet<any>("applications/my-application", {
    immediate: true,
  });

  // Robust data handling
  const applications: Application[] = Array.isArray(rawData)
    ? rawData
    : rawData
    ? [rawData]
    : [];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRequestTypeSelect = (type: string) => {
    handleMenuClose();
    if (type === "damage") {
      navigate(ROUTES.PREVIOUS_LOCATION);
    } else {
      enqueueSnackbar(t("common.comingSoonMessage"), {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: language === "ar" ? "left" : "right",
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "VERIFIED":
        return "info";
      case "CLOSED":
        return "default";
      default:
        return "warning";
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

  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        <ErrorAlert
          sx={{ width: "100%", maxWidth: 500, display: "flex", gap: 1 }}
          message={language === "ar" ? "لا يوجد طلبات" : error}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </Button>
          <BackButton language={language} to={ROUTES.CITIZEN_DASHBOARD} />
        </Stack>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t("citizen.myRequests")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("citizen.myRequestsDesc")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <BackButton
              sx={{ marginBottom: 3.5 }}
              language={language}
              to={ROUTES.CITIZEN_DASHBOARD}
            />
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon sx={{ ml: 1 }} />}
              endIcon={<KeyboardArrowDownIcon sx={{ mr: 1 }} />}
              onClick={handleMenuClick}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
              }}
            >
              {t("citizen.addDamageRequest")}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { width: 320, mt: 1, borderRadius: 2 },
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: language === "ar" ? "left" : "right",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: language === "ar" ? "left" : "right",
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("citizen.addDamageRequest")}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => handleRequestTypeSelect("damage")}>
                <ListItemIcon>
                  <HomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.damageRequest")}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
              </MenuItem>
              <MenuItem onClick={() => handleRequestTypeSelect("relief")}>
                <ListItemIcon>
                  <MedicalServicesIcon color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.reliefRequest")}
                  secondary={t("citizen.comingSoon")}
                />
              </MenuItem>
              <MenuItem onClick={() => handleRequestTypeSelect("compensation")}>
                <ListItemIcon>
                  <MonetizationOnIcon color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.compensationRequest")}
                  secondary={t("citizen.comingSoon")}
                />
              </MenuItem>
              <MenuItem onClick={() => handleRequestTypeSelect("housing")}>
                <ListItemIcon>
                  <FoundationIcon color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.housingRequest")}
                  secondary={t("citizen.comingSoon")}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Stack>

        {/* Applications List */}
        {!applications || applications.length === 0 ? (
          /* Empty State */
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
              <DescriptionIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("citizen.noApplications")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              {t("citizen.createFirstApplication")}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleRequestTypeSelect("damage")}
            >
              {t("citizen.addDamageRequest")}
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {applications.map((app) => (
              <Fade in={true} key={app.id} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      "&:last-child": { pb: 2 },
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/* Icon Box */}
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: "primary.50",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <DescriptionIcon />
                    </Box>

                    {/* Content */}
                    <Box
                      sx={{
                        flex: 1,
                        width: "100%",
                        textAlign: { xs: "center", sm: "start" },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                        useFlexGap={true}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {t("citizen.applicationId")} #{app.id}
                        </Typography>
                        <Chip
                          label={t(`status.${app.status.toLowerCase()}`)}
                          color={getStatusColor(app.status)}
                          size="small"
                          sx={{ fontWeight: "bold", height: 24 }}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          justifyContent: { xs: "center", sm: "flex-start" },
                        }}
                      >
                        <EventIcon sx={{ fontSize: 16 }} />
                        {t("citizen.submittedOn")}:{" "}
                        {new Date(app.createdAt).toLocaleDateString(
                          language === "ar" ? "ar-EG" : "en-US"
                        )}
                      </Typography>
                    </Box>

                    {/* Action */}
                    {/* <Button
                      variant="text"
                      color="primary"
                      endIcon={
                        language === "ar" ? (
                          <KeyboardArrowLeft />
                        ) : (
                          <ArrowForward />
                        )
                      }
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {t("citizen.viewDetails")}
                    </Button> */}
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        )}
      </Container>
    </Fade>
  );
};

export default MyApplications;
