// import { useEffect, useState } from "react";
// import { useForm, Resolver, SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   Box,
//   Chip,
//   Container,
//   Button,
//   TextField,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   CircularProgress,
//   Stack,
//   MenuItem,
//   Link as MuiLink,
//   Collapse,
// } from "@mui/material";
// import { Plus, Trash2, Edit2, Search, Filter, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { Citizen, Location, LocationType } from "../../types/entities";
// import { FormTextField } from "../../components/Shared/FormTextField";
// import ErrorAlert from "../../components/Shared/ErrorAlert";
// import ConfirmDialog from "../../components/Shared/ConfirmDialog";
// import { useNotification } from "../../hooks/useNotifications";
// import { useDelete, usePatch, usePost } from "../../hooks/api/useApi";
// import MapContainer from "../../components/MapContainer";
// import { locationSchema } from "../../services/validation";
// import { API } from "../../constants/ApiRoutes";
// import { permissions } from "../../constants/permissions";
// import PaginatedTable from "../../components/admin/PaginationTable";
// import { api } from "../../services/api";
// import DebounceSearchField from "../../components/admin/DebounceSearchField";

// // Fix default marker icons for Leaflet
// delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
//   ._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// interface LocationFormData {
//   type: Location["type"];
//   notes?: string;
//   citizenId?: number;
// }

// const locationColors: Record<string, object> = {
//   BEFORE_WAR: {
//     bgcolor: "rgba(183, 28, 28, 0.12)",
//     color: "#b71c1c",
//     fontWeight: 600,
//   },
//   AFTER_WAR: {
//     bgcolor: "rgba(255, 143, 0, 0.12)",
//     color: "#ff8f00",
//     fontWeight: 600,
//   },
//   TEMPORARY: {
//     bgcolor: "rgba(2, 136, 209, 0.12)",
//     color: "#0288d1",
//     fontWeight: 600,
//   },
//   CURRENT: {
//     bgcolor: "rgba(46, 125, 50, 0.12)",
//     color: "#2e7d32",
//     fontWeight: 600,
//   },
// };

// export function AdminLocationsPage() {
//   const { t, language } = useLanguage();
//   const { hasPermission } = useAuth();
//   const { showSuccess, showError } = useNotification();

//   const canManage = hasPermission(permissions.location.create);
//   const canView = hasPermission(permissions.location.view);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<Location | null>(null);
//   const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
//   const [selectedValue, setSelectedValue] = useState<any>(null);

//   const [deleteConfirm, setDeleteConfirm] = useState<{
//     open: boolean;
//     id: number | null;
//   }>({ open: false, id: null });

//   const [position, setPosition] = useState<[number, number] | null>();
//   const [address, setAddress] = useState("");

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
//     type: "",
//     neighborhood: "",
//   });
//   const [activeFilters, setActiveFilters] = useState<any>({
//     applicationId: "",
//     fullName: "",
//     nationalId: "",
//     type: "",
//     neighborhood: "",
//   });

//   // Default center: Gaza City
//   const defaultCenter: [number, number] = [31.3547, 34.3088];
//   const center = position || defaultCenter;

//   const locationTypes = [
//     {
//       id: 1,
//       value: LocationType.BEFORE_WAR,
//       label: t("admin.locations.beforeWar"),
//     },
//     {
//       id: 2,
//       value: LocationType.AFTER_WAR,
//       label: t("admin.locations.afterWar"),
//     },
//     {
//       id: 3,
//       value: LocationType.TEMPORARY,
//       label: t("admin.locations.temporary"),
//     },
//     { id: 4, value: LocationType.CURRENT, label: t("admin.locations.current") },
//   ];

