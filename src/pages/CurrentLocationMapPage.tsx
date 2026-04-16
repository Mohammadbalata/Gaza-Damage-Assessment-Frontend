import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCcw, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateCurrentLocation } from "../redux/slices/locationSlice";
import { setCitizenInfo } from "../redux/slices/authSlice";
import { ROUTES } from "../routes/Routes";
import MapContainer from "../components/MapContainer";
import { usePut } from "../hooks/api/useApi";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { API } from "../constants/ApiRoutes";
import { api } from "../services/api";
import BackButton from "../components/Shared/BackButton";
import DamageAssessmentStepper from "../components/Shared/DamageAssessmentStepper";
import LanguageToggle from "../components/LanguageToggle";

// import { getReviewData } from "../utils/getReviewData";
// import { axiosClient } from "../api/baseUrl";

const CurrentLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { currentLocation } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const explorerCitizenInfo = useAppSelector((state) => state.auth.citizenInfo);
  const storedCitizenInfo = JSON.parse(localStorage.getItem("citizenInfo") || "{}");
  const initialLoc = explorerCitizenInfo?.current_location || storedCitizenInfo?.current_location;

  const [position, setPosition] = useState<[number, number] | null>(() => {
    if (currentLocation.currentLatitude && currentLocation.currentLongitude) {
      return [Number(currentLocation.currentLatitude), Number(currentLocation.currentLongitude)];
    }
    if (initialLoc?.latitude && initialLoc?.longitude) {
      return [Number(initialLoc.latitude), Number(initialLoc.longitude)];
    }
    return null;
  });

  const [address, setAddress] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // Selection States
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [neighborhoodLocations, setNeighborhoodLocations] = useState<any[]>([]);
  const [landmarks, setLandmarks] = useState<any[]>([]);

  // Local JSON Data for Sync
  const [localGovData, setLocalGovData] = useState<any[]>([]);
  const [localMuniData, setLocalMuniData] = useState<any[]>([]);
  const [localNhData, setLocalNhData] = useState<any[]>([]);
  const [localLmData, setLocalLmData] = useState<any[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [govLoading, setGovLoading] = useState(false);
  const [muniLoading, setMuniLoading] = useState(false);
  const [nhLoading, setNhLoading] = useState(false);
  const [lmLoading, setLmLoading] = useState(false);

  const [targetNames, setTargetNames] = useState<{
    governorate: string;
    municipality: string;
    neighborhood: string;
    landmark: string;
  } | null>(null);

  const [selectedGovernorateId, setSelectedGovernorateId] = useState<string>(
    (initialLoc?.governorate_id || initialLoc?.governorate?.id)?.toString() || ""
  );
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>(
    (initialLoc?.municipality_id || initialLoc?.municipality?.id)?.toString() || ""
  );
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(
    (initialLoc?.neighborhood_id || initialLoc?.neighborhood?.id)?.toString() || ""
  );
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>(
    (initialLoc?.landmark_id || initialLoc?.landmark?.id)?.toString() || ""
  );
  const [isInsideGaza, setIsInsideGaza] = useState<boolean>(
    initialLoc?.accommodation_type === "outside_gaza" ? false : true
  );
  const [outsideAddress, setOutsideAddress] = useState<string>(
    initialLoc?.accommodation_type === "outside_gaza" 
      ? initialLoc?.address || "" 
      : ""
  );

  // Sync effect to ensure IDs and position are populated if they arrive late
  useEffect(() => {
    if (initialLoc) {
      if (!selectedGovernorateId) {
        setSelectedGovernorateId((initialLoc.governorate_id || initialLoc.governorate?.id)?.toString() || "");
        setSelectedMunicipalityId((initialLoc.municipality_id || initialLoc.municipality?.id)?.toString() || "");
        setSelectedNeighborhoodId((initialLoc.neighborhood_id || initialLoc.neighborhood?.id)?.toString() || "");
        setSelectedLandmarkId((initialLoc.landmark_id || initialLoc.landmark?.id)?.toString() || "");
      }
      
      if (!position && initialLoc.latitude && initialLoc.longitude) {
        const lat = Number(initialLoc.latitude);
        const lng = Number(initialLoc.longitude);
        setPosition([lat, lng]);
        setCenter([lat, lng]);
        setZoom(16);
      }

      if (initialLoc.accommodation_type === "outside_gaza") {
        setIsInsideGaza(false);
        setOutsideAddress(initialLoc.address || "");
      }
    }
  }, [initialLoc]);

  // Map Navigation state (keep original map)
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const [center, setCenter] = useState<[number, number]>(
    position || defaultCenter,
  );
  const [zoom, setZoom] = useState<number>(position ? 16 : 13);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasInteractedWithMap, setHasInteractedWithMap] = useState(false);
 const { search } = useLocation();
   const query = new URLSearchParams(search);
   const isEditCurrentLocationPage = Boolean(query.get("edit"));
     

  // Load Data
  useEffect(() => {
    const loadAllData = async () => {
      setGovLoading(true);
      setLoadingLocal(true);
      try {
        const [
          govLocalRes,
          muniLocalRes,
          nhLocalRes,
          lmLocalRes,
          govBackendRes,
        ] = await Promise.all([
          fetch("/Governorates.json"),
          fetch("/Municipalitys.json"),
          fetch("/Neighborhoods.json"),
          fetch("/Landmarks.json"),
          api
            .get("/locations/governorates")
            .catch(() => ({ data: { governorates: [] } })),
        ]);

        const govL = await govLocalRes.json();
        const muniL = await muniLocalRes.json();
        const nhL = await nhLocalRes.json();
        const lmL = await lmLocalRes.json();

        if (govL.features) setLocalGovData(govL.features);
        if (muniL.features) setLocalMuniData(muniL.features);
        if (nhL.features) setLocalNhData(nhL.features);
        if (lmL.features) setLocalLmData(lmL.features);

        if (govBackendRes.data.governorates)
          setGovernorates(govBackendRes.data.governorates);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoadingLocal(false);
        setGovLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Normalization and Match Helpers
  const normalizeText = (text: string) => {
    if (!text) return "";
    return text
      .toString()
      .trim()
      .replace(/[\uFEFF\u200B\u200C\u200D\u0640]/g, "") // Added \u0640 (Tatweel)
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/^(محافظه|بلديه|حي|قريه|مخيم)\s+/g, "")
      .replace(/\s+/g, "");
  };

  const GOV_MAPPING: Record<string, string> = {
    الشمال: "شمال غزة",
    "شمال غزة": "شمال غزة",
    "دير البلح": "الوسطى",
    "دير البلح - الوسطى": "الوسطى",
    الوسطى: "الوسطى",
    غزة: "غزة",
    "خان يونس": "خان يونس",
    رفح: "رفح",
  };

  const isPointInPolygon = (point: [number, number], vs: number[][][]) => {
    const x = point[1],
      y = point[0]; // lng, lat
    let inside = false;
    const polygon = vs[0]; // First ring
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const findMatch = (list: any[], nameToFind: string) => {
    if (!nameToFind || !list || list.length === 0) return null;
    const normalizedToFind = normalizeText(nameToFind);

    let match = list.find(
      (item) => item && normalizeText(item.name) === normalizedToFind,
    );

    if (!match) {
      match = list.find((item) => {
        if (!item || !item.name) return false;
        const normalizedItem = normalizeText(item.name);
        return (
          normalizedItem.includes(normalizedToFind) ||
          normalizedToFind.includes(normalizedItem)
        );
      });
    }
    return match;
  };

  // Find reverse lookup names from local JSON when map clicked
  useEffect(() => {
    if (position && (localLmData.length > 0 || localGovData.length > 0) && hasInteractedWithMap) {
      // 1. Find Governorate by Polygon
      let govNameFound = "";
      for (const feature of localGovData) {
        if (feature.geometry?.type === "Polygon") {
          if (isPointInPolygon(position, feature.geometry.coordinates)) {
            govNameFound =
              feature.properties.Name ||
              feature.properties.المحافظة ||
              feature.properties.Governorat ||
              feature.properties.المحا;
            break;
          }
        }
      }

      // 2. Find Municipality by Polygon
      let muniNameFound = "";
      for (const feature of localMuniData) {
        if (feature.geometry?.type === "Polygon") {
          if (isPointInPolygon(position, feature.geometry.coordinates)) {
            muniNameFound =
              feature.properties.Mun_Name ||
              feature.properties.البلدية ||
              feature.properties.Municipali ||
              feature.properties.البلد;
            if (!govNameFound) govNameFound = feature.properties.المحا;
            break;
          }
        }
      }

      // 3. Find Neighborhood by Polygon
      let nhNameFound = "";
      for (const feature of localNhData) {
        if (feature.geometry?.type === "Polygon") {
          if (isPointInPolygon(position, feature.geometry.coordinates)) {
            nhNameFound =
              feature.properties.الحي ||
              feature.properties.Neighborho ||
              feature.properties.name;
            if (!muniNameFound) muniNameFound = feature.properties.البلد;
            if (!govNameFound) govNameFound = feature.properties.المحا;
            break;
          }
        }
      }

      // 4. Find nearest landmark
      let minDistance = Infinity;
      let nearestLandmark: any = null;
      localLmData.forEach((f: any) => {
        if (!f.geometry || !f.geometry.coordinates) return;
        const [lLng, lLat] = f.geometry.coordinates;
        const dist =
          Math.pow(position[0] - lLat, 2) + Math.pow(position[1] - lLng, 2);
        if (dist < minDistance) {
          minDistance = dist;
          nearestLandmark = f;
        }
      });

      let lmNameFound = "";
      if (nearestLandmark && minDistance < 0.0005) {
        lmNameFound =
          nearestLandmark.properties.اسم_المعلم ||
          nearestLandmark.properties.name ||
          nearestLandmark.properties.Landmark;

        // Contextual Fallbacks
        if (!govNameFound)
          govNameFound =
            nearestLandmark.properties.المحافظة ||
            nearestLandmark.properties.Governorat ||
            nearestLandmark.properties.المحا;
        if (!muniNameFound)
          muniNameFound =
            nearestLandmark.properties.البلدية ||
            nearestLandmark.properties.Municipali ||
            nearestLandmark.properties.البلد;
        if (!nhNameFound)
          nhNameFound =
            nearestLandmark.properties.الحي ||
            nearestLandmark.properties.Neighborho;
      }

      setIsSyncing(true);
      setTargetNames({
        governorate: govNameFound,
        municipality: muniNameFound,
        neighborhood: nhNameFound,
        landmark: lmNameFound,
      });
    }
  }, [position, localLmData, localGovData, localMuniData, localNhData]);

  // Sync targetNames with IDs (Cascading)
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
      setMuniLoading(true);
      api
        .get("/locations/municipalities", {
          params: { governorate_id: selectedGovernorateId },
        })
        .then((res: any) => {
          setMunicipalities(res.data.municipalities || []);
          if (targetNames && !targetNames.municipality) {
            setNeighborhoodLocations([]);
            setLandmarks([]);
            setSelectedMunicipalityId("");
            setSelectedNeighborhoodId("");
            setSelectedLandmarkId("");
          }
        })
        .catch((err) => console.error("Error fetching municipalities:", err))
        .finally(() => setMuniLoading(false));
    } else {
      setMunicipalities([]);
    }
  }, [selectedGovernorateId]);

  // Fetch neighborhoods when municipality changes
  useEffect(() => {
    if (selectedMunicipalityId) {
      setNhLoading(true);
      api
        .get("/locations/neighborhoods", {
          params: { municipality_id: selectedMunicipalityId },
        })
        .then((res: any) => {
          setNeighborhoodLocations(res.data.neighborhoods || []);
          if (targetNames && !targetNames.neighborhood) {
            setLandmarks([]);
            setSelectedNeighborhoodId("");
            setSelectedLandmarkId("");
          }
        })
        .catch((err) => console.error("Error fetching neighborhoods:", err))
        .finally(() => setNhLoading(false));
    } else {
      setNeighborhoodLocations([]);
    }
  }, [selectedMunicipalityId]);

  // Fetch landmarks when neighborhood changes
  useEffect(() => {
    if (selectedNeighborhoodId) {
      setLmLoading(true);
      api
        .get("/locations/landmarks", {
          params: { neighborhood_id: selectedNeighborhoodId },
        })
        .then((res: any) => {
          setLandmarks(res.data.landmarks || []);
          if (targetNames && !targetNames.landmark) {
            setSelectedLandmarkId("");
          }
        })
        .catch((err) => console.error("Error fetching landmarks:", err))
        .finally(() => setLmLoading(false));
    } else {
      setLandmarks([]);
    }
  }, [selectedNeighborhoodId]);
 
  // Unified Sync Completion Watcher
  useEffect(() => {
    if (isSyncing) {
      if (targetNames && !govLoading && !muniLoading && !nhLoading && !lmLoading) {
        const timer = setTimeout(() => {
          setIsSyncing(false);
        }, 500); 
        return () => clearTimeout(timer);
      }
    }
  }, [isSyncing, targetNames, govLoading, muniLoading, nhLoading, lmLoading]);

  // Sync center with position on initial load or landmark/reset selection
  useEffect(() => {
    if (position) {
      setCenter(position);
    }
  }, [position]);

  // Selection Handlers
  const handleGovernorateChange = (event: any) => {
    const val = event.target.value;
    setSelectedGovernorateId(val);
    setTargetNames(null); // Clear target names on manual change to avoid fighting

    const gov = governorates.find((g) => g.id.toString() === val.toString());
    if (gov) {
      const lat = parseFloat(gov.latitude);
      const lng = parseFloat(gov.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setZoom(11);
      }
    }
  };

  const handleMunicipalityChange = (event: any) => {
    const val = event.target.value;
    setSelectedMunicipalityId(val);
    setTargetNames(null);

    const muni = municipalities.find((m) => m.id.toString() === val.toString());
    if (muni) {
      const lat = parseFloat(muni.latitude);
      const lng = parseFloat(muni.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setZoom(13);
      }
    }
  };

  // Handle Neighborhood Change
  const handleNeighborhoodChange = (event: any) => {
    const neighborhoodId = event.target.value;
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedLandmarkId(""); // Reset landmark when neighborhood changes
    setTargetNames(null);

    // Find neighborhood coordinates to center map
    const neighborhood = neighborhoodLocations.find(
      (n) => n?.id?.toString() === neighborhoodId?.toString(),
    );
    if (neighborhood) {
      const lat = parseFloat(neighborhood.latitude);
      const lng = parseFloat(neighborhood.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setZoom(15);
      }
    }
  };

  // Handle Landmark Change
  const handleLandmarkChange = (event: any) => {
    const landmarkId = event.target.value;
    setSelectedLandmarkId(landmarkId);
    setTargetNames(null);

    const landmark = landmarks.find(
      (l) => l.id.toString() === landmarkId.toString(),
    );
    if (landmark) {
      const lat = parseFloat(landmark.latitude);
      const lng = parseFloat(landmark.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setZoom(18);
      }
    }
  };

  const { loading, execute } = usePut(`${API.citizen.locations.current}`, {
    onSuccess: (data: any) => {
      // Update local storage and redux state with the new location info
      console.log("data", data);
      const currentCitizenInfo = JSON.parse(
        localStorage.getItem("citizenInfo") || "{}",
      );
      const updatedCitizenInfo = {
        ...currentCitizenInfo,
        current_location: data.citizen.current_location || {
          latitude: position?.[0],
          longitude: position?.[1],
          address: address,
        },
      };

      localStorage.setItem("citizenInfo", JSON.stringify(updatedCitizenInfo));
      dispatch(setCitizenInfo(updatedCitizenInfo));

      navigate(`${ROUTES.CITIZEN_DASHBOARD}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (position) {
      // Reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "Location selected");
        })
        .catch(() => {
          setAddress(
            `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`,
          );
        });
    }
  }, [position]);

  const handleReset = () => {
    setPosition(null);
    setAddress("");
    setTargetNames(null);
    setSelectedGovernorateId("");
    setSelectedMunicipalityId("");
    setSelectedNeighborhoodId("");
    setSelectedLandmarkId("");
    setIsInsideGaza(true);
    setOutsideAddress("");
    setCenter(defaultCenter);
    setZoom(13);
  };

  const getGovernorateName = (id: string) => {
    const gov = governorates.find((g) => g.id.toString() === id.toString());
    return gov ? gov.name : "";
  };

  const getMunicipalityName = (id: string) => {
    const muni = municipalities.find((m) => m.id.toString() === id.toString());
    return muni ? muni.name : "";
  };

  const getNeighborhoodName = (id: string) => {
    const neighborhood = neighborhoodLocations.find(
      (n) => n.id.toString() === id.toString(),
    );
    return neighborhood ? neighborhood.name : "";
  };

  const getLandmarkName = (id: string) => {
    const landmark = landmarks.find((l) => l.id.toString() === id.toString());
    return landmark ? landmark.name : "";
  };

  const handleConfirm = () => {
    if (isInsideGaza) {
      // Validate all required fields
      const isLocationValid = 
        position && 
        address && 
        address !== "لا يوجد اتصال في الانترنت" &&
        selectedGovernorateId && 
        selectedMunicipalityId && 
        selectedNeighborhoodId;

      if (!isLocationValid) {
        setOpenDialog(true);
        return;
      }

      if (position) {
        const finalAddress =
          address ||
          `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`;

        const fullAddressParts = [
          getGovernorateName(selectedGovernorateId),
          getMunicipalityName(selectedMunicipalityId),
          getNeighborhoodName(selectedNeighborhoodId),
          getLandmarkName(selectedLandmarkId),
          finalAddress,
        ].filter(Boolean);

        const currentLocAddress = fullAddressParts.join(" - ");

        dispatch(
          updateCurrentLocation({
            currentLocation: {
              currentLatitude: position[0],
              currentLongitude: position[1],
              currentLocationAddress: currentLocAddress,
            },
          }),
        );

        execute({
          accommodation_type: "inside_gaza",
          latitude: position[0].toString(),
          longitude: position[1].toString(),
          address: finalAddress,
          governorate_id: selectedGovernorateId
            ? Number(selectedGovernorateId)
            : null,
          municipality_id: selectedMunicipalityId
            ? Number(selectedMunicipalityId)
            : null,
          neighborhood_id: selectedNeighborhoodId
            ? Number(selectedNeighborhoodId)
            : null,
          landmark_id: selectedLandmarkId ? Number(selectedLandmarkId) : null,
        });
      }
    } else {
      // Outside Gaza
      if (outsideAddress.trim()) {
        dispatch(
          updateCurrentLocation({
            currentLocation: {
              currentLatitude: 0,
              currentLongitude: 0,
              currentLocationAddress: outsideAddress,
            },
          }),
        );

        execute({
          accommodation_type: "outside_gaza",
          address: outsideAddress,
        });
      }
    }
  };

  console.log(outsideAddress);
  if (loadingLocal) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {!isEditCurrentLocationPage && <DamageAssessmentStepper
            activeStep={3}
            step1Completed={true}
            step2Completed={true}
            step3Completed={true}
          />}
          <Box
            sx={{
              mb: 3,
              textAlign: "center",
              // display: "flex",
              // flexDirection: { xs: "column", sm: "row" },
              // alignItems: "center",
              // justifyContent: "space-between",
              // gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h2"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                {!isEditCurrentLocationPage ? t("map.currentLocation") : t("map.editCurrentLocation") }
                
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("map.currentLocationDescription")}
              </Typography>
            </Box>
          </Box>

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
                      onChange={handleGovernorateChange}
                      endAdornment={
                        govLoading ? (
                          <CircularProgress size={20} sx={{ mr: 4 }} />
                        ) : null
                      }
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
                      onChange={handleMunicipalityChange}
                      endAdornment={
                        muniLoading ? (
                          <CircularProgress size={20} sx={{ mr: 4 }} />
                        ) : null
                      }
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
                      {language === "ar" ? "اختر الحي" : "Select Neighborhood"}
                    </InputLabel>
                    <Select
                      value={selectedNeighborhoodId}
                      label={
                        language === "ar" ? "اختر الحي" : "Select Neighborhood"
                      }
                      onChange={handleNeighborhoodChange}
                      endAdornment={
                        nhLoading ? (
                          <CircularProgress size={20} sx={{ mr: 4 }} />
                        ) : null
                      }
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
                      onChange={handleLandmarkChange}
                      endAdornment={
                        lmLoading ? (
                          <CircularProgress size={20} sx={{ mr: 4 }} />
                        ) : null
                      }
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

              <Box
                sx={{
                  height: 400,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 3,
                  position: "relative",
                }}
              >
                <MapContainer
                  center={center}
                  zoom={zoom}
                  markerPosition={position}
                  setMarkerPosition={(pos) => {
                    setPosition(pos);
                    setHasInteractedWithMap(true);
                  }}
                  height="100%"
                  width="100%"
                  setAddress={setAddress}
                  isLoading={isSyncing}
                  openDialog={openDialog}
                  setOpenDialog={setOpenDialog}
                  setZoom={setZoom}
                  location={{
                    position,
                    address,
                    governorate_id: selectedGovernorateId,
                    municipality_id: selectedMunicipalityId,
                    neighborhood_id: selectedNeighborhoodId,
                    landmark_id: selectedLandmarkId,
                    governorate: getGovernorateName(selectedGovernorateId),
                    municipality: getMunicipalityName(selectedMunicipalityId),
                    neighborhood: getNeighborhoodName(selectedNeighborhoodId),
                    landmark: getLandmarkName(selectedLandmarkId),
                  }}
                />
              </Box>

              {position && (
                <Box
                  sx={{
                    mb: 4,
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box flex={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        {t("map.coordinates")}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" dir="ltr">
                        {position[0].toFixed(6)}, {position[1].toFixed(6)}
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
                      <Typography variant="body1" fontWeight="medium">
                        {address}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
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

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems="stretch"
            useFlexGap={true}
          >
            <BackButton
              language={language}
              to={ROUTES.CITIZEN_DASHBOARD}
              sx={{
                mt: 0,
                background: "white",
                borderRadius: 2,
                color: "#1976d2",
                bgcolor: "#f1f5f9",
                transition: "background-color 0.3s",
                "&:hover": { bgcolor: "white" },
              }}
            />

            <Button
              color="inherit"
              onClick={handleReset}
              disabled={!position}
              startIcon={
                <RotateCcw
                  className={language === "ar" ? "ml-2" : "mr-2"}
                  size={18}
                />
              }
              sx={{ flex: 1, height: 48 }}
              variant="outlined"
            >
              {t("map.reset")}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={
                loading ||
                (!isInsideGaza && !outsideAddress.trim())
              }
              startIcon={
                !loading && (
                  <Check
                    className={language === "ar" ? "ml-2" : "mr-2"}
                    size={18}
                  />
                )
              }
              sx={{ flex: 1, height: 48 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("map.confirm")
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <LanguageToggle />
    </Container>
  );
};

export default CurrentLocationMapPage;
