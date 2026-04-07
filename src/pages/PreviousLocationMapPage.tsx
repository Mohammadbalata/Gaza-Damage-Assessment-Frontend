import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch } from "../hooks/redux";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { setError } from "../redux/slices/damageSlice";
import { ROUTES } from "../routes/Routes";
import DamageAssessmentDialog from "./DamageAssessmentDialog";
import ArcGISMapContainer from "../components/MapContainer.v2";
import { axiosClient } from "../api/baseUrl";
import { API } from "../constants/ApiRoutes";

const PreviousLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();

  // Data States
  const [landmarksData, setLandmarksData] = useState<any[]>([]);
  const [neighborhoodsData, setNeighborhoodsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Backend ID Mapping States
  const [governoratesList, setGovernoratesList] = useState<any[]>([]);
  const [allMunicipalities, setAllMunicipalities] = useState<any[]>([]);
  const [allNeighborhoods, setAllNeighborhoods] = useState<any[]>([]);
  const [allLandmarks, setAllLandmarks] = useState<any[]>([]);
  
  const [govLoading, setGovLoading] = useState(false);
  const [muniLoading, setMuniLoading] = useState(false);
  const [nhLoading, setNhLoading] = useState(false);
  const [lmLoading, setLmLoading] = useState(false);

  // Selection States
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [selectedNeighborhoodName, setSelectedNeighborhoodName] = useState<string>("");
  const [selectedLandmarkName, setSelectedLandmarkName] = useState<string>("");

  // Map States
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const defaultCenter: [number, number] = [31.5017, 34.4668];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState<number>(12);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [lmRes, nhRes, govRes] = await Promise.all([
          fetch("/Landmarks.json"),
          fetch("/Neighborhood.json"),
          axiosClient.get(API.locations.governorates).catch(() => ({ data: { governorates: [] } }))
        ]);
        const lmData = await lmRes.json();
        const nhData = await nhRes.json();
        
        if (lmData.features) setLandmarksData(lmData.features);
        if (nhData.features) setNeighborhoodsData(nhData.features);
        if (govRes.data.governorates) setGovernoratesList(govRes.data.governorates);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
        setGovLoading(false);
      }
    };
    setGovLoading(true);
    loadData();
  }, []);

  useEffect(() => {
    if (selectedGovernorate) {
      const gov = findMatch(governoratesList, GOV_MAPPING[selectedGovernorate] || selectedGovernorate);
      console.log(gov.id)
      if (gov) {
        setMuniLoading(true);
        axiosClient.get(API.locations.municipalities, { params: { governorate_id: gov.id } })
          .then((res: any) => setAllMunicipalities(res.data.municipalities || []))
          .catch(() => {})
          .finally(() => setMuniLoading(false));
      }
    }
  }, [selectedGovernorate, governoratesList]);

  useEffect(() => {
    if (selectedMunicipality && allMunicipalities.length > 0) {
      const muni = findMatch(allMunicipalities, selectedMunicipality);
      console.log(muni)
      if (muni) {
        setNhLoading(true);
        axiosClient.get(API.locations.neighborhoods, { params: { municipality_id: muni.id } })
          .then((res: any) => setAllNeighborhoods(res.data.neighborhoods || []))
          .catch(() => {})
          .finally(() => setNhLoading(false));
      }
    }
  }, [selectedMunicipality, allMunicipalities]);

  useEffect(() => {
    if (selectedNeighborhoodName && allNeighborhoods.length > 0) {
      const nh = findMatch(allNeighborhoods, selectedNeighborhoodName);
      if (nh) {
        setLmLoading(true);
        axiosClient.get(API.locations.landmarks, { params: { neighborhood_id: nh.id } })
          .then((res: any) => setAllLandmarks(res.data.landmarks || []))
          .catch(() => {})
          .finally(() => setLmLoading(false));
      }
    }
  }, [selectedNeighborhoodName, allNeighborhoods]);

  const normalizeText = (text: string) => {
    if (!text) return "";
    return text.toString().trim()
      .replace(/[\uFEFF\u200B\u200C\u200D]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/^(محافظه|بلديه|حي|قريه|مخيم)\s+/g, "")
      .replace(/\s+/g, "");
  };

  const GOV_MAPPING: Record<string, string> = {
    "شمال غزة": "شمال غزة",
    "الوسطى": "الوسطى",
    
  };

  const findMatch = (list: any[], nameToFind: string) => {
    if (!nameToFind || !list || list.length === 0) return null;
    const normalizedToFind = normalizeText(nameToFind);
    
    let match = list.find(item => item && normalizeText(item.name) === normalizedToFind);
    
    if (!match) {
      match = list.find(item => {
        if (!item || !item.name) return false;
        const normalizedItem = normalizeText(item.name);
        return normalizedItem.includes(normalizedToFind) || normalizedToFind.includes(normalizedItem);
      });
    }
    return match;
  };

  const isPointInPolygon = (point: [number, number], vs: number[][][]) => {
    const x = point[1], y = point[0]; // lng, lat
    let inside = false;
    const polygon = vs[0]; // First ring
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Resolved IDs for submission
  const resolvedIds = useMemo(() => {
    const gov = findMatch(governoratesList, selectedGovernorate);
    const muni = findMatch(allMunicipalities, selectedMunicipality);
    const nh = findMatch(allNeighborhoods, selectedNeighborhoodName);
    const lm = findMatch(allLandmarks, selectedLandmarkName);

    return {
      governorate_id: gov?.id || null,
      municipality_id: muni?.id || null,
      neighborhood_id: nh?.id || null,
      landmark_id: lm?.id || null,
    };
  }, [selectedGovernorate, selectedMunicipality, selectedNeighborhoodName, selectedLandmarkName, governoratesList, allMunicipalities, allNeighborhoods, allLandmarks]);

  // Derived Options from Backend Data
  const governorates = useMemo(() => {
    return governoratesList.map(g => g.name).sort();
  }, [governoratesList]);

  const municipalities = useMemo(() => {
    return allMunicipalities.map(m => m.name).sort();
  }, [allMunicipalities]);

  const neighborhoods = useMemo(() => {
    return allNeighborhoods.map(n => n.name).sort();
  }, [allNeighborhoods]);

  const landmarks = useMemo(() => {
    return allLandmarks.map(l => ({
      name: l.name,
      id: l.id
    })).sort((a,b) => a.name.localeCompare(b.name));
  }, [allLandmarks]);


  // Handle Changes
  const handleGovernorateChange = (event: any) => {
    const name = event.target.value;
    setSelectedGovernorate(name);
    setSelectedMunicipality("");
    setSelectedNeighborhoodName("");
    setSelectedLandmarkName("");
    
    if (name) {
      const govLandmarks = landmarksData.filter(f => f.properties.المحافظة === name);
      if (govLandmarks.length > 0) {
        const first = govLandmarks[0];
        setCenter([first.geometry.coordinates[1], first.geometry.coordinates[0]]);
        setZoom(11);
      }
    }
  };

  const handleMunicipalityChange = (event: any) => {
    const name = event.target.value;
    setSelectedMunicipality(name);
    setSelectedNeighborhoodName("");
    setSelectedLandmarkName("");
    
    if (name) {
      const muniLandmarks = landmarksData.filter(f => f.properties.البلدية === name);
      if (muniLandmarks.length > 0) {
        const first = muniLandmarks[0];
        setCenter([first.geometry.coordinates[1], first.geometry.coordinates[0]]);
        setZoom(13);
      }
    }
  };

  const handleNeighborhoodChange = (event: any) => {
    const name = event.target.value;
    setSelectedNeighborhoodName(name);
    setSelectedLandmarkName("");
    
    const neighborhoodLandmarks = landmarksData.filter(f => f.properties.الحي === name);
    if (neighborhoodLandmarks.length > 0) {
      const first = neighborhoodLandmarks[0];
      setCenter([first.geometry.coordinates[1], first.geometry.coordinates[0]]);
      setZoom(15);
    }
  };

  const handleLandmarkChange = (event: any) => {
    const name = event.target.value;
    setSelectedLandmarkName(name);
    
    const landmarkFeature = landmarksData.find(f => f.properties.اسم_المعلم === name || f.properties.Landmark === name);
    if (landmarkFeature && landmarkFeature.geometry) {
      const coords: [number, number] = [landmarkFeature.geometry.coordinates[1], landmarkFeature.geometry.coordinates[0]];
      setCenter(coords);
      setPosition(coords);
      setZoom(18);
    }
  };


  // Find nearest landmark or neighborhood when position changes (from map click)
  useEffect(() => {
    if (position && (landmarksData.length > 0 || neighborhoodsData.length > 0)) {
      // 1. Try to find neighborhood first from Polygon JSON
      let foundNeighborhood: any = null;
      for (const feature of neighborhoodsData) {
        if (feature.geometry?.type === "Polygon") {
          if (isPointInPolygon(position, feature.geometry.coordinates)) {
            foundNeighborhood = feature;
            break;
          }
        }
      }

      // 2. Find nearest landmark from Point JSON
      let minDistance = Infinity;
      let nearestLandmark: any = null;
      landmarksData.forEach((f: any) => {
        if (!f.geometry || !f.geometry.coordinates) return;
        const [lLng, lLat] = f.geometry.coordinates;
        const dist = Math.pow(position[0] - lLat, 2) + Math.pow(position[1] - lLng, 2);
        if (dist < minDistance) {
          minDistance = dist;
          nearestLandmark = f;
        }
      });

      // Prefer Landmark properties if it's very close, otherwise use Neighborhood
      const source = (minDistance < 0.0001 && nearestLandmark) ? nearestLandmark : foundNeighborhood;
      
      if (source) {
        const props = source.properties;
        const govName = props.المحافظة || props.Governorat;
        const muniName = props.البلدية || props.Municipali;
        const nhName = props.الحي || props.Neighborho;
        const lmName = source === nearestLandmark ? props.اسم_المعلم || props.Landmark : "";

        // Map names to selects (triggers cascades)
        if (govName) setSelectedGovernorate(GOV_MAPPING[govName] || govName);
        if (muniName) setSelectedMunicipality(muniName);
        if (nhName) setSelectedNeighborhoodName(nhName);
        if (lmName) setSelectedLandmarkName(lmName);
      }
    }
  }, [position, landmarksData, neighborhoodsData]);

  useEffect(() => {
    if (position) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name);
        })
        .catch((error) => {
          setAddress(language === "ar" ? "لا يوجد اتصال بالإنترنت" : "No internet connection");
          console.log(error);
        });
    }
  }, [position, language]);

  const handleReset = () => {
    setPosition(null);
    setAddress("");
    setSelectedGovernorate("");
    setSelectedMunicipality("");
    setSelectedNeighborhoodName("");
    setSelectedLandmarkName("");
    setCenter(defaultCenter);
    setZoom(12);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isRTL = language === "ar";
  const labelSx = isRTL ? { 
    right: 50, 
    left: 'auto',
    transformOrigin: 'right',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    }
  } : {};

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
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              {t("map.previousLocation")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {t("map.previousLocationDescription")}
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="sm:gap-4">
              <FormControl  fullWidth size="small">
                <InputLabel sx={labelSx}  >
                  {language === "ar" ? "المحافظة" : "Governorate"}
                </InputLabel>
                <Select
                  value={selectedGovernorate}
                  label={language === "ar" ? "المحافظة" : "Governorate"}
                  onChange={handleGovernorateChange}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
                  endAdornment={govLoading ? <CircularProgress size={20} sx={{ mr: 4 }} /> : null}
                >
                  <MenuItem value=""><em>{language === "ar" ? "اختر المحافظة" : "Select Governorate"}</em></MenuItem>
                  {governorates.map(gov => (
                    <MenuItem key={gov} value={gov} dir={isRTL ? "rtl" : "ltr"}>{gov}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel sx={labelSx}>
                  {language === "ar" ? "البلدية" : "Municipality"}
                </InputLabel>
                <Select
                  value={selectedMunicipality}
                  label={language === "ar" ? "البلدية" : "Municipality"}
                  onChange={handleMunicipalityChange}
                  disabled={!selectedGovernorate || muniLoading}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
                  endAdornment={muniLoading ? <CircularProgress size={20} sx={{ mr: 4 }} /> : null}
                >
                  <MenuItem value=""><em>{language === "ar" ? "اختر البلدية" : "Select Municipality"}</em></MenuItem>
                  {municipalities.map(muni => (
                    <MenuItem key={muni} value={muni} dir={isRTL ? "rtl" : "ltr"}>{muni}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="sm:gap-4" >
              <FormControl fullWidth size="small">
                <InputLabel sx={labelSx}>
                  {language === "ar" ? "الحي" : "Neighborhood"}
                </InputLabel>
                <Select
                  value={selectedNeighborhoodName}
                  label={language === "ar" ? "الحي" : "Neighborhood"}
                  onChange={handleNeighborhoodChange}
                  disabled={!selectedMunicipality || nhLoading}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
                  endAdornment={nhLoading ? <CircularProgress size={20} sx={{ mr: 4 }} /> : null}
                >
                  <MenuItem value=""><em>{language === "ar" ? "اختر الحي" : "Select Neighborhood"}</em></MenuItem>
                  {neighborhoods.map(nh => (
                    <MenuItem key={nh} value={nh} dir={isRTL ? "rtl" : "ltr"}>{nh}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel sx={labelSx}>
                  {language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
                </InputLabel>
                <Select
                  value={selectedLandmarkName}
                  label={language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
                  onChange={handleLandmarkChange}
                  disabled={!selectedNeighborhoodName || lmLoading}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
                  endAdornment={lmLoading ? <CircularProgress size={20} sx={{ mr: 4 }} /> : null}
                >
                  <MenuItem value=""><em>{language === "ar" ? "اختر المعلم" : "Select Landmark"}</em></MenuItem>
                  {landmarks.map(lm => (
                    <MenuItem key={lm.name} value={lm.name} dir={isRTL ? "rtl" : "ltr"}>{lm.name}</MenuItem>
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
            <ArcGISMapContainer
              center={center}
              zoom={zoom}
              markerPosition={position}
              setMarkerPosition={setPosition}
              height="100%"
              width="100%"
              setAddress={setAddress}
              location={{ 
                position, 
                address, 
                ...resolvedIds,
                neighborhood: selectedNeighborhoodName,
                landmark: selectedLandmarkName,
                governorate: selectedGovernorate,
                municipality: selectedMunicipality
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
            className="sm:gap-4"
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                dispatch(setError(""));
                navigate(`${ROUTES.CITIZEN_DASHBOARD}`);
              }}
              startIcon={
                <ArrowBack
                  sx={{
                    transform: isRTL ? "rotate(180deg)" : "none",
                    ml: isRTL ? 1 : 0,
                  }}
                />
              }
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              {t("notFound.backToHome")}
            </Button>
            
            <Stack direction="row" spacing={2} sx={{ flex: 1 }} className="gap-4" >
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleReset}
                disabled={!position && !selectedGovernorate}
                startIcon={<RotateCcw size={18} />}
                sx={{ flex: 1, py: 1.5,  borderRadius: 2 }}
              >
                {t("map.reset")}
              </Button>
              
              {/* <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                disabled={!position}
                sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
              >
                {isRTL ? "تأكيد الموقع" : "Confirm Location"}
              </Button> */}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {position && (
          <DamageAssessmentDialog
            onClose={handleCloseDialog}
            location={{
              position,
              address,
              ...resolvedIds,
              neighborhood: selectedNeighborhoodName,
              landmark: selectedLandmarkName,
              governorate: selectedGovernorate,
              municipality: selectedMunicipality
            }}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default PreviousLocationMapPage;
