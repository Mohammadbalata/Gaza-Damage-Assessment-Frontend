import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Chip,
  Typography,
  Paper,
  InputAdornment,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import  adminUserSchema
import { adminService } from "../../services/admin.service";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../hooks/useNotification";
import {
  FormTextField,
  FormSelectField,
  LoadingSpinner,
  ErrorAlert,
  ConfirmDialog,
} from "../../components/common";
import { formatDateTime, formatStatus } from "../../utils/formatters";
import { AdminUser } from "../../types/api.types";

/**
 * Admin Users Management Page
 * صفحة إدارة المستخدمين
 */
const UsersPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /**
   * Fetch users list
   */
  const {
    data: users,
    loading,
    error,
    execute: fetchUsers,
  } = useApi(() => adminService.listUsers({ search: search || undefined }), {
    immediate: true,
  });

  /**
   * Filter and paginate users
   */
  const paginatedUsers = useMemo(() => {
    if (!users) return [];
    return users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [users, page, rowsPerPage]);

  /**
   * Form setup with React Hook Form
   */
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(adminUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "supervisor",
    },
  });

  /**
   * Handle create/update user
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (selectedUser) {
        await adminService.updateUser(selectedUser.id, {
          ...data,
          password: data.password || undefined,
        });
        showSuccess("تم تحديث المستخدم بنجاح");
      } else {
        await adminService.createUser(data);
        showSuccess("تم إنشاء المستخدم بنجاح");
      }
      setOpenDialog(false);
      reset();
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      showError("فشلت عملية الحفظ");
    }
  });

  /**
   * Handle delete user
   */
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await adminService.deleteUser(selectedUser.id);
      showSuccess("تم حذف المستخدم بنجاح");
      setOpenDelete(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      showError("فشل حذف المستخدم");
    }
  };

  /**
   * Open create dialog
   */
  const handleOpenCreateDialog = () => {
    setSelectedUser(null);
    reset({
      name: "",
      email: "",
      password: "",
      role: "supervisor",
    });
    setOpenDialog(true);
  };

  /**
   * Open edit dialog
   */
  const handleOpenEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    reset({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setOpenDialog(true);
  };

  /**
   * Handle pagination change
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handle rows per page change
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && !users) {
    return <LoadingSpinner message="جاري تحميل المستخدمين..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              إدارة المستخدمين
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إدارة حسابات المسؤولين والمشرفين في النظام
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ whiteSpace: "nowrap" }}
          >
            إضافة مستخدم جديد
          </Button>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <ErrorAlert error={error} />
        </Box>
      )}

      {/* Search Card */}
      <Paper elevation={0} sx={{ mb: 3, p: 2, border: "1px solid #f0f0f0" }}>
        <TextField
          fullWidth
          placeholder="ابحث عن المستخدم بالاسم أو البريد الإلكتروني..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Paper>

      {/* Users Table */}
      <TableContainer component={Card} sx={{ mb: 2 }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 3,
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.light", fontWeight: 600 }}>
                  <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    البريد الإلكتروني
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>تاريخ الإنشاء</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    الإجراءات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(user.role)}
                          color={user.role === "admin" ? "primary" : "default"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenEditDialog(user)}
                            sx={{ textTransform: "none", fontSize: "0.875rem" }}
                          >
                            تعديل
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDelete(true);
                            }}
                            sx={{ textTransform: "none", fontSize: "0.875rem" }}
                          >
                            حذف
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        لا توجد مستخدمون
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {users && users.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="عدد الصفوف:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
                }
              />
            )}
          </>
        )}
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {selectedUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <FormTextField
              control={control}
              name="name"
              label="الاسم"
              required
            />
            <FormTextField
              control={control}
              name="email"
              label="البريد الإلكتروني"
              type="email"
              required
            />
            <FormSelectField
              control={control}
              name="role"
              label="الدور"
              required
              options={[
                { value: "admin", label: "مسؤول النظام" },
                { value: "supervisor", label: "مشرف" },
              ]}
            />
            <FormTextField
              control={control}
              name="password"
              label={
                selectedUser
                  ? "كلمة المرور (اتركها فارغة لعدم التغيير)"
                  : "كلمة المرور"
              }
              type="password"
              required={!selectedUser}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري..." : selectedUser ? "تحديث" : "إنشاء"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من رغبتك في حذف المستخدم "${selectedUser?.name}"؟ لا يمكن التراجع عن هذه العملية.`}
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={handleDelete}
        onCancel={() => {
          setOpenDelete(false);
          setSelectedUser(null);
        }}
        isDangerous
        isLoading={loading}
      />
    </Container>
  );
};

export default UsersPage;

// import { useEffect, useState } from "react";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { adminApi, AdminUser, UserRole } from "../../services/api";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { Plus, X, Trash2 } from "lucide-react";

// const emptyForm = {
//   name: "",
//   email: "",
//   password: "",
//   role: "supervisor" as UserRole,
// };

// const AdminUsersPage = () => {
//   const { t } = useLanguage();
//   const { hasRole } = useAuth();
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<AdminUser | null>(null);
//   const [form, setForm] = useState(emptyForm);
//   const [search, setSearch] = useState("");

//   const canManage = hasRole("admin");
//   const canView = hasRole("admin");

//   const loadUsers = async () => {
//     if (!canView) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await adminApi.listUsers({ page: 1, pageSize: 100 });
//       setUsers(res);
//     } catch (e) {
//       console.error(e);
//       setError(t("error.loadUsers"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, [canView, t]);

