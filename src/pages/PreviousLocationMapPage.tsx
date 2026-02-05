import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch } from "../hooks/redux";
import { locations as neighborhoodLocations, landmarks as neighborhoodLandmarks } from "../constants/locations";
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

  // Map States
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  
  // Selection States
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>("");
  const [selectedLandmarkCoords, setSelectedLandmarkCoords] = useState<string>("");

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);


  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.349013, 34.292483];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState<number>(15);


  // Get landmarks for selected neighborhood
  const currentLandmarks = useMemo(() => {
    if (!selectedNeighborhoodId) return [];
    return neighborhoodLandmarks[selectedNeighborhoodId] || [];
  }, [selectedNeighborhoodId]);

  // Handle Neighborhood Change
  const handleNeighborhoodChange = (event: any) => {
    const neighborhoodId = event.target.value;
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedLandmarkCoords(""); // Reset landmark when neighborhood changes
    
    // Find neighborhood coordinates to center map
    const neighborhood = neighborhoodLocations.find(n => n.id === neighborhoodId);
    if (neighborhood) {
      setCenter(neighborhood.coords);
      setZoom(15); // Reset zoom or keep it moderate for neighborhood view
    }
  };

  // Handle Landmark Change
  const handleLandmarkChange = (event: any) => {
    const coordsStr = event.target.value;
    setSelectedLandmarkCoords(coordsStr);

    if (coordsStr) {
      const [lat, lng] = coordsStr.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setPosition([lat, lng]); // Optionally set marker position too
        setZoom(18); // High zoom for specific landmark
      }
    }
  };

  useEffect(() => {
    if (position) {
      // Reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name);
        })
        .catch((error) => {
          setAddress("لا يوجد اتصال في الانترنت");
          console.log(error);
        });
    }
  }, [position]);

  const handleReset = () => {
    setPosition(null);
    setAddress("");
    setSelectedNeighborhoodId("");
    setSelectedLandmarkCoords("");
    setCenter(defaultCenter);
    setZoom(15);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getNeighborhoodName = (id: string) => {
    return neighborhoodLocations.find(n => n.id === id)?.name || id;
  };

  const getLandmarkName = (coordsToCheck: string) => {
    if (!coordsToCheck || !selectedNeighborhoodId) return "";
    const [lat, lng] = coordsToCheck.split(',');
    const landmark = currentLandmarks.find((l: any) => 
      l.latitude === lat && l.longitude === lng
    );
    return landmark?.landmark || "";
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
            <Typography variant="body1" color="text.secondary">
              {t("map.previousLocationDescription")}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} sx={{ mb: 3 , gap:2 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>
                {language === "ar" ? "اختر الحي" : "Select Neighborhood"}
              </InputLabel>
              <Select
                value={selectedNeighborhoodId}
                label={language === "ar" ? "اختر الحي" : "Select Neighborhood"}
                onChange={handleNeighborhoodChange}
                onFocus={() => setOpenDialog(false)}
                autoFocus
              >
                <MenuItem value="">
                  {language === "ar" ? "الكل" : "All"}
                </MenuItem>
                {neighborhoodLocations.map((n) => (
                  <MenuItem key={n.id} value={n.id}>
                    {n.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ml:0 }}>
              <InputLabel>
                {language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
              </InputLabel>
              <Select
                value={selectedLandmarkCoords}
                label={language === "ar" ? "أقرب معلم" : "Nearest Landmark"}
                onChange={handleLandmarkChange}
                disabled={!selectedNeighborhoodId}

                
              >
                <MenuItem value="">
                  {language === "ar" ? "اختر المعلم" : "Select Landmark"}
                </MenuItem>
                {currentLandmarks.map((lm: any, index: number) => (
                  <MenuItem key={index} value={`${lm.latitude},${lm.longitude}`}>
                    {lm.landmark}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                neighborhood: getNeighborhoodName(selectedNeighborhoodId),
                landmark: getLandmarkName(selectedLandmarkCoords),
                // We're passing the name, not coordinates, if that's what's expected for display/saving
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
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={() => {
                dispatch(setError(""));
                navigate(`${ROUTES.CITIZEN_DASHBOARD}`);
              }}
              startIcon={
                <ArrowBack
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    ml: language === "ar" ? 1 : 0,
                  }}
                />
              }
              sx={{
                py: 1.5,
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
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleReset}
              disabled={!position && !selectedNeighborhoodId}
              startIcon={
                <RotateCcw
                  className={language === "ar" ? "ml-2" : "mr-2"}
                  size={18}
                />
              }
              sx={{ flex: 1, height: 48 }}
            >
              {t("map.reset")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Damage Assessment Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
      >
        {position && (
          <DamageAssessmentDialog
            onClose={handleCloseDialog}
            location={{
              position,
              address,
              neighborhood: getNeighborhoodName(selectedNeighborhoodId),
              nearestLandmark: getLandmarkName(selectedLandmarkCoords),
            }}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default PreviousLocationMapPage;
