// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   Box,
//   Container,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   CircularProgress,
//   Stack,
//   MenuItem,
//   Chip,
//   Paper,
//   Collapse,
// } from "@mui/material";
// import { Plus, Trash2, Edit2, Search, X, Filter } from "lucide-react";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { applicationSchema } from "../../services/validation";
// import FormTextField from "../../components/Shared/FormTextField";
// import ErrorAlert from "../../components/Shared/ErrorAlert";
// import ConfirmDialog from "../../components/Shared/ConfirmDialog";
// import { useNotification } from "../../hooks/useNotifications";
// import { useDelete, usePatch, usePost } from "../../hooks/api/useApi";
// import { Application, ApplicationStatus, Citizen } from "../../types/entities";
// import { API } from "../../constants/ApiRoutes";
// import { permissions } from "../../constants/permissions";
// import { api } from "../../services/api";
// import PaginatedTable from "../../components/admin/PaginationTable";
// import DebounceSearchField from "../../components/admin/DebounceSearchField";

// interface ApplicationFormData {
//   citizenId: number;
//   status: ApplicationStatus;
//   notes: string;
// }

// const applicationTypesColors: Record<string, object> = {
//   PENDING: {
//     bgcolor: "rgba(255, 193, 7, 0.15)",
//     color: "#FFC107",
//     fontWeight: 600,
//   },
//   VERIFIED: {
//     bgcolor: "rgba(33, 150, 243, 0.15)",
//     color: "#2196F3",
//     fontWeight: 600,
//   },
//   APPROVED: {
//     bgcolor: "rgba(76, 175, 80, 0.15)",
//     color: "#4CAF50",
//     fontWeight: 600,
//   },
//   REJECTED: {
//     bgcolor: "rgba(244, 67, 54, 0.15)",
//     color: "#F44354",
//     fontWeight: 600,
//   },
//   CLOSED: {
//     bgcolor: "rgba(158, 158, 158, 0.15)",
//     color: "#9E9E9E",
//     fontWeight: 600,
//   },
// };

// export function AdminApplicationsPage() {
//   const { t, language } = useLanguage();
//   const { hasPermission } = useAuth();
//   const { showSuccess, showError } = useNotification();

//   const canManage = hasPermission(permissions.application.create);
//   const canView = hasPermission(permissions.application.view);
//   const canEditApplication = hasPermission(permissions.application.update);
//   const [selectedValue, setSelectedValue] = useState<any>(null);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<Application | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<{
//     open: boolean;
//     id: number | null;
//   }>({ open: false, id: null });

