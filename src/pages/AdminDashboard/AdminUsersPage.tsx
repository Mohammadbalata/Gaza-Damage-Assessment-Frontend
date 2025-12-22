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
} from "@mui/material";
import { Plus, Trash2, Edit2, Search, Import } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import {  AdminUser, UserRole } from "../../types/entities";
import { userSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export function AdminUsersPage() {
  const { t, language } = useLanguage();
  const { user: authUser, hasRole } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const canManage = hasRole(UserRole.ADMIN);
  const canView = hasRole(UserRole.ADMIN);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
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
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.SUPERVISOR,
    },
  });

  const {
    loading,
    data: users,
    setData,
  } = useGet<AdminUser[]>("/users", {
    immediate: true,
  });

  const { loading: loadingDeleteUser, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.userDeleted"));
      setData((prev) =>
        prev ? prev.filter((u) => u.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteUser"));
    },
  });

  const { loading: loadingCreateUser, execute: executeCreateUser } = usePost(
    "/users",
    {
      onSuccess: (data) => {
        setData((prev) => (prev ? [data, ...prev] : [data]));
        showSuccess(t("success.userCreated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.createUser"));
      },
    }
  );

  const { loading: loadingUpdateUser, execute: executeUpdateUser } = usePatch({
    onSuccess: (data) => {
      setData(
        (prev) => prev?.map((u) => (u.id === data.id ? data : u)) || prev
      );
      showSuccess(t("success.userUpdated"));
      setIsDialogOpen(false);
      reset();
    },
    onError: (error) => {
      showError(error || t("error.updateUser"));
    },
  });

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      name: "",
      email: "",
      password: "",
      role: UserRole.SUPERVISOR,
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (user: AdminUser) => {
    setEditing(user);
    reset({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: UserFormData) => {
    const payload = {
      name: data.name,
      email: data.email,
      role: data.role,
      ...(data.password && { password: data.password }),
    };

    if (editing) {
      executeUpdateUser(`/users/${editing.id}`, payload);
    } else {
      executeCreateUser(payload);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(`/users/${deleteConfirm.id}`);
  };

  const handleExportData = () => {
    fetch(`https://backend-5549.onrender.com/api/users/export-users`, {
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
        a.download = "users.xlsx";
        a.click();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to download Excel file");
      });
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert message={t("admin.noUsersPermission")} severity="warning" />
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
            {t("admin.users.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.users.subtitle")}
          </Typography>
        </Box>
        {canManage && (
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
              {t("admin.users.export")}
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
              {t("admin.users.create")}
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
        ) : filteredUsers?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noUsersFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">{t("admin.users.id")}</TableCell>
                <TableCell align="center">{t("admin.users.name")}</TableCell>
                <TableCell align="center">{t("admin.users.email")}</TableCell>
                <TableCell align="center">{t("admin.users.role")}</TableCell>
                <TableCell align="center">
                  {t("common.created") || "Created"}
                </TableCell>
                {canManage && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{authUser?.id}</TableCell>
                <TableCell align="center">{authUser?.name}</TableCell>
                <TableCell align="center">{authUser?.email}</TableCell>
                <TableCell align="center">{authUser?.role}</TableCell>
                <TableCell align="center">
                  {new Date(authUser?.createdAt || "").toDateString()}
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
              {filteredUsers
                ?.sort((a, b) => a.id - b.id)
                ?.map((user: AdminUser) => (
                  <>
                  {authUser?.id !== user.id && 
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell align="center">{user.id}</TableCell>
                    <TableCell align="center">{user.name}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(user.createdAt).toDateString()}
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
                            onClick={() => openEditDialog(user)}
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
                              setDeleteConfirm({ open: true, id: user.id })
                            }
                          >
                            {t("common.delete")}
                          </Button>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                  }
                  </>
                  
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
          {editing ? t("admin.users.update") : t("admin.users.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <FormTextField
              control={control}
              name="name"
              label={t("admin.users.name")}
            />
            <FormTextField
              control={control}
              name="email"
              label={t("admin.users.email")}
              type="email"
            />
            <FormTextField
              control={control}
              name="role"
              label={t("admin.users.role")}
              select
            >
              <MenuItem value="supervisor">{t("common.supervisor")}</MenuItem>
              <MenuItem value="admin">{t("common.admin")}</MenuItem>
            </FormTextField>
            <FormTextField
              control={control}
              name="password"
              label={
                editing
                  ? t("admin.users.passwordOptional")
                  : t("admin.users.password")
              }
              type="password"
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
            disabled={isSubmitting || loadingCreateUser || loadingUpdateUser}
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.users.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.users.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeleteUser}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminUsersPage;
