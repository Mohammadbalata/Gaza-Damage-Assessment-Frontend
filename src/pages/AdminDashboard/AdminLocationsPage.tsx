import { useEffect, useState } from "react";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Chip,
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
  Autocomplete,
} from "@mui/material";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Citizen, Location, LocationType, UserRole } from "../../types/entities";
import { FormTextField } from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import MapContainer from "../../components/MapContainer";
import { locationSchema } from "../../services/validation";
import { API } from "../../constants/ApiRoutes";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationFormData {
  type: Location["type"];
  notes?: string;
  citizenId?: number;
}

const locationColors: Record<string, object> = {
  BEFORE_WAR: {
    bgcolor: "rgba(183, 28, 28, 0.12)",
    color: "#b71c1c",
    fontWeight: 600,
  },
  AFTER_WAR: {
    bgcolor: "rgba(255, 143, 0, 0.12)",
    color: "#ff8f00",
    fontWeight: 600,
  },
  TEMPORARY: {
    bgcolor: "rgba(2, 136, 209, 0.12)",
    color: "#0288d1",
    fontWeight: 600,
  },
  CURRENT: {
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

  const canManage = hasRole(UserRole.ADMIN);
  const canView = hasRole(UserRole.ADMIN,UserRole.SUPERVISOR);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [search, setSearch] = useState("");
  const [citizenSearch, setCitizenSearch] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const [position, setPosition] = useState<[number, number] | null>();
  const [address, setAddress] = useState("");

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const center = position || defaultCenter;

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
    setValue,
    formState: { isSubmitting },
  } = useForm<LocationFormData>({
    resolver: yupResolver(
      locationSchema
    ) as unknown as Resolver<LocationFormData>,
    defaultValues: {
      citizenId: undefined,
      type: LocationType.CURRENT,
      notes: "",
    },
  });

  const {
    loading,
    data: locations,
    setData,
  } = useGet<Location[]>(API.admin.locations.list, {
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

  const { data: citizenOptions, loading: citizenLoading } = useGet(
    API.admin.citizens.list,
    { immediate: true }
  );

  const { loading: loadingCreateLocation, execute: executeCreateLocation } =
    usePost(API.admin.locations.create, {
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

  useEffect(() => {
    if (position) {
      // Reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "Location selected");
        })
        .catch(() => {
          // setAddress(
          //   `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`
          // );
          setAddress("");
        });
    }
  }, [position]);

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    setPosition(null);
    reset({
      type: LocationType.CURRENT,
      notes: "",
      citizenId: undefined,
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (location: Location) => {
    setEditing(location);
    setPosition([location?.latitude || 0, location?.longitude || 0]);
    setSelectedCitizen(
      citizenOptions.filter(
        (c: Citizen) => c.id === location?.citizen?.id
      )[0] || null
    );
    reset({
      type: location.type,
      notes: location.notes || "",
      citizenId: location?.citizen?.id,
    });
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: LocationFormData & { citizenId?: number }) => {
    const payload = {
      citizenId: editing ? data.citizenId : selectedCitizen?.id,
      type: data.type,
      governorate: address || null,
      latitude: position ? position[0] : null,
      longitude: position ? position[1] : null,
      notes: data.notes || null,
    };
    if (editing) {
      executeUpdateLocation(API.admin.locations.update(editing.id.toString()), payload);
    } else {
      executeCreateLocation(payload);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(API.admin.locations.delete(deleteConfirm.id.toString()));
  };

  const filteredLocations = locations?.filter(
    (location) =>
      location.citizen?.first_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      location.citizen?.national_id?.includes(search) ||
      location.address?.toLowerCase().includes(search.toLowerCase()) ||
      location.town?.toLowerCase().includes(search.toLowerCase()) ||
      location.street?.toLowerCase().includes(search.toLowerCase()) ||
      location.neighborhood?.toLowerCase().includes(search.toLowerCase())
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
                <TableCell align="center">{t("admin.neighborhood")}</TableCell>
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
                      label={location.type.replace("_", " ").toLocaleLowerCase()}
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
                  <TableCell align="center">{location.neighborhood}</TableCell>
                  <TableCell align="center">
                    {[location.address, location.town, location.street]
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
          {editing ? t("admin.locations.update") : t("admin.locations.create")}{" "}
          {editing?.applicationId}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            ></Box>

            {/* <FormTextField
              control={control}
              name="citizenId"
              label={t("admin.locations.citizenId")}
              select
            >
              {citizens?.map((citizen: Citizen) => (
                <MenuItem key={citizen.id} value={citizen.id}>
                  {citizen.full_name} - {citizen.national_id}
                </MenuItem>
              ))}
            </FormTextField> */}

            {editing ? (
              <TextField
                label={t("admin.applications.citizen")}
                value={`${selectedCitizen?.full_name ?? "----"} (${
                  selectedCitizen?.national_id
                })`}
                disabled
                fullWidth
              />
            ) : (
              <Autocomplete
                options={citizenOptions}
                getOptionLabel={(option) =>
                  `${option.full_name || option.first_name || ""} (${
                    option.national_id
                  })`
                }
                loading={citizenLoading}
                value={selectedCitizen}
                onChange={(_, newValue) => {
                  setSelectedCitizen(newValue);
                  setValue("citizenId", newValue?.id || 0);
                }}
                inputValue={citizenSearch}
                onInputChange={(_, newInputValue) => {
                  setCitizenSearch(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("admin.applications.citizen")}
                    placeholder={
                      t("admin.applications.searchCitizenPlaceholder") ||
                      "Search by name or national ID"
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {citizenLoading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}

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
                  height: 400,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: 1,
                  borderColor: "grey.300",
                }}
              >
                <MapContainer
                  center={center}
                  zoom={15}
                  markerPosition={position}
                  setMarkerPosition={setPosition}
                  height="100%"
                  width="100%"
                  {...{ setAddress }}
                />
              </Box>
            </Box>

            <FormTextField
              control={control}
              name="notes"
              label={t("admin.locations.notes")}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit as SubmitHandler<LocationFormData>)}
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
