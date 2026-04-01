import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateCurrentLocation } from "../redux/slices/locationSlice";
import { ROUTES } from "../routes/Routes";
import MapContainer from "../components/MapContainer";
import { usePut } from "../hooks/api/useApi";
import { landmarks as neighborhoodLandmarks } from "../constants/locations";
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
import { axiosClient } from "../api/baseUrl";
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
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] =
    useState<string>("");
  const [selectedLandmarkCoords, setSelectedLandmarkCoords] =
    useState<string>("");
  const [neighborhoodLocations, setNeighborhoodLocations] = useState<any[]>([]);

  // Map Navigation state (keep original map)
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const [center, setCenter] = useState<[number, number]>(
    position || defaultCenter,
  );
  const [zoom, setZoom] = useState<number>(position ? 16 : 13);

  // Sync center with position on initial load or landmark/reset selection
  useEffect(() => {
    if (position) {
      setCenter(position);
    }
  }, [position]);

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
    const neighborhood = neighborhoodLocations.find(
      (n) => n?.id?.toString() === neighborhoodId?.toString(),
    );
    if (neighborhood) {
      // Robust coordinate extraction
      const latVal =
        neighborhood.latitude ||
        neighborhood.lat ||
        (neighborhood.coords && neighborhood.coords[0]);
      const lngVal =
        neighborhood.longitude ||
        neighborhood.lng ||
        (neighborhood.coords && neighborhood.coords[1]);

      const lat = parseFloat(latVal);
      const lng = parseFloat(lngVal);

      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setPosition(null); // Reset manual position when neighborhood changes
        setZoom(15);
      }
    } else if (neighborhoodId === "") {
      // Reset to default center if "All" is selected
      setCenter(defaultCenter);
      setZoom(13);
    }
  };

  // Handle Landmark Change
  const handleLandmarkChange = (event: any) => {
    const coordsStr = event.target.value;
    setSelectedLandmarkCoords(coordsStr);

    if (coordsStr) {
      const [lat, lng] = coordsStr.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setPosition([lat, lng]);
        setZoom(18);
      }
    }
  };

  const { loading, execute } = usePut(`${API.citizen.locations.current}`, {
    onSuccess: () => {
      navigate(`${ROUTES.CITIZEN_DASHBOARD}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    axiosClient
      .get(`/neighborhoods`)
      .then((res: any) => {
        setNeighborhoodLocations(res.data.neighborhoods);
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
    setSelectedNeighborhoodId("");
    setSelectedLandmarkCoords("");
    setCenter(defaultCenter);
    setZoom(15);
  };

  const getNeighborhoodName = (id: string) => {
    const neighborhood = neighborhoodLocations.find(
      (n) => n.id.toString() === id.toString(),
    );
    if (!neighborhood) return id;
    return language === "ar" ? neighborhood.name : neighborhood.name_en;
  };

  const getLandmarkName = (coordsToCheck: string) => {
    if (!coordsToCheck || !selectedNeighborhoodId) return "";
    const [lat, lng] = coordsToCheck.split(",");
    const landmarkItem = currentLandmarks.find(
      (l: any) =>
        l.latitude.toString() === lat.toString() &&
        l.longitude.toString() === lng.toString(),
    );
    return landmarkItem?.landmark || "";
  };

  const handleConfirm = () => {
    if (position && address) {
      const currentLocAddress = `${getNeighborhoodName(selectedNeighborhoodId)} - ${getLandmarkName(selectedLandmarkCoords)} - ${address}`;
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
        address,
        neighborhood_id: selectedNeighborhoodId,
        landmark: getLandmarkName(selectedLandmarkCoords),
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

          <Stack direction={{ xs: "column", md: "row" }} sx={{ mb: 3, gap: 2 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>
                {language === "ar" ? "اختر الحي" : "Select Neighborhood"}
              </InputLabel>
              <Select
                value={selectedNeighborhoodId}
                label={language === "ar" ? "اختر الحي" : "Select Neighborhood"}
                onChange={handleNeighborhoodChange}
                autoFocus
              >
                <MenuItem value="">
                  {language === "ar" ? "الكل" : "All"}
                </MenuItem>
                {neighborhoodLocations.map((n) => (
                  <MenuItem key={n.id} value={n.id}>
                    {language === "ar" ? n.name : n.name_en}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ ml: 0 }}>
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
                  <MenuItem
                    key={index}
                    value={`${lm.latitude},${lm.longitude}`}
                  >
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
