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
  Dialog,
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
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {  useState } from "react";
import { useSnackbar } from "notistack";
import { useLanguage } from "../contexts/LanguageContext";
import { useGet } from "../hooks/api/useApi";
import { ROUTES } from "../routes/Routes";
import ErrorAlert from "../components/Shared/ErrorAlert";
import BackButton from "../components/Shared/BackButton";
import DamageAssessmentDialog from "./DamageAssessmentDialog";
import { generatePDFReceipt } from "../utils/pdfGenerator";
import { API } from "../constants/ApiRoutes";
import { formatDate } from "../utils/helpers";

const MyApplications = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const {
    data: rawData,
    loading,
    error,
  } = useGet<any>(`${API.citizen.applications.list}`, {
    immediate: true,
  });

  // Robust data handling
  const applications: any = Array.isArray(rawData)
    ? rawData
    : rawData
    ? rawData.applications
    : [];
  const citizen: any = rawData?.citizen;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGeneratePdf = () => {
    generatePDFReceipt(rawData, t, language);
    console.log(applications);
    console.log(rawData);
    console.log(language);
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

  const handleAction = (app: any) => {
    // const isPending = app.status?.toLowerCase() === "pending" || !app.status; // Treat undefined/null as pending if unsure, or strictly existing status. API response usually has status.
    // Assuming status is returned from API.
    // If status is "pending", allow edit. Else, read-only.
    // NOTE: Check exact enum/string value for "pending" from backend. Usually "PENDING".

    // For safety, checking case-insensitive
    // console.log(app)
    const status = app.status?.toUpperCase() || "PENDING";
    const canEdit = status === "PENDING";

    setSelectedApplication(app);
    setIsReadOnly(!canEdit);
    setDialogOpen(true);
  };

  // useEffect(()=> {
  //   console.log(selectedApplication)
  // },[dialogOpen])
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
    // Optional: Refresh list if edited?
    // if (!isReadOnly) refresh(); // If we have refresh exposed
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "VERIFIED":
        return "info";
      case "CLOSED":
        return "default";
      case "PENDING":
        return "warning";
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

          <Box
            sx={{
              display: "flex",
              ml: "0 !important",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
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
            <Button
              variant="contained"
              size="medium"
              startIcon={
                <DescriptionIcon
                  sx={{ fontSize: 40, marginLeft: 1, flexBasis: "1" }}
                />
              }
              onClick={handleGeneratePdf}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
              }}
            >
              {t("success.downloadReceipt")}
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            {applications.map((app: any) => {
              const status = app.status?.toUpperCase() || "PENDING";
              const isPending = status === "PENDING";

              return (
                <Fade in={true} style={{ transformOrigin: "0 0 0" }} key={app.key}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
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
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 2,
                        height: "100%",
                      }}
                    >
                      {/* 🔴 نفس محتوى الكرت اللي عندك بالزبط */}
                      {/* Icon */}
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
                      <Box sx={{ flex: 1, width: "100%" }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          alignItems="center"
                          spacing={1}
                          sx={{
                            mb: 0.5,
                            justifyContent: "center",
                            gap: {
                              xs: 0, // موبايل
                              sm: "10px", // ❌ ملغي على sm
                              md: "10px", // ديسكتوب
                              lg: "10px",
                              xl: "10px",
                            },
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                              minWidth: {
                                xs: "100%",
                                sm: "100%",
                                md: "auto",
                                lg: "auto",
                                xl: "auto",
                              },
                            }}
                          >
                            {t("citizen.applicationId")} #{app.id}
                          </Typography>
                          <Chip
                            label={
                              t(`status.${app.status?.toLowerCase()}`) ||
                              app.status
                            }
                            color={getStatusColor(app.status)}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              height: 24,
                              textAlign: "right",
                            }}
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          <EventIcon sx={{ fontSize: 16 }} />
                          {t("citizen.submittedOn")}:{" "}
                          {new Date(app.createdAt).toLocaleDateString(
                            language === "ar" ? "ar-EG" : "en-US"
                          )}
                        </Typography>

                        <Typography variant="h6" mt={1}>
                          العنوان : {app.location.address}
                        </Typography>
                      </Box>

                      {/* Action */}
                      <Button
                        variant={isPending ? "outlined" : "text"}
                        startIcon={
                          isPending ? <EditIcon /> : <VisibilityIcon />
                        }
                        sx={{display:'flex', gap:1}}
                        onClick={() => handleAction(app)}
                      >
                        {isPending
                          ? t("common.editRequest")
                          : t("common.reviewRequest")}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              );
            })}
          </Box>
        )}

        {/* Damage Assessment Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
          disableScrollLock
        >
          {selectedApplication && (
            <DamageAssessmentDialog
              onClose={handleDialogClose}
              readOnly={isReadOnly}
              initialData={selectedApplication}
              location={null}
            />
          )}
        </Dialog>
        <CardContent
          sx={{
            p: 2,
            "&:last-child": { pb: 2 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            marginTop: "50px",
          }}
        >
          {/* Content */}
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#ECFDF5",
                boxShadow: "0 4px 8px rgba(0,0,0,0.04)",
                borderRight: "6px solid #10B981",
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  color: "#047857",
                  mb: 2,
                }}
              >
                العنوان الحالي:
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>العنوان:</strong>{" "}
                {citizen.current_location?.address || "-"}
              </Typography>

              <Typography>
                <strong>تاريخ الإضافة:</strong>{" "}
                {citizen.current_location
                  ? formatDate(new Date(citizen.current_location.createdAt))
                  : "-"}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Container>
    </Fade>
  );
};

export default MyApplications;