//   const openCreateDialog = () => {
//     setEditing(null);
//     setForm(emptyForm);
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (user: AdminUser) => {
//     setEditing(user);
//     setForm({
//       name: user.name,
//       email: user.email,
//       password: "",
//       role: user.role,
//     });
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!canManage) return;
//     setLoading(true);
//     setError(null);
//     try {
//       if (editing) {
//         await adminApi.updateUser(editing.id, {
//           name: form.name,
//           email: form.email,
//           role: form.role,
//           password: form.password || undefined,
//         });
//       } else {
//         await adminApi.createUser({
//           name: form.name,
//           email: form.email,
//           role: form.role,
//           password: form.password,
//         });
//       }
//       setIsDialogOpen(false);
//       setForm(emptyForm);
//       setEditing(null);
//       loadUsers();
//     } catch (e) {
//       console.error(e);
//       setError(t("error.saveUser"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!canManage) return;
//     if (
//       !window.confirm(
//         t("admin.users.deleteConfirm") ||
//           "Are you sure you want to delete this user?"
//       )
//     )
//       return;
//     setLoading(true);
//     setError(null);
//     try {
//       await adminApi.deleteUser(id);
//       loadUsers();
//     } catch (e) {
//       console.error(e);
//       setError(t("error.deleteUser"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter users by name or email
//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(search.toLowerCase()) ||
//       user.email.toLowerCase().includes(search.toLowerCase())
//   );

//   if (!canView) {
//     return (
//       <div className="space-y-4">
//         <h1 className="text-3xl font-bold">{t("admin.users.title")}</h1>
//         <p className="text-sm text-gray-500">{t("admin.noUsersPermission")}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">{t("admin.users.title")}</h1>
//           <p className="text-sm text-gray-500">{t("admin.users.subtitle")}</p>
//         </div>
//         <input
//           className="input-field w-[500px]"
//           placeholder={t("common.searchPlaceholder")}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         {canManage && (
//           <button
//             type="button"
//             className="btn-primary flex items-center gap-2"
//             onClick={openCreateDialog}
//           >
//             <Plus className="w-4 h-4" />
//             {t("admin.users.create")}
//           </button>
//         )}
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       <div className="card overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-200">
//               <th className="text-center py-3 px-2 font-semibold">
//                 {t("admin.users.name")}
//               </th>
//               <th className="text-center py-3 px-2 font-semibold">
//                 {t("admin.users.email")}
//               </th>
//               <th className="text-center py-3 px-2 font-semibold">
//                 {t("admin.users.role")}
//               </th>
//               <th className="text-center py-3 px-2 font-semibold">
//                 {t("common.created") || "Created"}
//               </th>
//               {canManage && (
//                 <th className="text-center py-3 px-2 font-semibold">
//                   {t("admin.actions")}
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers
//               .sort((a, b) => a.id - b.id)
//               .map((user) => (
//                 <tr key={user.id} className="border-b border-gray-100">
//                   <td className="text-center py-3 px-2 font-medium">
//                     {user.name}
//                   </td>
//                   <td className="text-center py-3 px-2 text-gray-600">
//                     {user.email}
//                   </td>
//                   <td className="text-center py-3 px-2 capitalize">
//                     {user.role}
//                   </td>
//                   <td className="text-center py-3 px-2 text-gray-500">
//                     {new Date(user.createdAt).toDateString()}
//                   </td>
//                   {canManage && (
//                     <td className="flex justify-center py-3 px-2">
//                       <div className="flex gap-2">
//                         <button
//                           type="button"
//                           className="text-blue-600 hover:text-blue-800 text-xs font-medium"
//                           onClick={() => openEditDialog(user)}
//                         >
//                           {t("common.edit")}
//                         </button>
//                         <button
//                           type="button"
//                           className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
//                           onClick={() => handleDelete(user.id)}
//                         >
//                           <Trash2 className="w-3 h-3" />
//                           {t("common.delete")}
//                         </button>
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             {!filteredUsers.length && !loading && (
//               <tr>
//                 <td colSpan={5} className="py-6 text-center text-gray-500">
//                   {t("admin.noUsersFound")}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {isDialogOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setIsDialogOpen(false)}
//         >
//           <div
//             className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h2 className="text-xl font-semibold">
//                 {editing ? t("admin.users.update") : t("admin.users.create")}
//               </h2>
//               <button
//                 type="button"
//                 className="text-gray-600 hover:text-gray-800"
//                 onClick={() => setIsDialogOpen(false)}
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <form className="p-6 space-y-4" onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t("admin.users.name")}
//                   </label>
//                   <input
//                     type="text"
//                     className="input-field"
//                     value={form.name}
//                     onChange={(e) =>
//                       setForm((prev) => ({ ...prev, name: e.target.value }))
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t("admin.users.email")}
//                   </label>
//                   <input
//                     type="email"
//                     className="input-field"
//                     value={form.email}
//                     onChange={(e) =>
//                       setForm((prev) => ({ ...prev, email: e.target.value }))
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t("admin.users.role")}
//                   </label>
//                   <select
//                     className="input-field"
//                     value={form.role}
//                     onChange={(e) =>
//                       setForm((prev) => ({
//                         ...prev,
//                         role: e.target.value as UserRole,
//                       }))
//                     }
//                   >
//                     <option value="supervisor">{t("common.supervisor")}</option>
//                     <option value="admin">{t("common.admin")}</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {editing
//                       ? t("admin.users.passwordOptional")
//                       : t("admin.users.password")}
//                   </label>
//                   <input
//                     type="password"
//                     className="input-field"
//                     value={form.password}
//                     onChange={(e) =>
//                       setForm((prev) => ({ ...prev, password: e.target.value }))
//                     }
//                     required={!editing}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   className="btn-outline"
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   {t("common.cancel")}
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn-primary"
//                   disabled={loading}
//                 >
//                   {editing ? t("admin.users.update") : t("common.submit")}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsersPage;