//   // Form
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<LocationFormData>({
//     resolver: yupResolver(
//       locationSchema
//     ) as unknown as Resolver<LocationFormData>,
//     defaultValues: {
//       citizenId: undefined,
//       type: LocationType.CURRENT,
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

//       if (filters.applicationId) {
//         params.applicationId = filters.applicationId;
//       }
//       if (filters.fullName) {
//         params.fullName = filters.fullName;
//       }
//       if (filters.nationalId) {
//         params.nationalId = filters.nationalId;
//       }
//       if (filters.type) {
//         params.type = filters.type;
//       }
//       if (filters.neighborhood) {
//         params.neighborhood = filters.neighborhood;
//       }

//       const res = await api.get(API.admin.locations.list, { params });
//       setData(res.data.data.data);
//       setMeta(res.data.data.meta);
//     } catch (err) {
//       showError(t("error.fetchLocations"));
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
//       type: "",
//       neighborhood: "",
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
//       id: "citizen",
//       label: t("admin.citizen"),
//       align: "center" as const,
//       format: (_: any, row: Location) => (
//         <Box>
//           <Typography variant="body2" fontWeight="medium">
//             {row.citizen?.first_name || `Citizen #${row.citizenId}`}
//           </Typography>
//           <Typography variant="caption" color="textSecondary">
//             {row.citizen?.national_id}
//           </Typography>
//         </Box>
//       ),
//     },
//     {
//       id: "type",
//       label: t("admin.type"),
//       align: "center" as const,
//       format: (value: LocationType) => (
//         <Chip
//           label={value.replace("_", " ").toLowerCase()}
//           sx={{
//             ...locationColors[value],
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
//       id: "neighborhood",
//       label: t("admin.neighborhood"),
//       align: "center" as const,
//       format: (value: string) => value || "-",
//     },
//     {
//       id: "address",
//       label: t("admin.address"),
//       align: "center" as const,
//       format: (_: any, row: Location) =>
//         [row.address, row.town, row.street].filter(Boolean).join(" • ") || "-",
//     },
//     {
//       id: "coordinates",
//       label: t("admin.coordinates"),
//       align: "center" as const,
//       format: (_: any, row: Location) =>
//         row.latitude != null && row.longitude != null ? (
//           <Box>
//             <Typography variant="body2">
//               {row.latitude}, {row.longitude}
//             </Typography>
//             <MuiLink
//               component={Link}
//               to={`/admin/locations/map?lat=${row.latitude}&lng=${row.longitude}`}
//               variant="caption"
//               sx={{ display: "block", mt: 0.5 }}
//             >
//               {t("map.showonmap")}
//             </MuiLink>
//           </Box>
//         ) : (
//           "-"
//         ),
//     },
//     ...(canManage
//       ? [
//           {
//             id: "actions",
//             label: t("admin.actions"),
//             align: "center" as const,
//             format: (_: any, row: Location) => (
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

//   const { loading: loadingDeleteLocation, execute } = useDelete({
//     onSuccess: () => {
//       showSuccess(t("success.locationDeleted"));
//       setData((prev: Location[]) =>
//         prev ? prev.filter((l) => l.id !== deleteConfirm.id) : prev
//       );
//       setDeleteConfirm({ open: false, id: null });
//     },
//     onError: (error) => {
//       showError(error || t("error.deleteLocation"));
//     },
//   });

//   const { loading: loadingCreateLocation, execute: executeCreateLocation } =
//     usePost(API.admin.locations.create, {
//       onSuccess: (data) => {
//         setData((prev: Location[]) => (prev ? [data, ...prev] : [data]));
//         showSuccess(t("success.locationCreated"));
//         setIsDialogOpen(false);
//         reset();
//       },
//       onError: (error) => {
//         showError(error || t("error.createLocation"));
//       },
//     });

//   const { loading: loadingUpdateLocation, execute: executeUpdateLocation } =
//     usePatch({
//       onSuccess: (data) => {
//         setData(
//           (prev: Location[]) =>
//             prev?.map((l) => (l.id === data.id ? data : l)) || prev
//         );
//         showSuccess(t("success.locationUpdated"));
//         setIsDialogOpen(false);
//         reset();
//       },
//       onError: (error) => {
//         showError(error || t("error.updateLocation"));
//       },
//     });

//   useEffect(() => {
//     if (position) {
//       fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
//       )
//         .then((res) => res.json())
//         .then((data) => {
//           setAddress(data.display_name || "Location selected");
//         })
//         .catch(() => {
//           setAddress("");
//         });
//     }
//   }, [position]);

//   const openCreateDialog = () => {
//     setEditing(null);
//     setPosition(null);
//     setSelectedCitizen(null);
//     reset({
//       type: LocationType.CURRENT,
//       notes: "",
//       citizenId: undefined,
//     });
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (location: Location) => {
//     setEditing(location);
//     setPosition([location?.latitude || 0, location?.longitude || 0]);
//     setSelectedCitizen(location.citizen || null);
//     reset({
//       type: location.type,
//       notes: location.notes || "",
//       citizenId: location?.citizen?.id,
//     });
//     setIsDialogOpen(true);
//   };

//   const onSubmit = async (data: LocationFormData & { citizenId?: number }) => {
//     const payload = {
//       citizenId: editing ? data.citizenId : selectedValue,
//       type: data.type,
//       address: address || null,
//       latitude: position ? position[0].toString() : null,
//       longitude: position ? position[1].toString() : null,
//       notes: data.notes || null,
//     };

//     if (editing) {
//       executeUpdateLocation(
//         API.admin.locations.update(editing.id.toString()),
//         payload
//       );
//     } else {
//       executeCreateLocation(payload);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteConfirm.id) return;
//     execute(API.admin.locations.delete(deleteConfirm.id.toString()));
//   };

//   if (!canView) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <ErrorAlert
//           message={t("admin.locations.permissionMessage")}
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
//             {t("admin.locations.title")}
//           </Typography>
//           <Typography color="textSecondary" sx={{ mt: 1 }}>
//             {t("admin.locations.subtitle")}
//           </Typography>
//         </Box>
//         {canManage && (
//           <Button
//             variant="contained"
//             startIcon={
//               <Plus className={`${language == "ar" ? "ml-2" : ""}`} size={20} />
//             }
//             onClick={openCreateDialog}
//           >
//             {t("admin.locations.create")}
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
//               {t("common.clearFilters")}
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
//               label={t("admin.locations.applicationId") || "Application ID"}
//               value={searchFilters.applicationId}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   applicationId: e.target.value,
//                 })
//               }
//               size="small"
//               type="text"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             />

//             <TextField
//               label={t("admin.neighborhood") || "Neighborhood"}
//               value={searchFilters.neighborhood}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   neighborhood: e.target.value,
//                 })
//               }
//               size="small"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             />

//             <TextField
//               label={t("admin.citizens.fullName") || "Full Name"}
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
//               label={t("admin.citizens.nationalId") || "National ID"}
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
//               select
//               label={t("admin.type") || "Type"}
//               value={searchFilters.type}
//               onChange={(e) =>
//                 setSearchFilters({
//                   ...searchFilters,
//                   type: e.target.value as LocationType | "",
//                 })
//               }
//               size="small"
//               sx={{ minWidth: 220, flex: "1 1 220px" }}
//             >
//               <MenuItem value="">{t("common.all") || "All"}</MenuItem>
//               {locationTypes.map((type) => (
//                 <MenuItem key={type.id} value={type.value}>
//                   {type.label}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Button
//               variant="contained"
//               startIcon={<Search size={18} />}
//               onClick={handleSearch}
//               sx={{ minWidth: 180, flex: "1 1 180px" }}
//             >
//               {t("common.search") || "Search"}
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
//         emptyMessage={t("admin.noLocationsFound")}
//       />

//       {/* Create/Edit Dialog */}
//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {editing ? t("admin.locations.update") : t("admin.locations.create")}{" "}
//           {editing?.applicationId}
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={3}>
//             {editing ? (
//               <TextField
//                 label={t("admin.applications.citizen")}
//                 value={`${selectedCitizen?.full_name ?? "----"} (${
//                   selectedCitizen?.national_id
//                 })`}
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
//               name="type"
//               label={t("admin.locations.formType")}
//               select
//             >
//               {locationTypes.map((type) => (
//                 <MenuItem
//                   key={type.id}
//                   value={type.value}
//                   sx={locationColors[type.value]}
//                 >
//                   {type.label}
//                 </MenuItem>
//               ))}
//             </FormTextField>

//             <Box>
//               <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
//                 {t("admin.selectOnMap")}
//               </Typography>
//               <Typography
//                 variant="caption"
//                 color="textSecondary"
//                 sx={{ mb: 2, display: "block" }}
//               >
//                 {t("admin.selectOnMapHelp")}
//               </Typography>

//               <Box
//                 sx={{
//                   height: 400,
//                   borderRadius: 1,
//                   overflow: "hidden",
//                   border: 1,
//                   borderColor: "grey.300",
//                 }}
//               >
//                 <MapContainer
//                   center={center}
//                   zoom={15}
//                   markerPosition={position}
//                   setMarkerPosition={setPosition}
//                   height="100%"
//                   width="100%"
//                   {...{ setAddress }}
//                 />
//               </Box>
//             </Box>

//             <FormTextField
//               control={control}
//               name="notes"
//               label={t("admin.locations.notes")}
//               multiline
//               rows={3}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsDialogOpen(false)}>
//             {t("common.cancel")}
//           </Button>
//           <Button
//             onClick={handleSubmit(onSubmit as SubmitHandler<LocationFormData>)}
//             variant="contained"
//             disabled={
//               isSubmitting || loadingCreateLocation || loadingUpdateLocation
//             }
//           >
//             {isSubmitting ? (
//               <CircularProgress size={20} />
//             ) : editing ? (
//               t("admin.locations.update")
//             ) : (
//               t("common.submit")
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirm Dialog */}
//       <ConfirmDialog
//         open={deleteConfirm.open}
//         title={t("admin.locations.deleteConfirm")}
//         message={""}
//         confirmText={t("common.delete")}
//         cancelText={t("common.cancel")}
//         isLoading={loadingDeleteLocation}
//         isDangerous
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteConfirm({ open: false, id: null })}
//       />
//     </Container>
//   );
// }

// export default AdminLocationsPage;
