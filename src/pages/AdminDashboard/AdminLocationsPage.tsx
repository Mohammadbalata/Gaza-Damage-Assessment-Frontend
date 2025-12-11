import { useState } from "react";
import { useForm } from "react-hook-form";
import { Chip } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Container,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Stack,
  MenuItem,
  Link as MuiLink,
} from "@mui/material";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Location } from "../../services/api";
import { locationSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
// import { LOCATION_STYLES } from "../../utils/locationStyles";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationFormData {
  citizenId: number;
  type: Location["type"];
  governorate?: string;
  town?: string;
  street?: string;
  block_number?: string;
  house_number?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

interface MapClickSelectorProps {
  onSelect: (lat: number, lng: number) => void;
}

const MapClickSelector = ({ onSelect }: MapClickSelectorProps) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};
const locationColors: Record<string, any> = {
  before_war: {
    bgcolor: "rgba(183, 28, 28, 0.12)",
    color: "#b71c1c",
    fontWeight: 600,
  },
  after_war: {
    bgcolor: "rgba(255, 143, 0, 0.12)",
    color: "#ff8f00",
    fontWeight: 600,
  },
  temporary: {
    bgcolor: "rgba(2, 136, 209, 0.12)",
    color: "#0288d1",
    fontWeight: 600,
  },
  current: {
    bgcolor: "rgba(46, 125, 50, 0.12)",
    color: "#2e7d32",
    fontWeight: 600,
  },
};

