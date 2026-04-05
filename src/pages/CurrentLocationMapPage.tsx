import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { API } from "../constants/ApiRoutes";
import { api } from "../services/api";
import BackButton from "../components/Shared/BackButton";

// import { getReviewData } from "../utils/getReviewData";
// import { axiosClient } from "../api/baseUrl";

const CurrentLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { currentLocation } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>(
    currentLocation.currentLatitude && currentLocation.currentLongitude
      ? [
          Number(currentLocation.currentLatitude),
          Number(currentLocation.currentLongitude),
        ]
      : null,
  );
  const [address, setAddress] = useState("");

  // Selection States
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

  const [selectedGovernorateId, setSelectedGovernorateId] = useState<string>("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>("");
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>("");

  // Map Navigation state (keep original map)
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const [center, setCenter] = useState<[number, number]>(
    position || defaultCenter,
  );
  const [zoom, setZoom] = useState<number>(position ? 16 : 13);

  // Load Landmarks.json for reverse lookup
  useEffect(() => {
    fetch("/Landmarks.json")
      .then(res => res.json())
      .then(data => {
        if (data.features) setLandmarksData(data.features);
      })
      .catch(err => console.error("Error loading Landmarks.json:", err));
  }, []);

  // Initial load: Fetch governorates
  useEffect(() => {
    api.get("/locations/governorates")
      .then((res: any) => {
        setGovernorates(res.data.governorates || []);
      })
      .catch((err) => console.error("Error fetching governorates:", err));
  }, []);

  // Normalization and Match Helpers
  const normalizeText = (text: string) => {
    if (!text) return "";
    return text.trim()
      .replace(/[\uFEFF\u200B\u200C\u200D]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/\s+/g, "");
  };

  const GOV_MAPPING: Record<string, string> = {
    "الشمال": "شمال غزة",
    "دير البلح - الوسطى": "دير البلح",
    "الوسطى": "دير البلح",
  };

  const findMatch = (list: any[], nameToFind: string) => {
    if (!nameToFind || !list) return null;
    const normalizedToFind = normalizeText(nameToFind);
    let match = list.find(item => normalizeText(item.name) === normalizedToFind);
    if (!match) {
      match = list.find(item => 
        normalizeText(item.name).includes(normalizedToFind) || 
        normalizedToFind.includes(normalizeText(item.name))
      );
    }
    return match;
  };

  // Find nearest landmark when position changes (from map click)
  useEffect(() => {
    if (position && landmarksData.length > 0) {
      let minDistance = Infinity;
      let nearest: any = null;

      landmarksData.forEach((f: any) => {
        if (!f.geometry || !f.geometry.coordinates) return;
        const [lLng, lLat] = f.geometry.coordinates;
        const dist = Math.pow(position[0] - lLat, 2) + Math.pow(position[1] - lLng, 2);
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
          landmark: props.اسم_المعلم || ""
        });
      }
    }
  }, [position, landmarksData]);

  // Sync targetNames with IDs (Cascading)
  useEffect(() => {
    if (targetNames && governorates.length > 0) {
      const match = findMatch(governorates, GOV_MAPPING[targetNames.governorate] || targetNames.governorate);
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
      api.get("/locations/municipalities", { params: { governorate_id: selectedGovernorateId } })
        .then((res: any) => {
          setMunicipalities(res.data.municipalities || []);
          setNeighborhoodLocations([]);
          setLandmarks([]);
          setSelectedMunicipalityId("");
          setSelectedNeighborhoodId("");
          setSelectedLandmarkId("");
        })
        .catch((err) => console.error("Error fetching municipalities:", err));
    } else {
      setMunicipalities([]);
    }
  }, [selectedGovernorateId]);

  // Fetch neighborhoods when municipality changes
  useEffect(() => {
    if (selectedMunicipalityId) {
      api.get("/locations/neighborhoods", { params: { municipality_id: selectedMunicipalityId } })
        .then((res: any) => {
          setNeighborhoodLocations(res.data.neighborhoods || []);
          setLandmarks([]);
          setSelectedNeighborhoodId("");
          setSelectedLandmarkId("");
        })
        .catch((err) => console.error("Error fetching neighborhoods:", err));
    } else {
      setNeighborhoodLocations([]);
    }
  }, [selectedMunicipalityId]);

  // Fetch landmarks when neighborhood changes
  useEffect(() => {
    if (selectedNeighborhoodId) {
      api.get("/locations/landmarks", { params: { neighborhood_id: selectedNeighborhoodId } })
        .then((res: any) => {
          setLandmarks(res.data.landmarks || []);
          setSelectedLandmarkId("");
        })
        .catch((err) => console.error("Error fetching landmarks:", err));
    } else {
      setLandmarks([]);
    }
  }, [selectedNeighborhoodId]);

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

    const landmark = landmarks.find((l) => l.id.toString() === landmarkId.toString());
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
      const currentCitizenInfo = JSON.parse(localStorage.getItem("citizenInfo") || "{}");
      const updatedCitizenInfo = {
        ...currentCitizenInfo,
        current_location: data || { 
          latitude: position?.[0], 
          longitude: position?.[1],
          address: address
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
    api
      .get(`/neighborhoods`)
      .then((res: any) => {
        setNeighborhoodLocations(res.data.neighborhoods || []);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

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
    setSelectedGovernorateId("");
    setSelectedMunicipalityId("");
    setSelectedNeighborhoodId("");
    setSelectedLandmarkId("");
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
    if (position) {
      const finalAddress = address || `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`;
      
      const fullAddressParts = [
        getGovernorateName(selectedGovernorateId),
        getMunicipalityName(selectedMunicipalityId),
        getNeighborhoodName(selectedNeighborhoodId),
        getLandmarkName(selectedLandmarkId),
        finalAddress
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
        latitude: position[0].toString(),
        longitude: position[1].toString(),
        address: finalAddress,
        governorate_id: selectedGovernorateId ? Number(selectedGovernorateId) : null,
        municipality_id: selectedMunicipalityId ? Number(selectedMunicipalityId) : null,
        neighborhood_id: selectedNeighborhoodId ? Number(selectedNeighborhoodId) : null,
        landmark_id: selectedLandmarkId ? Number(selectedLandmarkId) : null,
      });
    }
  };

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
                {t("map.currentLocation")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("map.currentLocationDescription")}
              </Typography>
            </Box>
          </Box>

          <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="flex sm:gap-4">
              <FormControl fullWidth size="small" required>
                <InputLabel>
                  {language === "ar" ? "اختر المحافظة" : "Select Governorate"}
                </InputLabel>
                <Select
                  value={selectedGovernorateId}
                  label={language === "ar" ? "اختر المحافظة" : "Select Governorate"}
                  onChange={handleGovernorateChange}
                >
                  {governorates.map((g) => (
                    <MenuItem key={g.id} value={g.id}>
                      {g.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" required disabled={!selectedGovernorateId}>
                <InputLabel>
                  {language === "ar" ? "اختر البلدية" : "Select Municipality"}
                </InputLabel>
                <Select
                  value={selectedMunicipalityId}
                  label={language === "ar" ? "اختر البلدية" : "Select Municipality"}
                  onChange={handleMunicipalityChange}
                >
                  {municipalities.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="flex sm:gap-4">
              <FormControl fullWidth size="small" required disabled={!selectedMunicipalityId}>
                <InputLabel>
                  {language === "ar" ? "اختر الحي" : "Select Neighborhood"}
                </InputLabel>
                <Select
                  value={selectedNeighborhoodId}
                  label={language === "ar" ? "اختر الحي" : "Select Neighborhood"}
                  onChange={handleNeighborhoodChange}
                >
                  {neighborhoodLocations.map((n) => (
                    <MenuItem key={n.id} value={n.id}>
                      {n.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" disabled={!selectedNeighborhoodId}>
                <InputLabel>
                  {language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
                </InputLabel>
                <Select
                  value={selectedLandmarkId}
                  label={language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
                  onChange={handleLandmarkChange}
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
              setMarkerPosition={setPosition}
              height="100%"
              width="100%"
              setAddress={setAddress}
              location={{
                neighborhood_id: selectedNeighborhoodId,
                neighborhood: getNeighborhoodName(selectedNeighborhoodId),
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
                !position ||
                loading ||
                !address ||
                address === "لا يوجد اتصال في الانترنت"
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
    </Container>
  );
};

export default CurrentLocationMapPage;
