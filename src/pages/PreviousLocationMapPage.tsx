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

const PreviousLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();

  // Data States
  const [landmarksData, setLandmarksData] = useState<any[]>([]);
  const [neighborhoodsData, setNeighborhoodsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map States
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  
  // Selection States
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [selectedNeighborhoodName, setSelectedNeighborhoodName] = useState<string>("");
  const [selectedLandmarkName, setSelectedLandmarkName] = useState<string>("");

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.5017, 34.4668];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState<number>(12);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [lmRes, nhRes] = await Promise.all([
          fetch("/Landmarks.json"),
          fetch("/Neighborhood.json")
        ]);
        const lmData = await lmRes.json();
        const nhData = await nhRes.json();
        
        if (lmData.features) setLandmarksData(lmData.features);
        if (nhData.features) setNeighborhoodsData(nhData.features);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Derived Options
  const governorates = useMemo(() => {
    const set = new Set<string>();
    landmarksData.forEach(f => {
      if (f.properties.المحافظة) set.add(f.properties.المحافظة);
    });
    return Array.from(set).sort();
  }, [landmarksData]);

  const municipalities = useMemo(() => {
    if (!selectedGovernorate) return [];
    const set = new Set<string>();
    landmarksData.forEach(f => {
      if (f.properties.المحافظة === selectedGovernorate && f.properties.البلدية) {
        set.add(f.properties.البلدية);
      }
    });
    return Array.from(set).sort();
  }, [landmarksData, selectedGovernorate]);

  const neighborhoods = useMemo(() => {
    if (!selectedMunicipality) return [];
    const set = new Set<string>();
    landmarksData.forEach(f => {
      if (f.properties.البلدية === selectedMunicipality && f.properties.الحي) {
        set.add(f.properties.الحي);
      }
    });
    return Array.from(set).sort();
  }, [landmarksData, selectedMunicipality]);

  const landmarks = useMemo(() => {
    if (!selectedNeighborhoodName) return [];
    return landmarksData
      .filter(f => f.properties.الحي === selectedNeighborhoodName)
      .map(f => ({
        name: f.properties.اسم_المعلم,
        coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]] as [number, number]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [landmarksData, selectedNeighborhoodName]);

  // Find Neighborhood ID by Name
  const selectedNeighborhoodId = useMemo(() => {
    if (!selectedNeighborhoodName) return "";
    const nh = neighborhoodsData.find(f => f.properties.الحي === selectedNeighborhoodName);
    return nh ? nh.id.toString() : "";
  }, [neighborhoodsData, selectedNeighborhoodName]);

  // Handle Changes
  const handleGovernorateChange = (event: any) => {
    setSelectedGovernorate(event.target.value);
    setSelectedMunicipality("");
    setSelectedNeighborhoodName("");
    setSelectedLandmarkName("");
  };

  const handleMunicipalityChange = (event: any) => {
    setSelectedMunicipality(event.target.value);
    setSelectedNeighborhoodName("");
    setSelectedLandmarkName("");
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
    
    const landmark = landmarks.find(l => l.name === name);
    if (landmark) {
      setCenter(landmark.coords);
      setPosition(landmark.coords);
      setZoom(18);
    }
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
        setSelectedGovernorate(props.المحافظة || "");
        setSelectedMunicipality(props.البلدية || "");
        setSelectedNeighborhoodName(props.الحي || "");
        setSelectedLandmarkName(props.اسم_المعلم || "");
      }
    }
  }, [position, landmarksData]);

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
                  disabled={!selectedGovernorate}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
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
                  disabled={!selectedMunicipality}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
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
                  disabled={!selectedNeighborhoodName}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
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
                neighborhood_id: selectedNeighborhoodId,
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
              
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                disabled={!position}
                sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
              >
                {isRTL ? "تأكيد الموقع" : "Confirm Location"}
              </Button>
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
              neighborhood_id: selectedNeighborhoodId,
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