export function AdminLocationsPage() {
  const { t, language } = useLanguage();
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const canManage = hasRole("admin");
  const canView = hasRole("admin", "supervisor");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const locationTypes = [
    { id: 1, value: "before_war", label: t("admin.locations.beforeWar") },
    { id: 2, value: "after_war", label: t("admin.locations.afterWar") },
    { id: 3, value: "temporary", label: t("admin.locations.temporary") },
    { id: 4, value: "current", label: t("admin.locations.current") },
  ];

  // Form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<LocationFormData>({
    resolver: yupResolver(locationSchema),
    defaultValues: {
      citizenId: 0,
      type: "current",
      governorate: "",
      town: "",
      street: "",
      block_number: "",
      house_number: "",
      latitude: undefined,
      longitude: undefined,
      notes: "",
    },
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const {
    loading,
    data: locations,
    setData,
  } = useGet<Location[]>("/locations", {
    immediate: true,
  });

  const { loading: loadingDeleteLocation, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.locationDeleted"));
      setData((prev) =>
        prev ? prev.filter((l) => l.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteLocation"));
    },
  });

  const { loading: loadingCreateLocation, execute: executeCreateLocation } =
    usePost("/locations", {
      onSuccess: (data) => {
        setData((prev) => (prev ? [data, ...prev] : [data]));
        showSuccess(t("success.locationCreated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.createLocation"));
      },
    });

  const { loading: loadingUpdateLocation, execute: executeUpdateLocation } =
    usePatch({
      onSuccess: (data) => {
        setData(
          (prev) => prev?.map((l) => (l.id === data.id ? data : l)) || prev
        );
        showSuccess(t("success.locationUpdated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.updateLocation"));
      },
    });

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      citizenId: 0,
      type: "current",
      governorate: "",
      town: "",
      street: "",
      block_number: "",
      house_number: "",
      latitude: undefined,
      longitude: undefined,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (location: Location) => {
    setEditing(location);
    reset({
      citizenId: location.citizenId,
      type: location.type,
      governorate: location.governorate || "",
      town: location.town || "",
      street: location.street || "",
      block_number: location.block_number || "",
      house_number: location.house_number || "",
      latitude: location.latitude || undefined,
      longitude: location.longitude || undefined,
      notes: location.notes || "",
    });
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: LocationFormData) => {
    const payload = {
      citizenId: data.citizenId,
      type: data.type,
      governorate: data.governorate || null,
      town: data.town || null,
      street: data.street || null,
      block_number: data.block_number || null,
      house_number: data.house_number || null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      notes: data.notes || null,
    };

    if (editing) {
      executeUpdateLocation(`/locations/${editing.id}`, payload);
    } else {
      executeCreateLocation(payload);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(`/locations/${deleteConfirm.id}`);
  };

  const filteredLocations = locations?.filter(
    (location) =>
      location.citizen?.first_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      location.citizen?.national_id?.includes(search) ||
      location.governorate?.toLowerCase().includes(search.toLowerCase()) ||
      location.town?.toLowerCase().includes(search.toLowerCase()) ||
      location.street?.toLowerCase().includes(search.toLowerCase())
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert
          message={t("admin.locations.permissionMessage")}
          severity="warning"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        className="mb-4 flex items-center gap-2 cursor-pointer text-blue-800 max-w-fit"
        onClick={() => navigate("/admin/dashboard")}
      >
        <span
          className="hover:underline text-blue-800 cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          {t("common.backToDashboard")}
        </span>
        <ArrowBack className={`${language == "en" ? "rotate-180" : ""}`} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t("admin.locations.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.locations.subtitle")}
          </Typography>
        </Box>
        {canManage && (
          <Button
            variant="contained"
            startIcon={
              <Plus className={`${language == "ar" ? "ml-2" : ""}`} size={20} />
            }
            onClick={openCreateDialog}
          >
            {t("admin.locations.create")}
          </Button>
        )}
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t("common.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
          }}
          size="small"
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredLocations?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noLocationsFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">{t("admin.citizen")}</TableCell>
                <TableCell align="center">{t("admin.type")}</TableCell>
                <TableCell align="center">{t("admin.address")}</TableCell>
                <TableCell align="center">{t("admin.coordinates")}</TableCell>
                {canManage && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocations?.map((location: Location) => (
                <TableRow
                  key={location.id}
                  hover
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {location.citizen?.first_name ||
                        `Citizen #${location.citizenId}`}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {location.citizen?.national_id}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={location.type.replace("_", " ")}
                      sx={{
                        ...locationColors[location.type],
                        textTransform: "capitalize",
                        borderRadius: "6px",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.8rem",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {[location.governorate, location.town, location.street]
                      .filter(Boolean)
                      .join(" • ") || "-"}
                  </TableCell>
                  <TableCell align="center">
                    {location.latitude != null && location.longitude != null ? (
                      <Box>
                        <Typography variant="body2">
                          {location.latitude}, {location.longitude}
                        </Typography>
                        <MuiLink
                          component={Link}
                          to={`/admin/locations/map?lat=${location.latitude}&lng=${location.longitude}`}
                          variant="caption"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {t("map.showonmap")}
                        </MuiLink>
                      </Box>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  {canManage && (
                    <TableCell align="center">
                      <Box>
                        <Button
                          size="small"
                          startIcon={
                            <Edit2
                              className={`${language == "ar" ? "ml-2" : ""}`}
                              size={16}
                            />
                          }
                          onClick={() => openEditDialog(location)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <Trash2
                              className={`${language == "ar" ? "ml-2" : ""}`}
                              size={16}
                            />
                          }
                          onClick={() =>
                            setDeleteConfirm({ open: true, id: location.id })
                          }
                        >
                          {t("common.delete")}
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editing ? t("admin.locations.update") : t("admin.locations.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <FormTextField
                control={control}
                name="citizenId"
                label={t("admin.locations.citizenId")}
                type="number"
              />
              <FormTextField
                control={control}
                name="type"
                label={t("admin.locations.formType")}
                select
              >
                {locationTypes.map((type) => (
                  <MenuItem
                    key={type.id}
                    value={type.value}
                    sx={locationColors[type.value]}
                  >
                    {type.label}
                  </MenuItem>
                ))}
              </FormTextField>
              <FormTextField
                control={control}
                name="governorate"
                label={t("admin.locations.governorate")}
              />
              <FormTextField
                control={control}
                name="town"
                label={t("admin.locations.town")}
              />
              <FormTextField
                control={control}
                name="street"
                label={t("admin.locations.street")}
              />
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <FormTextField
                  control={control}
                  name="block_number"
                  label={t("admin.locations.block")}
                />
                <FormTextField
                  control={control}
                  name="house_number"
                  label={t("admin.locations.house")}
                />
              </Box>
              <FormTextField
                control={control}
                name="latitude"
                label={t("admin.locations.latitude")}
                type="number"
                inputProps={{ step: "0.0000001" }}
              />
              <FormTextField
                control={control}
                name="longitude"
                label={t("admin.locations.longitude")}
                type="number"
                inputProps={{ step: "0.0000001" }}
              />
            </Box>

            <FormTextField
              control={control}
              name="notes"
              label={t("admin.locations.notes")}
              multiline
              rows={3}
            />

            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                {t("admin.selectOnMap")}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mb: 2, display: "block" }}
              >
                {t("admin.selectOnMapHelp")}
              </Typography>
              <Box
                sx={{
                  height: 256,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: 1,
                  borderColor: "grey.300",
                }}
              >
                <MapContainer
                  center={[31.5, 34.3]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickSelector
                    onSelect={(lat, lng) => {
                      setValue("latitude", Number(lat.toFixed(7)));
                      setValue("longitude", Number(lng.toFixed(7)));
                    }}
                  />
                  {latitude && longitude && (
                    <Marker position={[latitude, longitude]} />
                  )}
                </MapContainer>
              </Box>
              {latitude && longitude && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {t("admin.coordinates")}: {latitude}, {longitude}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={
              isSubmitting || loadingCreateLocation || loadingUpdateLocation
            }
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.locations.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.locations.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeleteLocation}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminLocationsPage;
