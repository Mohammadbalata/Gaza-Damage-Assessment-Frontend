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
//   Paper,
//   Grid,
//   Collapse,
//   Chip,
// } from "@mui/material";
// import { Plus, Trash2, Edit2, Search, Import, Filter, X } from "lucide-react";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { Citizen } from "../../types/entities";
// import { citizenSchema } from "../../services/validation";
// import FormTextField from "../../components/Shared/FormTextField";
// import ErrorAlert from "../../components/Shared/ErrorAlert";
// import ConfirmDialog from "../../components/Shared/ConfirmDialog";
// import { useNotification } from "../../hooks/useNotifications";
// import { useDelete, usePatch, usePost } from "../../hooks/api/useApi";
// import { API } from "../../constants/ApiRoutes";
// import { permissions } from "../../constants/permissions";
// import PaginatedTable from "../../components/admin/PaginationTable";
// import { api } from "../../services/api";

// interface CitizenFormData {
//   national_id: string;
//   first_name: string;
//   father_name: string;
//   grandfather_name: string;
//   family_name: string;
//   phone_number: string;
// }

// interface SearchFilters {
//   fullName: string;
//   nationalId: string;
//   phone: string;
// }

// export function AdminCitizensPage() {
//   const { t, language } = useLanguage();
//   const { hasPermission } = useAuth();
//   const { showSuccess, showError } = useNotification();

//   const canManage = hasPermission(permissions.citizen.create);
//   const canView = hasPermission(permissions.citizen.view);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<Citizen | null>(null);
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
//   const [searchFilters, setSearchFilters] = useState<SearchFilters>({
//     fullName: "",
//     nationalId: "",
//     phone: "",
//   });
//   const [activeFilters, setActiveFilters] = useState<SearchFilters>({
//     fullName: "",
//     nationalId: "",
//     phone: "",
//   });

