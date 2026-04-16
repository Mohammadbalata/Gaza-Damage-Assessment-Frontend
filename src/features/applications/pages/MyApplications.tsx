import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Fade,
  CardContent,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  TextField,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import ApplicationCard from "../components/ApplicationCard";

import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Home as HomeIcon,
  Foundation as FoundationIcon,
  MonetizationOn as MonetizationOnIcon,
  MedicalServices as MedicalServicesIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  Feedback as ComplaintIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { ROUTES } from "../../../app/router/Routes";
import ErrorAlert from "../../../shared/components/dialogs/ErrorAlert";
import BackButton from "../../../shared/components/BackButton";
import ConfirmDialog from "../../../shared/components/dialogs/ConfirmDialog";
import DamageAssessmentDialog from "../../../features/damage-assessment/pages/DamageAssessmentDialog";
import ComplaintDialog from "../../../shared/components/dialogs/ComplaintDialog";
import {
  generatePDFReceipt,
  generateApplicationPDF,
} from "../../damage-assessment/utils/pdfGenerator";
import { API } from "../../../shared/constants/ApiRoutes";
import { formatDate } from "../../../shared/utils/helpers";
import { useForm } from "react-hook-form";
// import SelectLocations from "../components/SelectLocations";
// import { locations } from "../constants/locations";
import { axiosClient } from "../../../shared/api/baseUrl";
import LanguageToggle from "../../../shared/ui/LanguageToggle";

