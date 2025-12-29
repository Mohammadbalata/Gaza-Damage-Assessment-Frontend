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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import ApplicationCard from "../components/MyApplications/ApplicationCard";

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
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLanguage } from "../contexts/LanguageContext";
import { useGet, usePost } from "../hooks/api/useApi";
import { ROUTES } from "../routes/Routes";
import ErrorAlert from "../components/Shared/ErrorAlert";
import BackButton from "../components/Shared/BackButton";
import DamageAssessmentDialog from "./DamageAssessmentDialog";
import {
  generatePDFReceipt,
  generateApplicationPDF,
} from "../utils/pdfGenerator";
import { API } from "../constants/ApiRoutes";
import { formatDate } from "../utils/helpers";
import { RotateCcw, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import MapContainer from "../components/MapContainer";
import SelectLocations, { locations } from "../components/SelectLocations";

const MyApplications = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [search, setSearch] = useState("");

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const {} = useForm<any>({
    defaultValues: {
      id: "",
    },
  });

  // Current Location Edit Dialog State
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationPosition, setLocationPosition] = useState<
    [number, number] | null
  >(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [locationNeighborhood, setLocationNeighborhood] = useState<string>(
    locations[11].name
  );
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const theme = useTheme();

  // usePost for updating current location
  const { loading: locationLoading, execute: updateLocation } = usePost(
    `${API.citizen.locations.current}`,
    {
      onSuccess: () => {
        enqueueSnackbar(t("citizen.updateLocationSuccess"), {
          variant: "success",
        });
        setLocationDialogOpen(false);
        refreshApplications();
      },
      onError: (err) => {
        enqueueSnackbar(t("citizen.updateLocationError"), { variant: "error" });
        console.error(err);
      },
    }
  );

  // Reverse geocoding for location address
  useEffect(() => {
    if (locationPosition) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationPosition[0]}&lon=${locationPosition[1]}`
      )
        .then((res) => res.json())
        .then((data) => {
          setLocationAddress(data.display_name || t("map.selectLocation"));
        })
        .catch(() => {
          setLocationAddress(
            `Lat: ${locationPosition[0].toFixed(
              6
            )}, Lng: ${locationPosition[1].toFixed(6)}`
          );
        });
    }
  }, [locationPosition, t]);

  // const id = watch("id");

  const {
    data: rawData,
    loading,
    error,
    execute: refreshApplications,
  } = useGet<any>(`${API.citizen.applications.list}`, {
    immediate: true,
  });

  // Robust data handling
  const applications: any[] = Array.isArray(rawData)
    ? rawData
    : rawData
    ? (rawData as any).applications
    : [];
  const citizen: any = rawData?.citizen;

  // Filter applications
  const filteredApplications = applications.filter((app: any) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();

    // Search by ID
    const idMatch = app.id?.toString().includes(lowerSearch);

    // Search by Address/Neighborhood
    const locationMatch =
      app.location?.address?.toLowerCase().includes(lowerSearch) ||
      app.location?.neighborhood?.toLowerCase().includes(lowerSearch);

    // Search by Status
    const statusMatch = app.status?.toLowerCase().includes(lowerSearch);

    return idMatch || locationMatch || statusMatch;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // const filterdApplications = id
  //   ? applications?.filter((item: any) => item.id === id)
  //   : applications;

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
  const handleDownloadAppPdf = (app: any) => {
    generateApplicationPDF(citizen, app, t, language);
    console.log(app);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
    // Optional: Refresh list if edited?
    // if (!isReadOnly) refresh(); // If we have refresh exposed
  };

  // Location Dialog Handlers
  const handleOpenLocationDialog = () => {
    // Pre-fill with existing location if available
    if (citizen?.current_location) {
      const lat = parseFloat(citizen.current_location.latitude);
      const lng = parseFloat(citizen.current_location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocationPosition([lat, lng]);
        setMapCenter([lat, lng]);
      }
      setLocationAddress(citizen.current_location.address || "");
    } else {
      setLocationPosition(null);
      setLocationAddress("");
    }
    setLocationDialogOpen(true);
  };

  const handleCloseLocationDialog = () => {
    setLocationDialogOpen(false);
    setLocationPosition(null);
    setLocationAddress("");
  };

  const handleResetLocation = () => {
    setLocationPosition(null);
    setLocationAddress("");
  };

  const handleConfirmLocationUpdate = () => {
    if (locationPosition && locationAddress) {
      updateLocation({
        latitude: locationPosition[0].toString(),
        longitude: locationPosition[1].toString(),
        address: locationAddress,
        neighborhood: locationNeighborhood,
      });
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
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            {filteredApplications.map((app: any, index: number) => (
              <ApplicationCard
                key={app.id || index}
                index={index}
                application={app}
                onAction={handleAction}
                onDownloadPdf={handleDownloadAppPdf}
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
              location={null}
              onSuccess={refreshApplications}
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
                  onClick={handleOpenLocationDialog}
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
                {citizen?.current_location?.address || "-"}
              </Typography>

              <Typography>
                <strong>{t("citizen.addedDate")}:</strong>{" "}
                {citizen?.current_location
                  ? formatDate(new Date(citizen.current_location.createdAt))
                  : "-"}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon sx={{ ml: language === "ar" ? 1 : 0 }} />}
                onClick={handleOpenLocationDialog}
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
                {t("citizen.editCurrentLocation")}
              </Button>
            </Stack>
          </Box>
        </CardContent>

        {/* Edit Current Location Dialog */}
        <Dialog
          open={locationDialogOpen}
          onClose={handleCloseLocationDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LocationOnIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                {t("citizen.editCurrentLocation")}
              </Typography>
            </Stack>
            <IconButton onClick={handleCloseLocationDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("map.currentLocationDescription")}
            </Typography>

            {/* Map Container */}
            <Box
              sx={{
                height: 350,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
              }}
            >
              <MapContainer
                center={mapCenter}
                zoom={15}
                markerPosition={locationPosition}
                setMarkerPosition={setLocationPosition}
                height="100%"
                width="100%"
                setAddress={setLocationAddress}
              />
            </Box>

            {/* Location Info */}
            {locationPosition && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 2,
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  useFlexGap={true}
                >
                  <Box flex={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      gutterBottom
                    >
                      {t("map.coordinates")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" dir="ltr">
                      {locationPosition[0].toFixed(6)},{" "}
                      {locationPosition[1].toFixed(6)}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      gutterBottom
                    >
                      {t("map.address")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {locationAddress}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Neighborhood Select */}
            <SelectLocations
              handleReset={handleResetLocation}
              setNeighborhood={setLocationNeighborhood}
              setCenter={setMapCenter}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              bgcolor: "background.default",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleResetLocation}
              disabled={!locationPosition}
              startIcon={
                <RotateCcw
                  className={language === "ar" ? "ml-2" : "mr-2"}
                  size={18}
                />
              }
            >
              {t("map.reset")}
            </Button>
            <Button
              sx={{ mx: 1 }}
              variant="outlined"
              onClick={handleCloseLocationDialog}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmLocationUpdate}
              disabled={
                !locationPosition || !locationAddress || locationLoading
              }
              startIcon={
                locationLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Check
                    className={language === "ar" ? "ml-2" : "mr-2"}
                    size={18}
                  />
                )
              }
              sx={{
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              {locationLoading ? "" : t("common.save")}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
};

export default MyApplications;
