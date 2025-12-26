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
} from "@mui/material";
import { Plus, Trash2, Edit2, Search, Import } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Citizen } from "../../types/entities";
import { citizenSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";

interface CitizenFormData {
  national_id: string;
  first_name: string;
  father_name: string;
  grandfather_name: string;
  family_name: string;
  phone_number: string;
}

export function AdminCitizensPage() {
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasPermission(permissions.citizen.create);
  const canView = hasPermission(permissions.citizen.view);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Citizen | null>(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CitizenFormData>({
    resolver: yupResolver(citizenSchema) as any,
    defaultValues: {
      national_id: "",
      first_name: "",
      father_name: "",
      grandfather_name: "",
      family_name: "",
      phone_number: "",
    },
  });

  const {
    loading,
    data: citizens,
    setData,
  } = useGet<Citizen[]>(API.admin.citizens.list, {
    immediate: true,
  });

  const { loading: loadingDeleteCitizen, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.citizenDeleted"));
      // Remove deleted citizen from list
      setData((prev) =>
        prev ? prev.filter((c) => c.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteCitizen"));
    },
  });

  const { loading: loadingCreateCitizen, execute: executeCreateCitizen } =
    usePost(API.admin.citizens.create, {
      onSuccess: (data) => {
        setData((prev) => (prev ? [data, ...prev] : [data]));
        showSuccess(t("success.citizenCreated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.createCitizen"));
      },
    });

  const { loading: loadingUpdateCitizen, execute: executeUpdateCitizen } =
    usePatch({
      onSuccess: (data) => {
        setData(
          (prev) => prev?.map((c) => (c.id === data.id ? data : c)) || prev
        );
        showSuccess(t("success.citizenUpdated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.updateCitizen"));
      },
    });

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      national_id: "",
      first_name: "",
      father_name: "",
      grandfather_name: "",
      family_name: "",
      phone_number: "",
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (citizen: Citizen) => {
    setEditing(citizen);
    reset({
      national_id: citizen.national_id || "",
      first_name: citizen.first_name || "",
      father_name: citizen.father_name || "",
      grandfather_name: citizen.grandfather_name || "",
      family_name: citizen.family_name || "",
      phone_number: citizen.phone_number || "",
    });
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: CitizenFormData) => {
    if (editing) {
      executeUpdateCitizen(API.admin.citizens.update(editing.id.toString()), {
        ...data,
      });
    } else {
      executeCreateCitizen({
        ...data,
      });
    }
  };

  const handleExportData = () => {
    fetch(`https://backend-5549.onrender.com/api${API.admin.citizens.export}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error while downloading Excel");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "citizens.xlsx";
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
    execute(API.admin.citizens.delete(deleteConfirm.id.toString()));
  };

  const filteredCitizens = citizens?.filter(
    (citizen) =>
      citizen.national_id.includes(search) ||
      (citizen.full_name &&
        citizen.full_name.toLowerCase().includes(search.toLowerCase()))
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert
          message={t("admin.noCitizensPermission")}
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
            {t("admin.citizens.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.citizens.subtitle")}
          </Typography>
        </Box>
        {hasPermission(permissions.citizen.export) && (
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
              {t("admin.citizens.export")}
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
              {t("admin.citizens.create")}
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
        ) : filteredCitizens?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noCitizensFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">
                  {t("admin.citizens.nationalId")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.citizens.fullName")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.citizens.phoneNumber")}
                </TableCell>
                {canManage && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCitizens?.map((citizen: Citizen) => (
                <TableRow
                  key={citizen.id}
                  hover
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell align="center">{citizen.national_id}</TableCell>
                  <TableCell align="center">
                    {citizen.full_name || "----"}
                  </TableCell>
                  <TableCell align="center">{citizen.phone_number}</TableCell>

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
                          onClick={() => openEditDialog(citizen)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <Trash2
                              className={`${language == "ar" ? "ml-2" : ""}  `}
                              size={16}
                            />
                          }
                          onClick={() =>
                            setDeleteConfirm({ open: true, id: citizen.id })
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editing ? t("admin.citizens.update") : t("admin.citizens.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <FormTextField
              control={control}
              name="national_id"
              label={t("form.nationalId")}
            />
            <FormTextField
              control={control}
              name="first_name"
              label={t("form.firstName")}
            />
            <FormTextField
              control={control}
              name="father_name"
              label={t("form.fatherName")}
            />
            <FormTextField
              control={control}
              name="grandfather_name"
              label={t("form.grandfatherName")}
            />
            <FormTextField
              control={control}
              name="family_name"
              label={t("form.familyName")}
            />
            <FormTextField
              control={control}
              name="phone_number"
              label={t("form.phoneNumber")}
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
              isSubmitting || loadingCreateCitizen || loadingUpdateCitizen
            }
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.citizens.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.citizens.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeleteCitizen}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminCitizensPage;