const MyApplications = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const [isInsideGaza, setIsInsideGaza] = useState(false);
  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [search, setSearch] = useState("");

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const {} = useForm<any>({
    defaultValues: {
      id: "",
    },
  });

  // Complaint Dialog State
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [complaintApp, setComplaintApp] = useState<any>(null);

  const theme = useTheme();
  const citizenInfo = JSON.parse(localStorage.getItem("citizenInfo") || "{}");

  // Close Complaint Confirmation State
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [appToClose, setAppToClose] = useState<any>(null);
  const [closingComplaint, setClosingComplaint] = useState(false);

  const [rawData, setRawData] = useState<any>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, complaintsRes] = await Promise.all([
          axiosClient.get(API.citizen.applications.list, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axiosClient.get(API.citizen.complaints.list, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const apps = appsRes.data.damage_reports || appsRes.data || [];
        const complaintsRaw =
          complaintsRes.data?.complaints ||
          complaintsRes.data?.data?.complaints ||
          complaintsRes.data?.data ||
          [];
        const complaints = Array.isArray(complaintsRaw)
          ? complaintsRaw
          : complaintsRaw.data || [];

        // Merge complaints into apps
        const enhancedApps = (Array.isArray(apps) ? apps : []).map(
          (app: any) => {
            const complaint = complaints.find(
              (c: any) =>
                String(c.damage_report?.id) === String(app.id) ||
                String(c.damage_report_id) === String(app.id),
            );
            return { ...app, complaint };
          },
        );

        setRawData(enhancedApps);
        // setNeighborhoods(neighborhoodsRes.data.neighborhoods || []);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Robust data handling
  const applications: any[] = Array.isArray(rawData) ? rawData : [];

  // Filter applications
  const filteredApplications = applications?.filter((app: any) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();

    // Search by ID or Report Code (Tracking Number)
    const idMatch =
      app.id?.toString().includes(lowerSearch) ||
      app.report_code?.toLowerCase().includes(lowerSearch);

    // Search by Neighborhood ID or Address
    const neighborhoodMatch = app.neighborhood_id
      ?.toString()
      .includes(lowerSearch);

    // Search by Status (Localized Label)
    const statusLabel = t(`status.${app.status?.toLowerCase()}`)?.toLowerCase();
    const statusMatch =
      statusLabel?.includes(lowerSearch) ||
      app.status?.toLowerCase().includes(lowerSearch);

    // Search by Address, Landmark, or Street
    const buildingType = app.damage_details?.buildingType;
    const buildingData = app.damage_details?.[buildingType] || {};
    const addressMatch =
      app.address?.toLowerCase().includes(lowerSearch) ||
      buildingData.landmark?.toLowerCase().includes(lowerSearch) ||
      buildingData.nameOfStreet?.toLowerCase().includes(lowerSearch);

    return idMatch || neighborhoodMatch || statusMatch || addressMatch;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGeneratePdf = () => {
    generatePDFReceipt(rawData, t, language);
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
    const status = app.status?.toUpperCase() || "SUBMITTED";
    const canEdit = status === "SUBMITTED";

    // إنشاء نسخة عميقة من الكائن بدلاً من تعديله مباشرة
    const transformedApp = JSON.parse(JSON.stringify(app)); // <-- الحل هنا

    if (app.damageAttachments && app.damageAttachments.length > 0) {
      // تصنيف المرفقات حسب الفئة
      const beforeImage = app.damageAttachments.find(
        (att: any) => att.category === "before_damage_image",
      );
      const afterImage = app.damageAttachments.find(
        (att: any) => att.category === "after_damage_image",
      );
      const ownershipDocs = app.damageAttachments.filter(
        (att: any) => att.category === "ownership_documents",
      );

      // إضافة الصور إلى الكائن الرئيسي (النسخة الجديدة)
      if (beforeImage) {
        transformedApp.before_damage_image = beforeImage.file_url;
      }
      if (afterImage) {
        transformedApp.after_damage_image = afterImage.file_url;
      }
      if (ownershipDocs.length > 0) {
        transformedApp.ownership_documents = ownershipDocs.map(
          (doc: any) => doc.file_url,
        );
      }

      // أيضاً إضافتها داخل damage_details إذا كان الـ buildingType موجود
      const buildingType = app.damage_details?.buildingType;
      if (buildingType && app.damage_details[buildingType]) {
        // تأكد من وجود الكائن
        if (!transformedApp.damage_details[buildingType]) {
          transformedApp.damage_details[buildingType] = {};
        }
        if (beforeImage) {
          transformedApp.damage_details[buildingType].before_damage_image =
            beforeImage.file_url;
        }
        if (afterImage) {
          transformedApp.damage_details[buildingType].after_damage_image =
            afterImage.file_url;
        }
        if (ownershipDocs.length > 0) {
          transformedApp.damage_details[buildingType].ownership_documents =
            ownershipDocs.map((doc: any) => doc.file_url);
        }
      }
    }

    setSelectedApplication(transformedApp); // استخدم النسخة الجديدة
    setIsReadOnly(!canEdit);
    setDialogOpen(true);
  };

  const handleDownloadAppPdf = (app: any) => {
    generateApplicationPDF(app, t, language);
  };

  const handleOpenComplaint = (app: any) => {
    setComplaintApp(app);
    setComplaintDialogOpen(true);
  };
  const handleCloseComplaintDialog = () => {
    setComplaintDialogOpen(false);
    setComplaintApp(null);
  };

  const handleOpenCloseConfirm = (app: any) => {
    setAppToClose(app);
    setCloseConfirmOpen(true);
  };

  const handleConfirmCloseComplaint = async () => {
    if (!appToClose?.complaint?.id) return;

    setClosingComplaint(true);
    try {
      await axiosClient.put(
        API.citizen.complaints.close(appToClose.complaint.id),
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      enqueueSnackbar(
        appToClose?.complaint?.type === "COMPLAINT"
          ? t("complaint.closeSuccess")
          : t("complaint.closeObjectionSuccess"),
        { variant: "success" },
      );
      setCloseConfirmOpen(false);

      // Refresh applications to update status
      const [appsRes, complaintsRes] = await Promise.all([
        axiosClient.get(API.citizen.applications.list, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axiosClient.get(API.citizen.complaints.list, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const apps = appsRes.data.damage_reports || appsRes.data || [];
      const complaintsRaw =
        complaintsRes.data?.complaints ||
        complaintsRes.data?.data?.complaints ||
        complaintsRes.data?.data ||
        [];
      const complaints = Array.isArray(complaintsRaw)
        ? complaintsRaw
        : complaintsRaw.data || [];

      const enhancedApps = (Array.isArray(apps) ? apps : []).map((app: any) => {
        const complaint = complaints.find(
          (c: any) =>
            String(c.damage_report?.id) === String(app.id) ||
            String(c.damage_report_id) === String(app.id),
        );
        return { ...app, complaint };
      });

      setRawData(enhancedApps);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        appToClose?.complaint?.type === "COMPLAINT"
          ? t("complaint.closeError")
          : t("complaint.closeObjectionError"),
        { variant: "error" },
      );
    } finally {
      setClosingComplaint(false);
      setAppToClose(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
    // Optional: Refresh list if edited?
    // if (!isReadOnly) refresh(); // If we have refresh exposed
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
          direction={{ xs: "column", md: "column" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {t("citizen.myRequests")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("citizen.myRequestsDesc")}
              </Typography>
            </Box>

            <BackButton
              sx={{ mb: 0, mt: 0 }}
              language={language}
              to={ROUTES.CITIZEN_DASHBOARD}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              ml: "0 !important",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
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
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("citizen.addDamageRequest")}
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={
                <DescriptionIcon
                  sx={{
                    fontSize: 40,
                    marginLeft: 1,
                    flexBasis: "1",
                    width: { xs: "100%", sm: "auto" },
                  }}
                />
              }
              onClick={handleGeneratePdf}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("success.downloadReceipt")}
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<ComplaintIcon sx={{ ml: 1 }} />}
              onClick={() => navigate("/citizen/my-complaints")}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
                bgcolor: "error.main",
                "&:hover": {
                  bgcolor: "error.dark",
                },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("complaint.myComplaintsAndObjections")}
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

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t("form.enterTrackingNumber")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1 }} />,
            }}
            size="small"
          />
        </Box>
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
              startIcon={<AddIcon sx={{ ml: 1 }} />}
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
                sm: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 5,
            }}
            className="sm:px-10 lg:px-0"
          >
            {filteredApplications.map((app: any, index: number) => (
              <ApplicationCard
                key={app.id || index}
                index={index}
                application={app}
                onAction={handleAction}
                onDownloadPdf={handleDownloadAppPdf}
                onAddComplaint={handleOpenComplaint}
                onCloseComplaint={handleOpenCloseConfirm}
                // neighborhoods={neighborhoods}
                notes={app.notes}
                statusReport={app.report_process_stage}
              />
            ))}
          </Box>
        )}

        {/* Damage Assessment Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
          disableScrollLock
          disableEscapeKeyDown
        >
          {selectedApplication && (
            <DamageAssessmentDialog
              onClose={handleDialogClose}
              readOnly={isReadOnly}
              initialData={selectedApplication}
              location={{
                position: [
                  selectedApplication?.latitude,
                  selectedApplication?.longitude,
                ],
                address: `${selectedApplication?.address}`,
                neighborhood_id: `${selectedApplication?.neighborhood_id}`,
                landmark: `${selectedApplication?.landmark}`,
              }}
            />
          )}
        </Dialog>

        {/* Complaint Dialog */}
        <ComplaintDialog
          open={complaintDialogOpen}
          onClose={handleCloseComplaintDialog}
          application={complaintApp}
        />

        <ConfirmDialog
          open={closeConfirmOpen}
          onClose={() => setCloseConfirmOpen(false)}
          onConfirm={handleConfirmCloseComplaint}
          title={
            appToClose?.complaint?.type === "COMPLAINT"
              ? t("complaint.closeComplaint")
              : t("complaint.closeObjection")
          }
          message={
            appToClose?.complaint?.type === "COMPLAINT"
              ? t("complaint.closeConfirm")
              : t("complaint.closeObjectionConfirm")
          }
          type="warning"
          loading={closingComplaint}
        />
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
                borderRight: language === "ar" ? "6px solid #10B981" : "none",
                borderLeft: language === "ar" ? "none" : "6px solid #10B981",
                mb: 2,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOnIcon sx={{ color: "#10B981", fontSize: 28 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "20px", sm: "25px" },
                      fontWeight: "bold",
                      color: "#047857",
                    }}
                  >
                    {t("citizen.currentLocation")}
                  </Typography>
                </Stack>
                <IconButton
                  onClick={() => navigate(`${ROUTES.CURRENT_LOCATION}`)}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 2, borderColor: alpha("#10B981", 0.3) }} />

              <Typography sx={{ mb: 1 }}>
                <strong>{t("citizen.address")}:</strong>{" "}
                {citizenInfo?.current_location?.address || "-"}
              </Typography>

              {citizenInfo?.current_location && (
                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                  {citizenInfo.current_location.governorate && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "المحافظة" : "Governorate"}:
                      </strong>{" "}
                      {citizenInfo.current_location.governorate.name}
                    </Typography>
                  )}
                  {citizenInfo.current_location.municipality && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "البلدية" : "Municipality"}:
                      </strong>{" "}
                      {citizenInfo.current_location.municipality.name}
                    </Typography>
                  )}
                  {citizenInfo.current_location.neighborhood && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "الحي" : "Neighborhood"}:
                      </strong>{" "}
                      {citizenInfo.current_location.neighborhood.name}
                    </Typography>
                  )}
                  {citizenInfo.current_location.landmark && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "أقرب معلم" : "Landmark"}:
                      </strong>{" "}
                      {citizenInfo.current_location.landmark.name}
                    </Typography>
                  )}
                </Stack>
              )}

              <Typography>
                <strong>{t("citizen.addedDate")}:</strong>{" "}
                {citizenInfo?.current_location
                  ? formatDate(
                      new Date(citizenInfo.current_location.created_at),
                    )
                  : "-"}
                .
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon sx={{ ml: language === "ar" ? 1 : 0 }} />}
                onClick={() => navigate(`${ROUTES.CURRENT_LOCATION}?edit=true`)}
                sx={{
                  mt: 2,
                  alignSelf: "flex-start",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  bgcolor: "#10B981",
                  "&:hover": {
                    bgcolor: "#059669",
                    boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                  },
                }}
              >
                {citizenInfo.current_location
                  ? t("citizen.editCurrentLocation")
                  : t("citizen.addCurrentLocation")}
              </Button>
            </Stack>
          </Box>
        </CardContent>

        <LanguageToggle />
      </Container>
    </Fade>
  );
};

export default MyApplications;
