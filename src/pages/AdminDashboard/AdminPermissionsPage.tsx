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
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Permission } from "../../types/entities";
import { permissionSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";

interface PermissionFormData {
  key: string;
  description?: string;
}

// Permission name translations
export const permissionNameTranslations: Record<string, { en: string; ar: string }> = {
  "user.create": { en: "Create User", ar: "إنشاء مستخدم" },
  "user.view": { en: "Read User", ar: "عرض مستخدم" },
  "user.update": { en: "Update User", ar: "تحديث مستخدم" },
  "user.delete": { en: "Delete User", ar: "حذف مستخدم" },
  "user.export": { en: "Export Users", ar: "تصدير المستخدمين" },
  "citizen.create": { en: "Create Citizen", ar: "إنشاء مواطن" },
  "citizen.view": { en: "Read Citizen", ar: "عرض مواطن" },
  "citizen.update": { en: "Update Citizen", ar: "تحديث مواطن" },
  "citizen.delete": { en: "Delete Citizen", ar: "حذف مواطن" },
  "citizen.export": { en: "Export Citizens", ar: "تصدير المواطنين" },
  "application.create": { en: "Create Application", ar: "إنشاء طلب" },
  "application.view": { en: "Read Application", ar: "عرض طلب" },
  "application.update": { en: "Update Application", ar: "تحديث طلب" },
  "application.delete": { en: "Delete Application", ar: "حذف طلب" },
  "application.export": { en: "Export Applications", ar: "تصدير الطلبات" },
  "location.create": { en: "Create Location", ar: "إنشاء موقع" },
  "location.view": { en: "Read Location", ar: "عرض موقع" },
  "location.update": { en: "Update Location", ar: "تحديث موقع" },
  "location.delete": { en: "Delete Location", ar: "حذف موقع" },
  "location.export": { en: "Export Locations", ar: "تصدير المواقع" },
  "bank.create": { en: "Create Bank Account", ar: "إنشاء حساب بنكي" },
  "bank.view": { en: "Read Bank Account", ar: "عرض حساب بنكي" },
  "bank.update": { en: "Update Bank Account", ar: "تحديث حساب بنكي" },
  "bank.delete": { en: "Delete Bank Account", ar: "حذف حساب بنكي" },
  "bank.export": { en: "Export Bank Accounts", ar: "تصدير الحسابات البنكية" },
  "role.create": { en: "Create Role", ar: "إنشاء دور" },
  "role.view": { en: "Read Role", ar: "عرض دور" },
  "role.update": { en: "Update Role", ar: "تحديث دور" },
  "role.delete": { en: "Delete Role", ar: "حذف دور" },
  "permission.create": { en: "Create Permission", ar: "إنشاء صلاحية" },
  "permission.view": { en: "Read Permission", ar: "عرض صلاحية" },
  "permission.update": { en: "Update Permission", ar: "تحديث صلاحية" },
  "permission.delete": { en: "Delete Permission", ar: "حذف صلاحية" },
};


export function AdminPermissionsPage() {
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasPermission(permissions.permission.create);
  const canView = hasPermission(permissions.permission.view);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
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
  } = useForm<PermissionFormData>({
    resolver: yupResolver(permissionSchema) as any,
    defaultValues: {
      key: "",
      description: "",
    },
  });

  const {
    loading,
    data: permissionsData,
    setData,
  } = useGet<Permission[]>(API.admin.permissions.list, {
    immediate: true,
  });
console.log(permissionsData);

  const { loading: loadingDeletePermission, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.permissionDeleted"));
      setData((prev) =>
        prev ? prev.filter((p) => p.id !== deleteConfirm.id) : prev
      );
      setDeleteConfirm({ open: false, id: null });
    },
    onError: (error) => {
      showError(error || t("error.deletePermission"));
    },
  });

  const { loading: loadingCreatePermission, execute: executeCreatePermission } =
    usePost(API.admin.permissions.create, {
      onSuccess: (data) => {
        setData((prev) => (prev ? [data, ...prev] : [data]));
        showSuccess(t("success.permissionCreated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.createPermission"));
      },
    });

  const { loading: loadingUpdatePermission, execute: executeUpdatePermission } =
    usePatch({
      onSuccess: (data) => {
        setData(
          (prev) => prev?.map((p) => (p.id === data.id ? data : p)) || prev
        );
        showSuccess(t("success.permissionUpdated"));
        setIsDialogOpen(false);
        reset();
      },
      onError: (error) => {
        showError(error || t("error.updatePermission"));
      },
    });

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      key: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (permission: Permission) => {
    setEditing(permission);
    reset({
      key: permission.key,
      description: permission.description || "",
    });
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: PermissionFormData) => {
    if (editing) {
      executeUpdatePermission(
        API.admin.permissions.update(editing.id.toString()),
        data
      );
    } else {
      executeCreatePermission(data);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    execute(API.admin.permissions.delete(deleteConfirm.id.toString()));
  };

  const filteredPermissions = permissionsData?.filter(
    (permission) =>
      permission.key.toLowerCase().includes(search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert
          message={t("admin.noPermissionsPermission")}
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
            {t("admin.permissions.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.permissions.subtitle")}
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
              {t("admin.permissions.create")}
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
        ) : filteredPermissions?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noPermissionsFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">
                  {t("admin.permissions.id")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.permissions.key")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.permissions.description")}
                </TableCell>
                {canManage && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPermissions
                ?.sort((a, b) => a.id - b.id)
                ?.map((permission: Permission) => {
                  return (
                    <TableRow
                      key={permission.id}
                      hover
                      sx={{ "&:last-child td": { border: 0 } }}
                    >
                      <TableCell align="center">{permission.id}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {permissionNameTranslations[permission.key]?.[
                            language
                          ] || permission.key}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {permission.key}
                        </Typography>
                      </TableCell>
                    
                      <TableCell align="center">
                        {permission.description || "----"}
                      </TableCell>
                  

                      {canManage && (
                        <TableCell align="center">
                          <Box>
                            <Button
                              size="small"
                              startIcon={
                                <Edit2
                                  className={`${
                                    language == "ar" ? "ml-2" : ""
                                  }`}
                                  size={16}
                                />
                              }
                              onClick={() => openEditDialog(permission)}
                            >
                              {t("common.edit")}
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={
                                <Trash2
                                  className={`${
                                    language == "ar" ? "ml-2" : ""
                                  }`}
                                  size={16}
                                />
                              }
                              onClick={() =>
                                setDeleteConfirm({
                                  open: true,
                                  id: permission.id,
                                })
                              }
                            >
                              {t("common.delete")}
                            </Button>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
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
            ? t("admin.permissions.update")
            : t("admin.permissions.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <FormTextField
              control={control}
              name="name"
              label={t("admin.permissions.key")}
              placeholder="e.g., user:create, citizen:read"
            />
            <FormTextField
              control={control}
              name="description"
              label={t("admin.permissions.description")}
              multiline
              rows={3}
              placeholder={t("admin.permissions.descriptionPlaceholder")}
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
              loadingCreatePermission ||
              loadingUpdatePermission
            }
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.permissions.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.permissions.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeletePermission}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </Container>
  );
}

export default AdminPermissionsPage;