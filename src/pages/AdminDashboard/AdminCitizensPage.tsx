import React, { useState } from "react";
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
import { adminApi, Citizen } from "../../services/api";
import { citizenSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import FormSelectField from "../../components/Shared/FormSelectField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useGet } from "../../hooks/api/useApi";

interface CitizenFormData {
  national_id: string;
  first_name: string;
  gender: "male" | "female" | "";
  status: "alive" | "dead";
}

const GENDER_OPTIONS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

const STATUS_OPTIONS = [
  { value: "alive", label: "حي" },
  { value: "dead", label: "متوفى" },
];

export function AdminCitizensPage() {
  const { t, language } = useLanguage();
  const { hasRole } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasRole("admin");
  const canView = hasRole("admin", "supervisor");

  // States
  // const [citizens, setCitizens] = useState<Citizen[]>([]);
  // const [loading, setLoading] = useState(true);
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
    formState: { isSubmitting, errors },
  } = useForm<CitizenFormData>({
    resolver: yupResolver(citizenSchema),
    defaultValues: {
      national_id: "",
      first_name: "",
      gender: "",
      status: "alive",
    },
  });

  const { loading, data: citizens } = useGet<Citizen[]>("/citizens", {
    immediate: true,
  });

  
  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      national_id: "",
      first_name: "",
      gender: "",
      status: "alive",
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (citizen: Citizen) => {
    setEditing(citizen);
    reset({
      national_id: citizen.national_id,
      first_name: citizen.first_name || "",
      gender: citizen.gender || "",
      status: citizen.status,
    });
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: CitizenFormData) => {
    try {
      if (editing) {
        await adminApi.updateCitizen(editing.id, {
          national_id: data.national_id,
          first_name: data.first_name || undefined,
          gender: data.gender || undefined,
          status: data.status,
        });
        showSuccess(t("success.citizenUpdated"));
      } else {
        await adminApi.createCitizen({
          national_id: data.national_id,
          first_name: data.first_name,
          gender: data.gender || undefined,
          status: data.status,
        });
        showSuccess(t("success.citizenCreated"));
      }
      setIsDialogOpen(false);
      reset();
    } catch (error: any) {
      showError(error.message || t("error.saveCitizen"));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await adminApi.deleteCitizen(deleteConfirm.id);
      showSuccess(t("success.citizenDeleted"));
      loadCitizens();
    } catch (error: any) {
      showError(error.message || t("error.deleteCitizen"));
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const filteredCitizens = citizens?.filter(
    (citizen) =>
      citizen.national_id.includes(search) ||
      (citizen.first_name &&
        citizen.first_name.toLowerCase().includes(search.toLowerCase()))
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
        {canManage && (
          <span className="flex justify-center items-center gap-3">
          <Button
            variant="contained"
            startIcon={
              <Import className={`${language == "ar" ? "ml-2" : ""} `} size={20} />
            }
            onClick={openCreateDialog}
          >
            {t("admin.citizens.create")}
          </Button><Button
            variant="contained"
            startIcon={
              <Plus className={`${language == "ar" ? "ml-2" : ""}`} size={20} />
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
                          startIcon={<Edit2 size={16} />}
                          onClick={() => openEditDialog(citizen)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Trash2 size={16} />}
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
              label={t("admin.citizens.nationalId")}
            />
            <FormTextField
              control={control}
              name="first_name"
              label={t("admin.citizens.fullName")}
            />
            <FormSelectField
              control={control}
              name="gender"
              label={t("admin.citizens.gender")}
              options={GENDER_OPTIONS}
            />
            <FormSelectField
              control={control}
              name="status"
              label={t("admin.citizens.status")}
              options={STATUS_OPTIONS}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting}
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
        message={t("admin.deleteConfirmMessage")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminCitizensPage;