//   // Form
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<CitizenFormData>({
//     resolver: yupResolver(citizenSchema) as any,
//     defaultValues: {
//       national_id: "",
//       first_name: "",
//       father_name: "",
//       grandfather_name: "",
//       family_name: "",
//       phone_number: "",
//     },
//   });

//   useEffect(() => {
//     fetchData(page, limit, activeFilters);
//   }, [page, limit, activeFilters]);

//   const fetchData = async (
//     page: number,
//     limit: number,
//     filters: SearchFilters
//   ) => {
//     setLoading(true);
//     try {
//       const params: any = {
//         page: page + 1,
//         limit,
//       };

//       if (filters.fullName) {
//         params.fullName = filters.fullName;
//       }
//       if (filters.nationalId) {
//         params.nationalId = filters.nationalId;
//       }
//       if (filters.phone) {
//         params.phone = filters.phone;
//       }

//       const res = await api.get(API.admin.citizens.list, { params });
//       setData(res.data.data.data);
//       setMeta(res.data.data.meta);
//     } catch (err) {
//       showError(t("error.fetchCitizens"));
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
//       fullName: "",
//       nationalId: "",
//       phone: "",
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
//       id: "national_id",
//       label: t("admin.citizens.nationalId"),
//       align: "center" as const,
//       format: (value: string) => value,
//     },
//     {
//       id: "full_name",
//       label: t("admin.citizens.fullName"),
//       align: "center" as const,
//       format: (value: string) => value || "----",
//     },
//     {
//       id: "phone_number",
//       label: t("admin.citizens.phoneNumber"),
//       align: "center" as const,
//       format: (value: string) => value,
//     },
//     ...(canManage
//       ? [
//           {
//             id: "actions",
//             label: t("admin.actions"),
//             align: "center" as const,
//             format: (_: any, row: Citizen) => (
//               <Box>
//                 <Button
//                   size="small"
//                   startIcon={
//                     <Edit2
//                       className={`${language == "ar" ? "ml-2" : ""}`}
//                       size={16}
//                     />
//                   }
//                   onClick={() => openEditDialog(row)}
//                 >
//                   {t("common.edit")}
//                 </Button>
//                 <Button
//                   size="small"
//                   color="error"
//                   startIcon={
//                     <Trash2
//                       className={`${language == "ar" ? "ml-2" : ""}`}
//                       size={16}
//                     />
//                   }
//                   onClick={() => setDeleteConfirm({ open: true, id: row.id })}
//                 >
//                   {t("common.delete")}
//                 </Button>
//               </Box>
//             ),
//           },
//         ]
//       : []),
//   ];

//   const { loading: loadingDeleteCitizen, execute } = useDelete({
//     onSuccess: () => {
//       showSuccess(t("success.citizenDeleted"));
//       setData((prev:Citizen[]) =>
//         prev ? prev.filter((c:Citizen) => c.id !== deleteConfirm.id) : prev
//       );
//       setDeleteConfirm({ open: false, id: null });
//     },
//     onError: (error) => {
//       showError(error || t("error.deleteCitizen"));
//     },
//   });

//   const { loading: loadingCreateCitizen, execute: executeCreateCitizen } =
//     usePost(API.admin.citizens.create, {
//       onSuccess: (data) => {
//         setData((prev:Citizen[]) => (prev ? [data, ...prev] : [data]));
//         showSuccess(t("success.citizenCreated"));
//         setIsDialogOpen(false);
//         reset();
//       },
//       onError: (error) => {
//         showError(error || t("error.createCitizen"));
//       },
//     });

//   const { loading: loadingUpdateCitizen, execute: executeUpdateCitizen } =
//     usePatch({
//       onSuccess: (data) => {
//         setData(
//           (prev:Citizen[]) => prev?.map((c) => (c.id === data.id ? data : c)) || prev
//         );
//         showSuccess(t("success.citizenUpdated"));
//         setIsDialogOpen(false);
//         reset();
//       },
//       onError: (error) => {
//         showError(error || t("error.updateCitizen"));
//       },
//     });

//   const openCreateDialog = () => {
//     setEditing(null);
//     reset({
//       national_id: "",
//       first_name: "",
//       father_name: "",
//       grandfather_name: "",
//       family_name: "",
//       phone_number: "",
//     });
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (citizen: Citizen) => {
//     setEditing(citizen);
//     reset({
//       national_id: citizen.national_id || "",
//       first_name: citizen.first_name || "",
//       father_name: citizen.father_name || "",
//       grandfather_name: citizen.grandfather_name || "",
//       family_name: citizen.family_name || "",
//       phone_number: citizen.phone_number || "",
//     });
//     setIsDialogOpen(true);
//   };

//   const onSubmit = async (data: CitizenFormData) => {
//     if (editing) {
//       executeUpdateCitizen(API.admin.citizens.update(editing.id.toString()), {
//         ...data,
//       });
//     } else {
//       executeCreateCitizen({
//         ...data,
//       });
//     }
//   };

//   const handleExportData = () => {
//     fetch(`https://backend-5549.onrender.com/api${API.admin.citizens.export}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Server error while downloading Excel");
//         return res.blob();
//       })
//       .then((blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "citizens.xlsx";
//         a.click();
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Failed to download Excel file");
//       });
//   };

//   const handleDelete = async () => {
//     if (!deleteConfirm.id) return;
//     execute(API.admin.citizens.delete(deleteConfirm.id.toString()));
//   };

//   if (!canView) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <ErrorAlert
//           message={t("admin.noCitizensPermission")}
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
//             {t("admin.citizens.title")}
//           </Typography>
//           <Typography color="textSecondary" sx={{ mt: 1 }}>
//             {t("admin.citizens.subtitle")}
//           </Typography>
//         </Box>
//         {hasPermission(permissions.citizen.export) && (
//           <span className="flex justify-center items-center gap-3">
//             <Button
//               variant="contained"
//               color="inherit"
//               startIcon={
//                 <Import
//                   className={`${language == "ar" ? "ml-2" : ""} `}
//                   size={20}
//                 />
//               }
//               onClick={handleExportData}
//             >
//               {t("admin.citizens.export")}
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={
//                 <Plus
//                   className={`${language == "ar" ? "ml-2" : ""}`}
//                   size={20}
//                 />
//               }
//               onClick={openCreateDialog}
//             >
//               {t("admin.citizens.create")}
//             </Button>
//           </span>
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
//             startIcon={<Filter size={18} />}
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
//         {/* <Collapse in={showFilters}>
//   <Box
//     sx={{
//       display: "flex",
//       flexWrap: "wrap",
//       gap: 2,
//       mt: 2,
//     }}
//   >
//     <TextField
//       label={t("admin.citizens.fullName") || "Full Name"}
//       value={searchFilters.fullName}
//       onChange={(e) =>
//         setSearchFilters({
//           ...searchFilters,
//           fullName: e.target.value,
//         })
//       }
//       size="small"
//       sx={{ minWidth: 220, flex: "1 1 220px" }}
//     />

//     <TextField
//       label={t("admin.citizens.nationalId") || "National ID"}
//       value={searchFilters.nationalId}
//       onChange={(e) =>
//         setSearchFilters({
//           ...searchFilters,
//           nationalId: e.target.value,
//         })
//       }
//       size="small"
//       sx={{ minWidth: 220, flex: "1 1 220px" }}
//     />

//     <TextField
//       label={t("admin.citizens.phoneNumber") || "Phone"}
//       value={searchFilters.phone}
//       onChange={(e) =>
//         setSearchFilters({
//           ...searchFilters,
//           phone: e.target.value,
//         })
//       }
//       size="small"
//       sx={{ minWidth: 220, flex: "1 1 220px" }}
//     />

//     <Button
//       variant="contained"
//       startIcon={<Search size={18} />}
//       onClick={handleSearch}
//       sx={{ minWidth: 180, flex: "1 1 180px", alignSelf: "center" }}
//     >
//       {t("common.search") || "Search"}
//     </Button>
//   </Box>
// </Collapse> */}

//         <Collapse in={showFilters}>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid>
//               <TextField
//                 fullWidth
//                 label={t("admin.citizens.fullName") || "Full Name"}
//                 value={searchFilters.fullName}
//                 onChange={(e) =>
//                   setSearchFilters({
//                     ...searchFilters,
//                     fullName: e.target.value,
//                   })
//                 }
//                 size="small"
//               />
//             </Grid>
//             <Grid>
//               <TextField
//                 fullWidth
//                 label={t("admin.citizens.nationalId") || "National ID"}
//                 value={searchFilters.nationalId}
//                 onChange={(e) =>
//                   setSearchFilters({
//                     ...searchFilters,
//                     nationalId: e.target.value,
//                   })
//                 }
//                 size="small"
//               />
//             </Grid>
//             <Grid>
//               <TextField
//                 fullWidth
//                 label={t("admin.citizens.phoneNumber") || "Phone"}
//                 value={searchFilters.phone}
//                 onChange={(e) =>
//                   setSearchFilters({
//                     ...searchFilters,
//                     phone: e.target.value,
//                   })
//                 }
//                 size="small"
//               />
//             </Grid>
//             <Grid>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 startIcon={<Search size={18} />}
//                 onClick={handleSearch}
//               >
//                 {t("common.search") || "Search"}
//               </Button>
//             </Grid>
//           </Grid>
//         </Collapse>
//       </Paper>

//       <PaginatedTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         meta={meta}
//         onPageChange={handlePageChange}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         emptyMessage={t("admin.noCitizensFound")}
//       />

//       {/* Create/Edit Dialog */}
//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           {editing ? t("admin.citizens.update") : t("admin.citizens.create")}
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={3}>
//             <FormTextField
//               control={control}
//               name="national_id"
//               label={t("form.nationalId")}
//             />
//             <FormTextField
//               control={control}
//               name="first_name"
//               label={t("form.firstName")}
//             />
//             <FormTextField
//               control={control}
//               name="father_name"
//               label={t("form.fatherName")}
//             />
//             <FormTextField
//               control={control}
//               name="grandfather_name"
//               label={t("form.grandfatherName")}
//             />
//             <FormTextField
//               control={control}
//               name="family_name"
//               label={t("form.familyName")}
//             />
//             <FormTextField
//               control={control}
//               name="phone_number"
//               label={t("form.phoneNumber")}
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
//               isSubmitting || loadingCreateCitizen || loadingUpdateCitizen
//             }
//           >
//             {isSubmitting ? (
//               <CircularProgress size={20} />
//             ) : editing ? (
//               t("admin.citizens.update")
//             ) : (
//               t("common.submit")
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirm Dialog */}
//       <ConfirmDialog
//         open={deleteConfirm.open}
//         title={t("admin.citizens.deleteConfirm")}
//         message={""}
//         confirmText={t("common.delete")}
//         cancelText={t("common.cancel")}
//         isLoading={loadingDeleteCitizen}
//         isDangerous
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteConfirm({ open: false, id: null })}
//       />
//     </Container>
//   );
// }

// export default AdminCitizensPage;
