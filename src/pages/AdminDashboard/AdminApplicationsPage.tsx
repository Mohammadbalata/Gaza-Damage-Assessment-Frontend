import { useState } from "react";
import { useForm } from "react-hook-form";
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
  Autocomplete,
  Chip,
} from "@mui/material";
import { Plus, Trash2, Edit2, Search, Import } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { applicationSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import {
  Application,
  ApplicationStatus,
  Citizen,
} from "../../types/entities";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";

interface ApplicationFormData {
  citizenId: number;
  status: ApplicationStatus;
  notes: string;
}
const applicationTypesColors: Record<string, object> = {
  PENDING: {
    bgcolor: "rgba(255, 193, 7, 0.15)", // Amber
    color: "#FFC107",
    fontWeight: 600,
  },

  VERIFIED: {
    bgcolor: "rgba(33, 150, 243, 0.15)", // Blue
    color: "#2196F3",
    fontWeight: 600,
  },

  APPROVED: {
    bgcolor: "rgba(76, 175, 80, 0.15)", // Green
    color: "#4CAF50",
    fontWeight: 600,
  },

  REJECTED: {
    bgcolor: "rgba(244, 67, 54, 0.15)", // Red
    color: "#F44354",
    fontWeight: 600,
  },

  CLOSED: {
    bgcolor: "rgba(158, 158, 158, 0.15)", // Grey
    color: "#9E9E9E",
    fontWeight: 600,
  },
};

export function AdminApplicationsPage() {
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasPermission(permissions.application.create);
  const canView = hasPermission(permissions.application.view);
  const canEditApplication = hasPermission(permissions.application.update);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  // Citizen search
  const [search, setSearch] = useState("");
  const [citizenSearch, setCitizenSearch] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

  // Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: yupResolver(applicationSchema) as any,
    defaultValues: {
      citizenId: 0,
      status: ApplicationStatus.PENDING,
      notes: "",
    },
  });

  const {
    loading,
    data: applications,
    setData,
  } = useGet<Application[]>(API.admin.applications.list, {
    immediate: true,
  });

  // const { data: locations } = useGet<Location[]>("/locations", {
  //   immediate: true,
  // });

  const { loading: loadingDeleteApplication, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.applicationDeleted"));
      setData((prev) =>
        prev ? prev.filter((a) => a.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteApplication"));
    },
  });

  const {
    loading: loadingCreateApplication,
    execute: executeCreateApplication,
  } = usePost(API.admin.applications.create, {
    onSuccess: (data) => {
      setData((prev) => (prev ? [data, ...prev] : [data]));
      showSuccess(t("success.applicationCreated"));
      setIsDialogOpen(false);
      reset();
      setSelectedCitizen(null);
      setCitizenSearch("");
    },
    onError: (error) => {
      showError(error || t("error.createApplication"));
    },
  });

  const {
    loading: loadingUpdateApplication,
    execute: executeUpdateApplication,
  } = usePatch({
    onSuccess: (data) => {
      setData(
        (prev) => prev?.map((a) => (a.id === data.id ? data : a)) || prev
      );
      showSuccess(t("success.applicationUpdated"));
      setIsDialogOpen(false);
      reset();
      setSelectedCitizen(null);
      setCitizenSearch("");
    },
    onError: (error) => {
      showError(error || t("error.updateApplication"));
    },
  });

  const { data: citizenOptions, loading: citizenLoading } = useGet(
    API.admin.citizens.list,
    { immediate: true }
  );

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      citizenId: 0,
      status: ApplicationStatus.PENDING,
      notes: "",
    });
    setSelectedCitizen(null);
    setCitizenSearch("");
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (application: Application) => {
    setEditing(application);
    reset({
      citizenId: application.citizenId,
      status: application.status,
      notes: application.notes || "",
    });
    setSelectedCitizen(application.citizen || null);
    setCitizenSearch(application.citizen?.full_name || "");
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: ApplicationFormData) => {
    if (editing) {
      executeUpdateApplication(
        API.admin.applications.update(editing.id.toString()),
        {
          ...data,
        }
      );
    } else {
      executeCreateApplication({
        ...data,
      });
    }
  };

  const handleExportData = () => {
    fetch(
      `https://backend-5549.onrender.com/api${API.admin.applications.export}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Server error while downloading Excel");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "applications.xlsx";
        a.click();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to download Excel file");
      });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(API.admin.applications.delete(deleteConfirm.id.toString()));
  };

  const filteredApplications = applications?.filter(
    (application) =>
      application.id.toString().includes(search) ||
      application.citizen?.first_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      application.citizen?.national_id?.includes(search)
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert
          message={t("admin.noApplicationsPermission")}
          severity="warning"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
            {t("admin.applications.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.applications.subtitle")}
          </Typography>
        </Box>
        {hasPermission(permissions.application.export) && (
          <span className="flex justify-center items-center gap-3">
            <Button
              variant="contained"
              color="inherit"
              startIcon={
                <Import
                  className={`${language == "ar" ? "ml-2" : ""} `}
                  size={20}
                />
              }
              onClick={handleExportData}
            >
              {t("admin.applications.export")}
            </Button>
            <Button
              variant="contained"
              startIcon={
                <Plus
                  className={`${language == "ar" ? "ml-2" : ""}`}
                  size={20}
                />
              }
              onClick={openCreateDialog}
            >
              {t("admin.applications.create")}
            </Button>
          </span>
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
        ) : filteredApplications?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noApplicationsFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">
                  {t("admin.applications.id")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.applications.citizen")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.applications.status")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.applications.updated")}
                </TableCell>
                {(canManage || canEditApplication) && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications?.map((application: Application) => (
                <TableRow
                  key={application.id}
                  hover
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell align="center">{application.id}</TableCell>
                  <TableCell align="center">
                    {application.citizen?.full_name || "----"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ textTransform: "capitalize" }}
                  >
                    <Chip
                      label={application.status
                        .replace("_", " ")
                        .toLocaleLowerCase()}
                      sx={{
                        ...applicationTypesColors[application.status],
                        textTransform: "capitalize",
                        borderRadius: "6px",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.8rem",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {new Date(application.updatedAt).toLocaleString()}
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
                          onClick={() => openEditDialog(application)}
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
                            setDeleteConfirm({ open: true, id: application.id })
                          }
                        >
                          {t("common.delete")}
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                  {canEditApplication && (
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
                          onClick={() => openEditDialog(application)}
                        >
                          {t("common.edit")}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editing
            ? t("admin.applications.update")
            : t("admin.applications.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* Citizen Search Autocomplete */}
            {editing ? (
              <TextField
                label={t("admin.applications.citizen")}
                value={`${selectedCitizen?.full_name} (${selectedCitizen?.national_id})`}
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

            {/* Status Select */}
            <FormTextField
              control={control}
              name="status"
              label={t("admin.applications.status")}
              select
            >
              <MenuItem value={ApplicationStatus.PENDING}>
                {t("status.submitted")}
              </MenuItem>
              <MenuItem value={ApplicationStatus.VERIFIED}>
                {t("status.verified")}
              </MenuItem>
              <MenuItem value={ApplicationStatus.APPROVED}>
                {t("status.approved")}
              </MenuItem>
              <MenuItem value={ApplicationStatus.REJECTED}>
                {t("status.rejected")}
              </MenuItem>
              <MenuItem value={ApplicationStatus.CLOSED}>
                {t("status.closed") || "Closed"}
              </MenuItem>
            </FormTextField>

            {/* Notes */}
            <FormTextField
              control={control}
              name="notes"
              label={t("admin.applications.notes")}
              multiline
              rows={4}
              placeholder={t("admin.applications.notesPlaceholder")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit as any)}
            variant="contained"
            disabled={
              isSubmitting ||
              loadingCreateApplication ||
              loadingUpdateApplication
            }
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.applications.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.applications.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeleteApplication}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminApplicationsPage;
