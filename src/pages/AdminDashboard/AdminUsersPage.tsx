import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Stack,
  MenuItem,
  Paper,
  Grid,
  Collapse,
  Chip,
} from "@mui/material";
import { Plus, Trash2, Edit2, Search, Import, Filter, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { AdminUser, Role } from "../../types/entities";
import { userSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";
import PaginatedTable from "../../components/admin/PaginationTable";
import { api } from "../../services/api";

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  roleId: number;
}

interface SearchFilters {
  fullName: string;
  email: string;
}

export function AdminUsersPage() {
  const { t, language } = useLanguage();
  const { user: authUser, hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasPermission(permissions.user.create);
  const canView = hasPermission(permissions.user.create);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<any>([]);
  const [meta, setMeta] = useState(0);
  const [loading, setLoading] = useState(false);

  // Search filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    fullName: "",
    email: "",
  });
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    fullName: "",
    email: "",
  });

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
      roleId: 0,
    },
  });

  const { data: roles } = useGet<Role[]>(API.admin.roles.list, {
    immediate: true,
  });

  useEffect(() => {
    fetchData(page, limit, activeFilters);
  }, [page, limit, activeFilters]);

  const fetchData = async (
    page: number,
    limit: number,
    filters: SearchFilters
  ) => {
    setLoading(true);
    try {
      const params: any = {
        page: page + 1,
        limit,
      };

      if (filters.fullName) {
        params.fullName = filters.fullName;
      }
      if (filters.email) {
        params.email = filters.email;
      }

      const res = await api.get(API.admin.users.list, { params });
      setData(res.data.data.data);
      setMeta(res.data.data.meta);
    } catch (err) {
      showError(t("error.fetchUsers"));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(0);
  };

  const handleSearch = () => {
    setActiveFilters({ ...searchFilters });
    setPage(0);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      fullName: "",
      email: "",
    };
    setSearchFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setPage(0);
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== ""
  );

  const columns = [
    {
      id: "id",
      label: t("admin.users.id"),
      align: "center" as const,
      format: (value: number) => value,
    },
    {
      id: "name",
      label: t("admin.users.name"),
      align: "center" as const,
      format: (value: string) => value,
    },
    {
      id: "email",
      label: t("admin.users.email"),
      align: "center" as const,
      format: (value: string) => value,
    },
    {
      id: "role",
      label: t("admin.users.role"),
      align: "center" as const,
      format: (_: any, row: AdminUser) => (
        <Box sx={{ textTransform: "capitalize" }}>{row.role.name}</Box>
      ),
    },
    {
      id: "createdAt",
      label: t("common.created") || "Created",
      align: "center" as const,
      format: (value: string) => new Date(value).toDateString(),
    },
    ...(canManage
      ? [
          {
            id: "actions",
            label: t("admin.actions"),
            align: "center" as const,
            format: (_: any, row: AdminUser) =>
              authUser?.id === row.id ? null : (
                <Box>
                  <Button
                    size="small"
                    startIcon={
                      <Edit2
                        className={`${language == "ar" ? "ml-2" : ""}`}
                        size={16}
                      />
                    }
                    onClick={() => openEditDialog(row)}
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
                    onClick={() => setDeleteConfirm({ open: true, id: row.id })}
                  >
                    {t("common.delete")}
                  </Button>
                </Box>
              ),
          },
        ]
      : []),
  ];

  const { loading: loadingDeleteUser, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.userDeleted"));
      setData((prev: AdminUser[]) =>
        prev ? prev.filter((u: AdminUser) => u.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteUser"));
    },
  });

  const { loading: loadingCreateUser, execute: executeCreateUser } = usePost(
    API.admin.users.create,
    {
      onSuccess: (data) => {
        setData((prev: AdminUser[]) => (prev ? [data, ...prev] : [data]));
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
        (prev: AdminUser[]) =>
          prev?.map((u) => (u.id === data.id ? data : u)) || prev
      );
      showSuccess(t("success.userUpdated"));
      setIsDialogOpen(false);
      reset();
    },
    onError: (error) => {
      showError(error || t("error.updateUser"));
    },
  });

  const openCreateDialog = () => {
    setEditing(null);
    reset({
      name: "",
      email: "",
      password: "",
      roleId: 0,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: AdminUser) => {
    setEditing(user);
    reset({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.role.id,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    const payload = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
      ...(data.password && { password: data.password }),
    };

    if (editing) {
      executeUpdateUser(API.admin.users.update(editing.id.toString()), payload);
    } else {
      executeCreateUser(payload);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(API.admin.users.delete(deleteConfirm.id.toString()));
  };

  const handleExportData = () => {
    fetch(`https://backend-5549.onrender.com/api${API.admin.users.export}`, {
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
        {hasPermission(permissions.user.export) && (
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

      {/* Search/Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: showFilters ? 2 : 0,
          }}
        >
          <Button
            startIcon={<Filter size={18} />}
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "contained" : "outlined"}
          >
            {t("common.filters") || "Filters"}
            {hasActiveFilters && (
              <Chip
                label={
                  Object.values(activeFilters).filter((v) => v !== "").length
                }
                size="small"
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<X size={16} />}
              onClick={handleClearFilters}
              color="error"
            >
              {t("common.clearFilters") || "Clear Filters"}
            </Button>
          )}
        </Box>

        <Collapse in={showFilters}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid>
              <TextField
                fullWidth
                label={t("admin.users.name") || "Name"}
                value={searchFilters.fullName}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    fullName: e.target.value,
                  })
                }
                size="small"
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label={t("admin.users.email") || "Email"}
                value={searchFilters.email}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    email: e.target.value,
                  })
                }
                size="small"
              />
            </Grid>
            <Grid>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search size={18} />}
                onClick={handleSearch}
              >
                {t("common.search") || "Search"}
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      <PaginatedTable
        columns={columns}
        data={data}
        loading={loading}
        meta={meta}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        emptyMessage={t("admin.noUsersFound")}
      />

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
              name="roleId"
              label={t("admin.users.role")}
              select
            >
              {roles?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
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
