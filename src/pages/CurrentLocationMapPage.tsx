import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateCurrentLocation } from "../redux/slices/locationSlice";
import { ROUTES } from "../routes/Routes";
import MapContainer from "../components/MapContainer";
import { usePost } from "../hooks/api/useApi";
import SelectLocations, { locations } from "../components/SelectLocations";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { API } from "../constants/ApiRoutes";

// import { getReviewData } from "../utils/getReviewData";
// import { axiosClient } from "../api/baseUrl";

const CurrentLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { currentLocation } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>(
    currentLocation.currentLatitude && currentLocation.currentLongitude
      ? [currentLocation.currentLatitude, currentLocation.currentLongitude]
      : null
  );
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState<string>(locations[11].name);

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  const { loading, execute } = usePost(`${API.citizen.locations.current}`, {
    onSuccess: () => {
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
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "Location selected");
        })
        .catch(() => {
          setAddress(
            `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`
          );
        });
    }
  }, [position]);

  const handleReset = () => {
    setPosition(null);
    setAddress("");
  };

  const handleConfirm = () => {
    if (position && address) {
      dispatch(
        updateCurrentLocation({
          currentLocation: {
            currentLatitude: position[0],
            currentLongitude: position[1],
            currentLocationAddress: address,
          },
        })
      );

      execute({
        latitude: position[0].toString(),
        longitude: position[1].toString(),
        address,
        neighborhood,
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
          <Box sx={{ mb: 3, textAlign: "center" }}>
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
              zoom={15}
              markerPosition={position}
              setMarkerPosition={setPosition}
              height="100%"
              width="100%"
              {...{ setAddress }}
            >
              {/* You can add <Marker>, <Popup>, etc. as children if needed */}
            </MapContainer>
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
              variant="outlined"
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

            <Box sx={{ flex: 1 }}>
              <SelectLocations
                {...{ handleReset }}
                {...{ setNeighborhood }}
                setCenter={setCenter}
              />
            </Box>

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
