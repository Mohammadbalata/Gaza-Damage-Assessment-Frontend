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
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import { Plus, Trash2, Edit2, Search, Shield } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Role, Permission } from "../../types/entities";
import { roleSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { API } from "../../constants/ApiRoutes";
import { permissions as permissionsConstants } from "../../constants/permissions";
import { permissionNameTranslations } from "./AdminPermissionsPage";

interface RoleFormData {
  name: string;
  description?: string;
}

// Helper function to group permissions by category
const groupPermissionsByCategory = (permissions: Permission[]) => {
  const grouped: Record<string, Permission[]> = {};
  permissions.forEach((permission) => {
    const category = permission.key.split(":")[0] || "other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(permission);
  });
  return grouped;
};

// Category translations
const categoryTranslations: Record<string, { en: string; ar: string }> = {
  user: { en: "User Management", ar: "إدارة المستخدمين" },
  citizen: { en: "Citizen Management", ar: "إدارة المواطنين" },
  application: { en: "Application Management", ar: "إدارة الطلبات" },
  location: { en: "Location Management", ar: "إدارة المواقع" },
  bank: { en: "Bank Management", ar: "إدارة البنوك" },
  role: { en: "Role Management", ar: "إدارة الأدوار" },
  permission: { en: "Permission Management", ar: "إدارة الصلاحيات" },
  other: { en: "Other", ar: "أخرى" },
};

export function AdminRolesPage() {
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasPermission(permissionsConstants.role.create);
  const canView = hasPermission(permissionsConstants.role.view);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
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
  } = useForm<RoleFormData>({
    resolver: yupResolver(roleSchema) as any,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    loading,
    data: roles,
    setData,
  } = useGet<Role[]>(API.admin.roles.list, {
    immediate: true,
  });

  const { data: allPermissions } = useGet<Permission[]>(
    API.admin.permissions.list,
    {
      immediate: true,
    }
  );

  const { loading: loadingDeleteRole, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.roleDeleted"));
      setData((prev) =>
        prev ? prev.filter((r) => r.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteRole"));
    },
  });

  const { loading: loadingCreateRole, execute: executeCreateRole } = usePost(
    API.admin.roles.create,
    {
      onSuccess: (data) => {
        setData((prev) => (prev ? [data, ...prev] : [data]));
        showSuccess(t("success.roleCreated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.createRole"));
      },
    }
  );

  const { loading: loadingUpdateRole, execute: executeUpdateRole } = usePatch({
    onSuccess: (data) => {
      setData(
        (prev) => prev?.map((r) => (r.id === data.id ? data : r)) || prev
      );
      showSuccess(t("success.roleUpdated"));
      setIsDialogOpen(false);
      reset();
    },
    onError: (error) => {
      showError(error || t("error.updateRole"));
    },
  });

  const {
    loading: loadingAssignPermissions,
    execute: executeAssignPermissions,
  } = usePost(
    API.admin.roles.assignPermissions(selectedRole?.id.toString() || ""),
    {
      onSuccess: () => {
        showSuccess(t("success.permissionsAssigned"));
        setIsPermissionsDialogOpen(false);
        setSelectedRole(null);
        setSelectedPermissions([]);
      },
      onError: (error) => {
        showError(error || t("error.assignPermissions"));
      },
    }
  );

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      name: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (role: Role) => {
    setEditing(role);
    reset({
      name: role.name,
      description: role.description || "",
    });
    setIsDialogOpen(true);
  };

  // Open permissions dialog
  const openPermissionsDialog = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions?.map((p) => p.permission.id) || []);
    setIsPermissionsDialogOpen(true);
  };

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle submit
  const onSubmit = async (data: RoleFormData) => {
    if (editing) {
      executeUpdateRole(API.admin.roles.update(editing.id.toString()), data);
    } else {
      executeCreateRole(data);
    }
  };

  // Handle assign permissions
  const handleAssignPermissions = () => {
    if (!selectedRole) return;
    executeAssignPermissions({ permissionIds: selectedPermissions });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(API.admin.roles.delete(deleteConfirm.id.toString()));
  };

  const filteredRoles = roles?.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert message={t("admin.noRolesPermission")} severity="warning" />
      </Container>
    );
  }

  const groupedPermissions = allPermissions
    ? groupPermissionsByCategory(allPermissions)
    : {};

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
            {t("admin.roles.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.roles.subtitle")}
          </Typography>
        </Box>
        {canManage && (
          <span className="flex justify-center items-center gap-3">
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
              {t("admin.roles.create")}
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
        ) : filteredRoles?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noRolesFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">{t("admin.roles.id")}</TableCell>
                <TableCell align="center">{t("admin.roles.name")}</TableCell>
                <TableCell align="center">
                  {t("admin.roles.description")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.roles.permissions")}
                </TableCell>
                <TableCell align="center">
                  {t("common.created") || "Created"}
                </TableCell>
                {canManage && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles
                ?.sort((a, b) => a.id - b.id)
                ?.map((role: Role) => (
                  <TableRow
                    key={role.id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell align="center">{role.id}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {role.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {role.description || "----"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${role.permissions?.length || 0} ${t(
                          "admin.roles.permissionsCount"
                        )}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {new Date(role.createdAt).toDateString()}
                    </TableCell>

                    {canManage && (
                      <TableCell align="center">
                        <Box>
                          <Button
                            size="small"
                            startIcon={
                              <Shield
                                className={`${language == "ar" ? "ml-2" : ""}`}
                                size={16}
                              />
                            }
                            onClick={() => openPermissionsDialog(role)}
                          >
                            {t("admin.roles.managePermissions")}
                          </Button>
                          <Button
                            size="small"
                            startIcon={
                              <Edit2
                                className={`${language == "ar" ? "ml-2" : ""}`}
                                size={16}
                              />
                            }
                            onClick={() => openEditDialog(role)}
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
                              setDeleteConfirm({ open: true, id: role.id })
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
          {editing ? t("admin.roles.update") : t("admin.roles.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <FormTextField
              control={control}
              name="name"
              label={t("admin.roles.name")}
            />
            <FormTextField
              control={control}
              name="description"
              label={t("admin.roles.description")}
              multiline
              rows={3}
              placeholder={t("admin.roles.descriptionPlaceholder")}
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
            disabled={isSubmitting || loadingCreateRole || loadingUpdateRole}
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.roles.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog
        open={isPermissionsDialogOpen}
        onClose={() => setIsPermissionsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t("admin.roles.managePermissions")} - {selectedRole?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {Object.entries(groupedPermissions).map(
              ([category, permissions]) => (
                <Box key={category}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {categoryTranslations[category]?.[language] || category}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <FormGroup>
                    {permissions.map((permission) => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handlePermissionToggle(permission.id)
                            }
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {permissionNameTranslations[permission.key]?.[
                                language
                              ] || permission.key}
                            </Typography>
                            {permission.description && (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {permission.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>
                </Box>
              )
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPermissionsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleAssignPermissions}
            variant="contained"
            disabled={loadingAssignPermissions}
          >
            {loadingAssignPermissions ? (
              <CircularProgress size={20} />
            ) : (
              t("common.save")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.roles.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeleteRole}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminRolesPage;
