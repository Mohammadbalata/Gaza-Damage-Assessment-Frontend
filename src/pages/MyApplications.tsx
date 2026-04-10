import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Fade,
  CardContent,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  alpha,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import ApplicationCard from "../components/MyApplications/ApplicationCard";

import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Home as HomeIcon,
  Foundation as FoundationIcon,
  MonetizationOn as MonetizationOnIcon,
  MedicalServices as MedicalServicesIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Feedback as ComplaintIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLanguage } from "../contexts/LanguageContext";
// import { usePut } from "../hooks/api/useApi";
import { ROUTES } from "../routes/Routes";
import ErrorAlert from "../components/Shared/ErrorAlert";
import BackButton from "../components/Shared/BackButton";
import ConfirmDialog from "../components/Shared/ConfirmDialog";
import DamageAssessmentDialog from "./DamageAssessmentDialog";
import ComplaintDialog from "../components/Complaints/ComplaintDialog";
import {
  generatePDFReceipt,
  generateApplicationPDF,
} from "../utils/pdfGenerator";
import { API } from "../constants/ApiRoutes";
import { formatDate } from "../utils/helpers";
import { RotateCcw, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import MapContainer from "../components/MapContainer";
// import SelectLocations from "../components/SelectLocations";
// import { locations } from "../constants/locations";
import { axiosClient } from "../api/baseUrl";
import LanguageToggle from "../components/LanguageToggle";

const MyApplications = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isInsideGaza, setIsInsideGaza] = useState(false);
  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [search, setSearch] = useState("");

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const {} = useForm<any>({
    defaultValues: {
      id: "",
    },
  });

  // Complaint Dialog State
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [complaintApp, setComplaintApp] = useState<any>(null);

  // Current Location Edit Dialog State
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationPosition, setLocationPosition] = useState<
    [number, number] | null
  >(null);
  const [locationAddress, setLocationAddress] = useState("");
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const theme = useTheme();
  const citizenInfo = JSON.parse(localStorage.getItem("citizenInfo") || "{}");
  const [locationLoading, setLocationLoading] = useState(false);

  // Cascading Location States for Dialog
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [neighborhoodLocations, setNeighborhoodLocations] = useState<any[]>([]);
  const [landmarks, setLandmarks] = useState<any[]>([]);

  const [landmarksData, setLandmarksData] = useState<any[]>([]);
  const [targetNames, setTargetNames] = useState<{
    governorate: string;
    municipality: string;
    neighborhood: string;
    landmark: string;
  } | null>(null);

  const [selectedGovernorateId, setSelectedGovernorateId] =
    useState<string>("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] =
    useState<string>("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] =
    useState<string>("");
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>("");

  // Load Landmarks.json for reverse lookup
  useEffect(() => {
    fetch("/Landmarks.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.features) setLandmarksData(data.features);
      })
      .catch((err) => console.error("Error loading Landmarks.json:", err));
  }, []);

  // Fetch governorates for dialog
  useEffect(() => {
    axiosClient
      .get("/locations/governorates")
      .then((res: any) => {
        setGovernorates(res.data.governorates || []);
      })
      .catch((err: any) => console.error("Error fetching governorates:", err));
  }, []);

  // Normalization and Match Helpers
  const normalizeText = (text: string) => {
    if (!text) return "";
    return text
      .trim()
      .replace(/[\uFEFF\u200B\u200C\u200D]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/\s+/g, "");
  };

  const GOV_MAPPING: Record<string, string> = {
    الشمال: "شمال غزة",
    "دير البلح - الوسطى": "دير البلح",
    الوسطى: "دير البلح",
  };

  const findMatch = (list: any[], nameToFind: string) => {
    if (!nameToFind || !list) return null;
    const normalizedToFind = normalizeText(nameToFind);
    let match = list.find(
      (item) => normalizeText(item.name) === normalizedToFind,
    );
    if (!match) {
      match = list.find(
        (item) =>
          normalizeText(item.name).includes(normalizedToFind) ||
          normalizedToFind.includes(normalizeText(item.name)),
      );
    }
    return match;
  };

  // Close Complaint Confirmation State
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [appToClose, setAppToClose] = useState<any>(null);
  const [closingComplaint, setClosingComplaint] = useState(false);

  // // usePut for updating current location
  // const { loading: locationLoading, execute: updateLocation } = usePut(
  //   `${API.citizen.locations.current}`,
  //   {
  //     onSuccess: () => {
  //       enqueueSnackbar(t("citizen.updateLocationSuccess"), {
  //         variant: "success",
  //       });
  // Cascading Selection Sync (Copy of CurrentLocationMapPage logic)
  useEffect(() => {
    if (locationPosition && landmarksData.length > 0 && locationDialogOpen) {
      let minDistance = Infinity;
      let nearest: any = null;

      landmarksData.forEach((f: any) => {
        if (!f.geometry || !f.geometry.coordinates) return;
        const [lLng, lLat] = f.geometry.coordinates;
        const dist =
          Math.pow(locationPosition[0] - lLat, 2) +
          Math.pow(locationPosition[1] - lLng, 2);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = f;
        }
      });

      if (nearest) {
        const props = nearest.properties;
        setTargetNames({
          governorate: props.المحافظة || "",
          municipality: props.البلدية || "",
          neighborhood: props.الحي || "",
          landmark: props.اسم_المعلم || "",
        });
      }
    }
  }, [locationPosition, landmarksData, locationDialogOpen]);

  useEffect(() => {
    if (targetNames && governorates.length > 0) {
      const match = findMatch(
        governorates,
        GOV_MAPPING[targetNames.governorate] || targetNames.governorate,
      );
      if (match && match.id.toString() !== selectedGovernorateId.toString()) {
        setSelectedGovernorateId(match.id.toString());
      }
    }
  }, [targetNames, governorates]);

  useEffect(() => {
    if (targetNames && municipalities.length > 0) {
      const match = findMatch(municipalities, targetNames.municipality);
      if (match && match.id.toString() !== selectedMunicipalityId.toString()) {
        setSelectedMunicipalityId(match.id.toString());
      }
    }
  }, [targetNames, municipalities]);

  useEffect(() => {
    if (targetNames && neighborhoodLocations.length > 0) {
      const match = findMatch(neighborhoodLocations, targetNames.neighborhood);
      if (match && match.id.toString() !== selectedNeighborhoodId.toString()) {
        setSelectedNeighborhoodId(match.id.toString());
      }
    }
  }, [targetNames, neighborhoodLocations]);

  useEffect(() => {
    if (targetNames && landmarks.length > 0) {
      const match = findMatch(landmarks, targetNames.landmark);
      if (match && match.id.toString() !== selectedLandmarkId.toString()) {
        setSelectedLandmarkId(match.id.toString());
      }
    }
  }, [targetNames, landmarks]);

  // Fetch municipalities when governorate changes
  useEffect(() => {
    if (selectedGovernorateId) {
      axiosClient
        .get("/locations/municipalities", {
          params: { governorate_id: selectedGovernorateId },
        })
        .then((res: any) => {
          setMunicipalities(res.data.municipalities || []);
          setNeighborhoodLocations([]);
          setLandmarks([]);
          setSelectedMunicipalityId("");
          setSelectedNeighborhoodId("");
          setSelectedLandmarkId("");
        })
        .catch((err: any) =>
          console.error("Error fetching municipalities:", err),
        );
    } else {
      setMunicipalities([]);
    }
  }, [selectedGovernorateId]);

  // Fetch neighborhoods when municipality changes
  useEffect(() => {
    if (selectedMunicipalityId) {
      axiosClient
        .get("/locations/neighborhoods", {
          params: { municipality_id: selectedMunicipalityId },
        })
        .then((res: any) => {
          setNeighborhoodLocations(res.data.neighborhoods || []);
          setLandmarks([]);
          setSelectedNeighborhoodId("");
          setSelectedLandmarkId("");
        })
        .catch((err: any) =>
          console.error("Error fetching neighborhoods:", err),
        );
    } else {
      setNeighborhoodLocations([]);
    }
  }, [selectedMunicipalityId]);

  // Fetch landmarks when neighborhood changes
  useEffect(() => {
    if (selectedNeighborhoodId) {
      axiosClient
        .get("/locations/landmarks", {
          params: { neighborhood_id: selectedNeighborhoodId },
        })
        .then((res: any) => {
          setLandmarks(res.data.landmarks || []);
          setSelectedLandmarkId("");
        })
        .catch((err: any) => console.error("Error fetching landmarks:", err));
    } else {
      setLandmarks([]);
    }
  }, [selectedNeighborhoodId]);
  //     },
  //     onError: (err) => {
  //       enqueueSnackbar(t("citizen.updateLocationError"), { variant: "error" });
  //       console.error(err);
  //     },
  //   }
  // );

  // Reverse geocoding for location address
  useEffect(() => {
    if (locationPosition) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationPosition[0]}&lon=${locationPosition[1]}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setLocationAddress(data.display_name || t("map.selectLocation"));
        })
        .catch(() => {
          setLocationAddress(
            `Lat: ${locationPosition[0].toFixed(
              6,
            )}, Lng: ${locationPosition[1].toFixed(6)}`,
          );
        });
    }
  }, [locationPosition, t]);

  // const id = watch("id");

  // const {
  //   data: rawData,
  //   loading,
  //   error,
  //   execute: refreshApplications,
  // } = useGet<any>(`${API.citizen.applications.list}`, {
  //   immediate: true,
  // });
  const [rawData, setRawData] = useState<any>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, complaintsRes] = await Promise.all([
          axiosClient.get(API.citizen.applications.list, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axiosClient.get(API.citizen.complaints.list, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const apps = appsRes.data.damage_reports || appsRes.data || [];
        const complaintsRaw =
          complaintsRes.data?.complaints ||
          complaintsRes.data?.data?.complaints ||
          complaintsRes.data?.data ||
          [];
        const complaints = Array.isArray(complaintsRaw)
          ? complaintsRaw
          : complaintsRaw.data || [];

        // Merge complaints into apps
        const enhancedApps = (Array.isArray(apps) ? apps : []).map(
          (app: any) => {
            const complaint = complaints.find(
              (c: any) =>
                String(c.damage_report?.id) === String(app.id) ||
                String(c.damage_report_id) === String(app.id),
            );
            return { ...app, complaint };
          },
        );

        setRawData(enhancedApps);
        // setNeighborhoods(neighborhoodsRes.data.neighborhoods || []);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Robust data handling
  const applications: any[] = Array.isArray(rawData) ? rawData : [];

  // useEffect(() => {
  //   // console.log("rawData", rawData?.damage_reports);
  //   console.log("applications", applications);
  // }, [rawData]);

  // Filter applications
  const filteredApplications = applications?.filter((app: any) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();

    // Search by ID or Report Code (Tracking Number)
    const idMatch =
      app.id?.toString().includes(lowerSearch) ||
      app.report_code?.toLowerCase().includes(lowerSearch);

    // Search by Neighborhood ID or Address
    const neighborhoodMatch = app.neighborhood_id
      ?.toString()
      .includes(lowerSearch);

    // Search by Status (Localized Label)
    const statusLabel = t(`status.${app.status?.toLowerCase()}`)?.toLowerCase();
    const statusMatch =
      statusLabel?.includes(lowerSearch) ||
      app.status?.toLowerCase().includes(lowerSearch);

    // Search by Address, Landmark, or Street
    const buildingType = app.damage_details?.buildingType;
    const buildingData = app.damage_details?.[buildingType] || {};
    const addressMatch =
      app.address?.toLowerCase().includes(lowerSearch) ||
      buildingData.landmark?.toLowerCase().includes(lowerSearch) ||
      buildingData.nameOfStreet?.toLowerCase().includes(lowerSearch);

    return idMatch || neighborhoodMatch || statusMatch || addressMatch;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [outsideAddress, setOutsideAddress] = useState<string>(
    citizenInfo.current_location.accommodation_type === "in_gaza"
      ? ""
      : citizenInfo?.current_location?.address,
  );

  // const filterdApplications = id
  //   ? applications?.filter((item: any) => item.id === id)
  //   : applications;
  // console.log("rawData", rawData);
  const handleGeneratePdf = () => {
    generatePDFReceipt(rawData, t, language);
    // console.log(applications);
    // console.log(rawData);
    // console.log(language);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRequestTypeSelect = (type: string) => {
    handleMenuClose();
    if (type === "damage") {
      navigate(ROUTES.PREVIOUS_LOCATION);
    } else {
      enqueueSnackbar(t("common.comingSoonMessage"), {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: language === "ar" ? "left" : "right",
        },
      });
    }
  };

  // في MyApplications.tsx - داخل handleAction

  const handleAction = (app: any) => {
    const status = app.status?.toUpperCase() || "SUBMITTED";
    const canEdit = status === "SUBMITTED";

    // إنشاء نسخة عميقة من الكائن بدلاً من تعديله مباشرة
    const transformedApp = JSON.parse(JSON.stringify(app)); // <-- الحل هنا

    if (app.damageAttachments && app.damageAttachments.length > 0) {
      // تصنيف المرفقات حسب الفئة
      const beforeImage = app.damageAttachments.find(
        (att: any) => att.category === "before_damage_image",
      );
      const afterImage = app.damageAttachments.find(
        (att: any) => att.category === "after_damage_image",
      );
      const ownershipDocs = app.damageAttachments.filter(
        (att: any) => att.category === "ownership_documents",
      );

      // إضافة الصور إلى الكائن الرئيسي (النسخة الجديدة)
      if (beforeImage) {
        transformedApp.before_damage_image = beforeImage.file_url;
      }
      if (afterImage) {
        transformedApp.after_damage_image = afterImage.file_url;
      }
      if (ownershipDocs.length > 0) {
        transformedApp.ownership_documents = ownershipDocs.map(
          (doc: any) => doc.file_url,
        );
      }

      // أيضاً إضافتها داخل damage_details إذا كان الـ buildingType موجود
      const buildingType = app.damage_details?.buildingType;
      if (buildingType && app.damage_details[buildingType]) {
        // تأكد من وجود الكائن
        if (!transformedApp.damage_details[buildingType]) {
          transformedApp.damage_details[buildingType] = {};
        }
        if (beforeImage) {
          transformedApp.damage_details[buildingType].before_damage_image =
            beforeImage.file_url;
        }
        if (afterImage) {
          transformedApp.damage_details[buildingType].after_damage_image =
            afterImage.file_url;
        }
        if (ownershipDocs.length > 0) {
          transformedApp.damage_details[buildingType].ownership_documents =
            ownershipDocs.map((doc: any) => doc.file_url);
        }
      }
    }

    setSelectedApplication(transformedApp); // استخدم النسخة الجديدة
    setIsReadOnly(!canEdit);
    setDialogOpen(true);
  };

  const handleDownloadAppPdf = (app: any) => {
    generateApplicationPDF(app, t, language);
  };

  const handleOpenComplaint = (app: any) => {
    setComplaintApp(app);
    setComplaintDialogOpen(true);
  };
  const handleCloseComplaintDialog = () => {
    setComplaintDialogOpen(false);
    setComplaintApp(null);
  };

  const handleOpenCloseConfirm = (app: any) => {
    setAppToClose(app);
    setCloseConfirmOpen(true);
  };

  const handleConfirmCloseComplaint = async () => {
    if (!appToClose?.complaint?.id) return;

    setClosingComplaint(true);
    try {
      await axiosClient.put(
        API.citizen.complaints.close(appToClose.complaint.id),
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      enqueueSnackbar(t("complaint.closeSuccess"), { variant: "success" });
      setCloseConfirmOpen(false);

      // Refresh applications to update status
      const [appsRes, complaintsRes] = await Promise.all([
        axiosClient.get(API.citizen.applications.list, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axiosClient.get(API.citizen.complaints.list, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const apps = appsRes.data.damage_reports || appsRes.data || [];
      const complaintsRaw =
        complaintsRes.data?.complaints ||
        complaintsRes.data?.data?.complaints ||
        complaintsRes.data?.data ||
        [];
      const complaints = Array.isArray(complaintsRaw)
        ? complaintsRaw
        : complaintsRaw.data || [];

      const enhancedApps = (Array.isArray(apps) ? apps : []).map((app: any) => {
        const complaint = complaints.find(
          (c: any) =>
            String(c.damage_report?.id) === String(app.id) ||
            String(c.damage_report_id) === String(app.id),
        );
        return { ...app, complaint };
      });

      setRawData(enhancedApps);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("complaint.closeError"), { variant: "error" });
    } finally {
      setClosingComplaint(false);
      setAppToClose(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
    // Optional: Refresh list if edited?
    // if (!isReadOnly) refresh(); // If we have refresh exposed
  };

  // Location Dialog Handlers
  const handleOpenLocationDialog = () => {
    setTargetNames(null);
    // Pre-fill with existing location if available
    if (citizenInfo?.current_location) {
      const lat = parseFloat(citizenInfo.current_location.latitude);
      const lng = parseFloat(citizenInfo.current_location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocationPosition([lat, lng]);
        setMapCenter([lat, lng]);
      }
      setLocationAddress(citizenInfo.current_location.address || "");

      // Safety fix: Safe access to nested properties
      const govId = citizenInfo.current_location.governorate_id;
      const muniId = citizenInfo.current_location.municipality_id;
      const neighId = citizenInfo.current_location.neighborhood_id;
      const landmarkId = citizenInfo.current_location.landmark_id;

      if (govId) setSelectedGovernorateId(govId.toString());
      if (muniId) setSelectedMunicipalityId(muniId.toString());
      if (neighId) setSelectedNeighborhoodId(neighId.toString());
      if (landmarkId) setSelectedLandmarkId(landmarkId.toString());
    } else {
      setLocationPosition(null);
      setLocationAddress("");
      setSelectedGovernorateId("");
      setSelectedMunicipalityId("");
      setSelectedNeighborhoodId("");
      setSelectedLandmarkId("");
    }
    setLocationDialogOpen(true);
  };

  const handleCloseLocationDialog = () => {
    setLocationDialogOpen(false);
    setLocationPosition(null);
    setLocationAddress("");
  };

  const handleResetLocation = () => {
    setLocationPosition(null);
    setLocationAddress("");
  };

  const handleConfirmLocationUpdate = () => {
    if (locationPosition && locationAddress) {
      setLocationLoading(true);

      axiosClient
        .put(
          `${API.citizen.locations.current}`,
          isInsideGaza
            ? {
                accommodation_type: "inside_gaza",
                latitude: locationPosition[0].toString(),
                longitude: locationPosition[1].toString(),
                address: locationAddress,
                governorate_id: selectedGovernorateId
                  ? Number(selectedGovernorateId)
                  : null,
                municipality_id: selectedMunicipalityId
                  ? Number(selectedMunicipalityId)
                  : null,
                neighborhood_id: selectedNeighborhoodId
                  ? Number(selectedNeighborhoodId)
                  : null,
                landmark_id: selectedLandmarkId
                  ? Number(selectedLandmarkId)
                  : null,
              }
            : {
                accommodation_type: "outside_gaza",
                address: outsideAddress,
              },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((res: any) => {
          setLocationLoading(false);
          enqueueSnackbar(t("citizen.updateLocationSuccess"), {
            variant: "success",
          });
          setLocationDialogOpen(false);

          const citizenInfo = JSON.parse(
            localStorage.getItem("citizenInfo") || "{}",
          );

          const updated = {
            ...citizenInfo,
            current_location: res.data.citizen.current_location,
          };

          localStorage.setItem("citizenInfo", JSON.stringify(updated));
          console.log(res.data);
        })
        .catch((err: any) => {
          setLocationLoading(false);
          enqueueSnackbar(t("citizen.updateLocationError"), {
            variant: "error",
          });
          console.log(err);
        });
    }
  };

  console.log(
    "citizenInfo.current_locationcitizenInfo.current_location",
    citizenInfo.current_location,
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        <ErrorAlert
          sx={{ width: "100%", maxWidth: 500, display: "flex", gap: 1 }}
          message={language === "ar" ? "لا يوجد طلبات" : error}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </Button>
          <BackButton language={language} to={ROUTES.CITIZEN_DASHBOARD} />
        </Stack>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Stack
          direction={{ xs: "column", md: "column" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {t("citizen.myRequests")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("citizen.myRequestsDesc")}
              </Typography>
            </Box>

            <BackButton
              sx={{ mb: 0, mt: 0 }}
              language={language}
              to={ROUTES.CITIZEN_DASHBOARD}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              ml: "0 !important",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon sx={{ ml: 1 }} />}
              endIcon={<KeyboardArrowDownIcon sx={{ mr: 1 }} />}
              onClick={handleMenuClick}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("citizen.addDamageRequest")}
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={
                <DescriptionIcon
                  sx={{
                    fontSize: 40,
                    marginLeft: 1,
                    flexBasis: "1",
                    width: { xs: "100%", sm: "auto" },
                  }}
                />
              }
              onClick={handleGeneratePdf}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("success.downloadReceipt")}
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<ComplaintIcon sx={{ ml: 1 }} />}
              onClick={() => navigate("/citizen/my-complaints")}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
                bgcolor: "error.main",
                "&:hover": {
                  bgcolor: "error.dark",
                },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("complaint.myComplaints")}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { width: 320, mt: 1, borderRadius: 2 },
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: language === "ar" ? "left" : "right",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: language === "ar" ? "left" : "right",
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("citizen.addDamageRequest")}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => handleRequestTypeSelect("damage")}>
                <ListItemIcon>
                  <HomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.damageRequest")}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
              </MenuItem>
              <MenuItem onClick={() => handleRequestTypeSelect("relief")}>
                <ListItemIcon>
                  <MedicalServicesIcon color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.reliefRequest")}
                  secondary={t("citizen.comingSoon")}
                />
              </MenuItem>
              <MenuItem onClick={() => handleRequestTypeSelect("compensation")}>
                <ListItemIcon>
                  <MonetizationOnIcon color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.compensationRequest")}
                  secondary={t("citizen.comingSoon")}
                />
              </MenuItem>
              <MenuItem onClick={() => handleRequestTypeSelect("housing")}>
                <ListItemIcon>
                  <FoundationIcon color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.housingRequest")}
                  secondary={t("citizen.comingSoon")}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Stack>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t("form.enterTrackingNumber")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1 }} />,
            }}
            size="small"
          />
        </Box>
        {/* Applications List */}
        {!applications || applications.length === 0 ? (
          /* Empty State */
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                mb: 3,
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "action.hover",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                mx: "auto",
              }}
            >
              <DescriptionIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("citizen.noApplications")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              {t("citizen.createFirstApplication")}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AddIcon sx={{ ml: 1 }} />}
              onClick={() => handleRequestTypeSelect("damage")}
            >
              {t("citizen.addDamageRequest")}
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 5,
            }}
            className="sm:px-10 lg:px-0"
          >
            {filteredApplications.map((app: any, index: number) => (
              <ApplicationCard
                key={app.id || index}
                index={index}
                application={app}
                onAction={handleAction}
                onDownloadPdf={handleDownloadAppPdf}
                onAddComplaint={handleOpenComplaint}
                onCloseComplaint={handleOpenCloseConfirm}
                // neighborhoods={neighborhoods}
                notes={app.notes}
                statusReport={app.report_process_stage}
              />
            ))}
          </Box>
        )}

        {/* Damage Assessment Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
          disableScrollLock
          disableEscapeKeyDown
        >
          {selectedApplication && (
            <DamageAssessmentDialog
              onClose={handleDialogClose}
              readOnly={isReadOnly}
              initialData={selectedApplication}
              location={{
                position: [
                  selectedApplication?.latitude,
                  selectedApplication?.longitude,
                ],
                address: `${selectedApplication?.address}`,
                neighborhood_id: `${selectedApplication?.neighborhood_id}`,
                landmark: `${selectedApplication?.landmark}`,
              }}
            />
          )}
        </Dialog>

        {/* Complaint Dialog */}
        <ComplaintDialog
          open={complaintDialogOpen}
          onClose={handleCloseComplaintDialog}
          application={complaintApp}
        />

        <ConfirmDialog
          open={closeConfirmOpen}
          onClose={() => setCloseConfirmOpen(false)}
          onConfirm={handleConfirmCloseComplaint}
          title={t("complaint.close")}
          message={t("complaint.closeConfirm")}
          type="warning"
          loading={closingComplaint}
        />
        <CardContent
          sx={{
            p: 2,
            "&:last-child": { pb: 2 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            marginTop: "50px",
          }}
        >
          {/* Content */}
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#ECFDF5",
                boxShadow: "0 4px 8px rgba(0,0,0,0.04)",
                borderRight: language === "ar" ? "6px solid #10B981" : "none",
                borderLeft: language === "ar" ? "none" : "6px solid #10B981",
                mb: 2,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOnIcon sx={{ color: "#10B981", fontSize: 28 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "20px", sm: "25px" },
                      fontWeight: "bold",
                      color: "#047857",
                    }}
                  >
                    {t("citizen.currentLocation")}
                  </Typography>
                </Stack>
                <IconButton
                  onClick={handleOpenLocationDialog}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 2, borderColor: alpha("#10B981", 0.3) }} />

              <Typography sx={{ mb: 1 }}>
                <strong>{t("citizen.address")}:</strong>{" "}
                {citizenInfo?.current_location?.address || "-"}
              </Typography>

              {citizenInfo?.current_location && (
                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                  {citizenInfo.current_location.governorate && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "المحافظة" : "Governorate"}:
                      </strong>{" "}
                      {citizenInfo.current_location.governorate.name}
                    </Typography>
                  )}
                  {citizenInfo.current_location.municipality && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "البلدية" : "Municipality"}:
                      </strong>{" "}
                      {citizenInfo.current_location.municipality.name}
                    </Typography>
                  )}
                  {citizenInfo.current_location.neighborhood && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "الحي" : "Neighborhood"}:
                      </strong>{" "}
                      {citizenInfo.current_location.neighborhood.name}
                    </Typography>
                  )}
                  {citizenInfo.current_location.landmark && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        {language === "ar" ? "أقرب معلم" : "Landmark"}:
                      </strong>{" "}
                      {citizenInfo.current_location.landmark.name}
                    </Typography>
                  )}
                </Stack>
              )}

              <Typography>
                <strong>{t("citizen.addedDate")}:</strong>{" "}
                {citizenInfo?.current_location
                  ? formatDate(
                      new Date(citizenInfo.current_location.created_at),
                    )
                  : "-"}
                .
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon sx={{ ml: language === "ar" ? 1 : 0 }} />}
                onClick={handleOpenLocationDialog}
                sx={{
                  mt: 2,
                  alignSelf: "flex-start",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  bgcolor: "#10B981",
                  "&:hover": {
                    bgcolor: "#059669",
                    boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                  },
                }}
              >
                {t("citizen.editCurrentLocation")}
              </Button>
            </Stack>
          </Box>
        </CardContent>

        {/* Edit Current Location Dialog */}
        <Dialog
          open={locationDialogOpen}
          onClose={handleCloseLocationDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LocationOnIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                {t("citizen.editCurrentLocation")}
              </Typography>
            </Stack>
            <IconButton onClick={handleCloseLocationDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <RadioGroup
                row
                value={isInsideGaza ? "inside" : "outside"}
                onChange={(e) => setIsInsideGaza(e.target.value === "inside")}
                sx={{ justifyContent: "center", mb: 2 }}
              >
                <FormControlLabel
                  value="inside"
                  control={<Radio />}
                  label={t("map.insideGaza")}
                />
                <FormControlLabel
                  value="outside"
                  control={<Radio />}
                  label={t("map.outsideGaza")}
                />
              </RadioGroup>
            </Box>

            {isInsideGaza ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("map.currentLocationDescription")}
                </Typography>

                {/* Map Container */}
                <Box
                  sx={{
                    height: 350,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    mb: 3,
                  }}
                >
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    markerPosition={locationPosition}
                    setMarkerPosition={setLocationPosition}
                    height="100%"
                    width="100%"
                    setAddress={setLocationAddress}
                    location={{
                      neighborhood:
                        citizenInfo?.current_location?.neighborhood?.name,
                    }}
                  />
                </Box>

                {/* Location Info */}
                {locationPosition && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      mb: 2,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      useFlexGap={true}
                    >
                      <Box flex={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          {t("map.coordinates")}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          dir="ltr"
                        >
                          {locationPosition[0]?.toFixed(6)},{" "}
                          {locationPosition[1]?.toFixed(6)}
                        </Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          {t("map.address")}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {locationAddress}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}

                {/* Cascading Selection Dropdowns */}
                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    className="flex sm:gap-4"
                  >
                    <FormControl fullWidth size="small" required>
                      <InputLabel>
                        {language === "ar"
                          ? "اختر المحافظة"
                          : "Select Governorate"}
                      </InputLabel>
                      <Select
                        value={selectedGovernorateId}
                        label={
                          language === "ar"
                            ? "اختر المحافظة"
                            : "Select Governorate"
                        }
                        onChange={(e: any) => {
                          setSelectedGovernorateId(e.target.value as string);
                          setTargetNames(null);
                        }}
                      >
                        {governorates.map((g) => (
                          <MenuItem key={g.id} value={g.id}>
                            {g.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      size="small"
                      required
                      disabled={!selectedGovernorateId}
                    >
                      <InputLabel>
                        {language === "ar"
                          ? "اختر البلدية"
                          : "Select Municipality"}
                      </InputLabel>
                      <Select
                        value={selectedMunicipalityId}
                        label={
                          language === "ar"
                            ? "اختر البلدية"
                            : "Select Municipality"
                        }
                        onChange={(e: any) => {
                          setSelectedMunicipalityId(e.target.value as string);
                          setTargetNames(null);
                        }}
                      >
                        {municipalities.map((m) => (
                          <MenuItem key={m.id} value={m.id}>
                            {m.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    className="flex sm:gap-4"
                  >
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      disabled={!selectedMunicipalityId}
                    >
                      <InputLabel>
                        {language === "ar"
                          ? "اختر الحي"
                          : "Select Neighborhood"}
                      </InputLabel>
                      <Select
                        value={selectedNeighborhoodId}
                        label={
                          language === "ar"
                            ? "اختر الحي"
                            : "Select Neighborhood"
                        }
                        onChange={(e: any) => {
                          setSelectedNeighborhoodId(e.target.value as string);
                          setTargetNames(null);
                        }}
                      >
                        {neighborhoodLocations.map((n) => (
                          <MenuItem key={n.id} value={n.id}>
                            {n.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      size="small"
                      disabled={!selectedNeighborhoodId}
                    >
                      <InputLabel>
                        {language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
                      </InputLabel>
                      <Select
                        value={selectedLandmarkId}
                        label={
                          language === "ar" ? "أقرب معلم" : "Nearest Landmark"
                        }
                        onChange={(e: any) => {
                          setSelectedLandmarkId(e.target.value as string);
                          setTargetNames(null);
                        }}
                      >
                        {landmarks.map((lm: any) => (
                          <MenuItem key={lm.id} value={lm.id}>
                            {lm.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
              </>
            ) : (
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label={t("map.addressOutsideGaza")}
                  placeholder={t("map.addressOutsideGazaPlaceholder")}
                  value={outsideAddress}
                  onChange={(e) => setOutsideAddress(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              bgcolor: "background.default",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              sx={{ mx: 1 }}
              variant="outlined"
              onClick={handleCloseLocationDialog}
            >
              {t("common.cancel")}
            </Button>
            {isInsideGaza && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleResetLocation}
                disabled={!locationPosition}
                startIcon={
                  <RotateCcw
                    className={language === "ar" ? "ml-2" : "mr-2"}
                    size={18}
                  />
                }
              >
                {t("map.reset")}
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmLocationUpdate}
              disabled={
                !locationPosition ||
                !locationAddress ||
                locationLoading ||
                outsideAddress === ""
              }
              startIcon={
                locationLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Check
                    className={language === "ar" ? "ml-2" : "mr-2"}
                    size={18}
                  />
                )
              }
              sx={{
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              {locationLoading ? "" : t("common.save")}
            </Button>
          </DialogActions>
        </Dialog>
        <LanguageToggle />
      </Container>
    </Fade>
  );
};

export default MyApplications;