//   const [page, setPage] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [data, setData] = useState<any>([]);
//   const [meta, setMeta] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // Search filters
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchFilters, setSearchFilters] = useState<any>({
//     applicationId: "",
//     fullName: "",
//     nationalId: "",
//     phone: "",
//     status: "",
//   });
//   const [activeFilters, setActiveFilters] = useState<any>({
//     applicationId: "",
//     fullName: "",
//     nationalId: "",
//     phone: "",
//     status: "",
//   });

//   // Citizen search
//   const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

//   // Form
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<ApplicationFormData>({
//     resolver: yupResolver(applicationSchema) as any,
//     defaultValues: {
//       citizenId: 0,
//       status: ApplicationStatus.PENDING,
//       notes: "",
//     },
//   });

//   useEffect(() => {
//     fetchData(page, limit, activeFilters);
//   }, [page, limit, activeFilters]);

//   const fetchData = async (page: number, limit: number, filters: any) => {
//     setLoading(true);
//     try {
//       const params: any = {
//         page: page + 1,
//         limit,
//       };

//       // Add filters to params if they have values
//       if (filters.applicationId) {
//         params.applicationId = filters.applicationId;
//       }
//       if (filters.fullName) {
//         params.fullName = filters.fullName;
//       }
//       if (filters.nationalId) {
//         params.nationalId = filters.nationalId;
//       }
//       if (filters.phone) {
//         params.phone = filters.phone;
//       }
//       if (filters.status) {
//         params.status = filters.status;
//       }

//       const res = await api.get(API.admin.applications.list, { params });
//       setData(res.data.data.data);
//       setMeta(res.data.data.meta);
//     } catch (err) {
//       showError(t("error.fetchApplications"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPage(0);
//   };

//   const handleSearch = () => {
//     setActiveFilters({ ...searchFilters });
//     setPage(0);
//   };

//   const handleClearFilters = () => {
//     const emptyFilters = {
//       applicationId: "",
//       fullName: "",
//       nationalId: "",
//       phone: "",
//       status: "",
//     };
//     setSearchFilters(emptyFilters);
//     setActiveFilters(emptyFilters);
//     setPage(0);
//   };

//   const hasActiveFilters = Object.values(activeFilters).some(
//     (value) => value !== ""
//   );

//   const columns = [
//     {
//       id: "id",
//       label: t("admin.applications.id"),
//       align: "center" as const,
//       format: (value: number) => value,
//     },
//     {
//       id: "citizen",
//       label: t("admin.applications.citizen"),
//       align: "center" as const,
//       format: (_: any, row: Application) => row.citizen?.full_name || "----",
//     },
//     {
//       id: "status",
//       label: t("admin.applications.status"),
//       align: "center" as const,
//       format: (value: ApplicationStatus) => (
//         <Chip
//           label={value.replace("_", " ").toLowerCase()}
//           sx={{
//             ...applicationTypesColors[value],
//             textTransform: "capitalize",
//             borderRadius: "6px",
//             px: 1.5,
//             py: 0.5,
//             fontSize: "0.8rem",
//           }}
//         />
//       ),
//     },
//     {
//       id: "updatedAt",
//       label: t("admin.applications.updated"),
//       align: "center" as const,
//       format: (value: string) => new Date(value).toLocaleString(),
//     },
//     ...(canManage || canEditApplication
//       ? [
//           {
//             id: "actions",
//             label: t("admin.actions"),
//             align: "center" as const,
//             format: (_: any, row: Application) => (
//               <Box>
//                 {canEditApplication && (
//                   <Button
//                     size="small"
//                     startIcon={
//                       <Edit2
//                         className={`${language == "ar" ? "ml-2" : ""}`}
//                         size={16}
//                       />
//                     }
//                     onClick={() => openEditDialog(row)}
//                   >
//                     {t("common.edit")}
//                   </Button>
//                 )}
//                 {canManage && (
//                   <Button
//                     size="small"
//                     color="error"
//                     startIcon={
//                       <Trash2
//                         className={`${language == "ar" ? "ml-2" : ""}`}
//                         size={16}
//                       />
//                     }
//                     onClick={() => setDeleteConfirm({ open: true, id: row.id })}
//                   >
//                     {t("common.delete")}
//                   </Button>
//                 )}
//               </Box>
//             ),
//           },
//         ]
//       : []),
//   ];

//   const { loading: loadingDeleteApplication, execute } = useDelete({
//     onSuccess: () => {
//       showSuccess(t("success.applicationDeleted"));
//       setData((prev: Application[]) =>
//         prev ? prev.filter((a: Application) => a.id !== deleteConfirm.id) : prev
//       );
//       setDeleteConfirm({ open: false, id: null });
//     },
//     onError: (error) => {
//       showError(error || t("error.deleteApplication"));
//     },
//   });

//   const {
//     loading: loadingCreateApplication,
//     execute: executeCreateApplication,
//   } = usePost(API.admin.applications.create, {
//     onSuccess: (data) => {
//       setData((prev: Application[]) => (prev ? [data, ...prev] : [data]));
//       showSuccess(t("success.applicationCreated"));
//       setIsDialogOpen(false);
//       reset();
//       setSelectedCitizen(null);
//     },
//     onError: (error) => {
//       showError(error || t("error.createApplication"));
//     },
//   });

//   const {
//     loading: loadingUpdateApplication,
//     execute: executeUpdateApplication,
//   } = usePatch({
//     onSuccess: (data) => {
//       setData(
//         (prev: Application[]) =>
//           prev?.map((a: Application) => (a.id === data.id ? data : a)) || prev
//       );
//       showSuccess(t("success.applicationUpdated"));
//       setIsDialogOpen(false);
//       reset();
//       setSelectedCitizen(null);
//     },
//     onError: (error) => {
//       showError(error || t("error.updateApplication"));
//     },
//   });

//   const openCreateDialog = () => {
//     setEditing(null);
//     reset({
//       citizenId: 0,
//       status: ApplicationStatus.PENDING,
//       notes: "",
//     });
//     setSelectedCitizen(null);
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (application: Application) => {
//     setEditing(application);

//     reset({
//       citizenId: application.citizenId,
//       status: application.status,
//       notes: application.notes || "",
//     });
//     setSelectedCitizen(application.citizen || null);
//     setIsDialogOpen(true);
//   };

//   const onSubmit = async (data: ApplicationFormData) => {
//     if (editing) {
//       executeUpdateApplication(
//         API.admin.applications.update(editing.id.toString()),
//         { ...data }
//       );
//     } else {
//       executeCreateApplication({ ...data, citizenId: selectedValue });
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteConfirm.id) return;
//     execute(API.admin.applications.delete(deleteConfirm.id.toString()));
//   };

//   if (!canView) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <ErrorAlert
//           message={t("admin.noApplicationsPermission")}
//           severity="warning"
//         />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 4,
//         }}
//       >
//         <Box>
//           <Typography variant="h4" component="h1" fontWeight="bold">
//             {t("admin.applications.title")}
//           </Typography>
//           <Typography color="textSecondary" sx={{ mt: 1 }}>
//             {t("admin.applications.subtitle")}
//           </Typography>
//         </Box>
//         {hasPermission(permissions.application.export) && (
//           <Button
//             variant="contained"
//             startIcon={
//               <Plus className={`${language == "ar" ? "ml-2" : ""}`} size={20} />
//             }
//             onClick={openCreateDialog}
//           >
//             {t("admin.applications.create")}
//           </Button>
//         )}
//       </Box>

//       {/* Search/Filter Section */}
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: showFilters ? 2 : 0,
//           }}
//         >
//           <Button
//             startIcon={
//               <Filter size={18} className={language == "ar" ? "ml-2" : ""} />
//             }
//             onClick={() => setShowFilters(!showFilters)}
//             variant={showFilters ? "contained" : "outlined"}
//           >
//             {t("common.filters") || "Filters"}
//             {hasActiveFilters && (
//               <Chip
//                 label={
//                   Object.values(activeFilters).filter((v) => v !== "").length
//                 }
//                 size="small"
//                 sx={{ ml: 1, height: 20 }}
//               />
//             )}
//           </Button>
//           {hasActiveFilters && (
//             <Button
//               size="small"
//               startIcon={<X size={16} />}
//               onClick={handleClearFilters}
//               color="error"
//             >
//               {t("common.clearFilters") || "Clear Filters"}
//             </Button>
//           )}
//         </Box>

//         <Collapse in={showFilters}>
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 2,
//               mt: 2,
//             }}
//           >
//             <TextField
//               label={t("admin.applications.id")}
//               value={searchFilters.applicationId}
//               onChange={(e) => {
//                 setSearchFilters({
//                   ...searchFilters,
//                   applicationId: e.target.value,
//                 });

//                 console.log(e.target.value);
//               }}
//               size="small"
//               type="text"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             />

//             <TextField
//               label={t("admin.citizens.fullName")}
//               value={searchFilters.fullName}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   fullName: e.target.value,
//                 })
//               }
//               size="small"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             />

//             <TextField
//               label={t("admin.citizens.nationalId")}
//               value={searchFilters.nationalId}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   nationalId: e.target.value,
//                 })
//               }
//               size="small"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             />

//             <TextField
//               label={t("admin.citizens.phoneNumber")}
//               value={searchFilters.phone}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   phone: e.target.value,
//                 })
//               }
//               size="small"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             />

//             <TextField
//               select
//               label={t("admin.applications.status")}
//               value={searchFilters.status}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   status: e.target.value as ApplicationStatus | "",
//                 })
//               }
//               size="small"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             >
//               <MenuItem value={ApplicationStatus.PENDING}>
//                 {t("status.submitted")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.VERIFIED}>
//                 {t("status.verified")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.APPROVED}>
//                 {t("status.approved")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.REJECTED}>
//                 {t("status.rejected")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.CLOSED}>
//                 {t("status.closed")}
//               </MenuItem>
//             </TextField>

//             <Button
//               variant="contained"
//               startIcon={<Search size={18} />}
//               onClick={handleSearch}
//               sx={{ minWidth: 180, flex: "1 1 180px" }}
//             >
//               {t("common.search")}
//             </Button>
//           </Box>
//         </Collapse>
//       </Paper>

//       <PaginatedTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         meta={meta}
//         onPageChange={handlePageChange}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         emptyMessage={t("admin.noApplicationsFound")}
//       />

//       {/* Create/Edit Dialog */}
//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           {editing
//             ? t("admin.applications.update")
//             : t("admin.applications.create")}
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={3}>
//             {editing ? (
//               <TextField
//                 label={t("admin.applications.citizen")}
//                 value={`${selectedCitizen?.full_name} (${selectedCitizen?.national_id})`}
//                 disabled
//                 fullWidth
//               />
//             ) : (
//               <DebounceSearchField
//                 control={control}
//                 label={t("admin.citizens.fullName")}
//                 placeholder={t("common.search")}
//                 onSelect={(id) => setSelectedValue(id)}
//               />
//             )}

//             <FormTextField
//               control={control}
//               name="status"
//               label={t("admin.applications.status")}
//               select
//             >
//               <MenuItem value={ApplicationStatus.PENDING}>
//                 {t("status.submitted")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.VERIFIED}>
//                 {t("status.verified")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.APPROVED}>
//                 {t("status.approved")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.REJECTED}>
//                 {t("status.rejected")}
//               </MenuItem>
//               <MenuItem value={ApplicationStatus.CLOSED}>
//                 {t("status.closed") || "Closed"}
//               </MenuItem>
//             </FormTextField>

//             <FormTextField
//               control={control}
//               name="notes"
//               label={t("admin.applications.notes")}
//               multiline
//               rows={4}
//               placeholder={t("admin.applications.notesPlaceholder")}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsDialogOpen(false)}>
//             {t("common.cancel")}
//           </Button>
//           <Button
//             onClick={handleSubmit(onSubmit as any)}
//             variant="contained"
//             disabled={
//               isSubmitting ||
//               loadingCreateApplication ||
//               loadingUpdateApplication
//             }
//           >
//             {isSubmitting ? (
//               <CircularProgress size={20} />
//             ) : editing ? (
//               t("admin.applications.update")
//             ) : (
//               t("common.submit")
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirm Dialog */}
//       <ConfirmDialog
//         open={deleteConfirm.open}
//         title={t("admin.applications.deleteConfirm")}
//         message={""}
//         confirmText={t("common.delete")}
//         cancelText={t("common.cancel")}
//         isLoading={loadingDeleteApplication}
//         isDangerous
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteConfirm({ open: false, id: null })}
//       />
//     </Container>
//   );
// }

// export default AdminApplicationsPage;
