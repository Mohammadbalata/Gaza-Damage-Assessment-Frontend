// src/pages/ViewLocationMapPage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { ArrowBack, LocationOn as LocationOnIcon } from "@mui/icons-material";
import ArcGISMapContainer from "../components/MapContainer.v2";
import { ROUTES } from "../routes/Routes";

const ViewLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  const isValid = !isNaN(lat) && !isNaN(lng);

  const position: [number, number] | null = isValid ? [lat, lng] : null;
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!isValid) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
      .then((res) => res.json())
      .then((data) => setAddress(data.display_name))
      .catch(() => setAddress(""));
  }, [lat, lng]);

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
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              {t("map.showonmap")}
            </Typography>
          </Box>

          {!isValid ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {t("map.invalidCoords")}
            </Alert>
          ) : (
            <>
              {/* Map */}
              <Box
                sx={{
                  height: 420,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 3,
                }}
              >
                <ArcGISMapContainer
                  center={[lat, lng]}
                  zoom={17}
                  markerPosition={position}
                  height="100%"
                  width="100%"
                  location={{ position, address }}
                  readOnly={true}
                />
              </Box>

              {/* Coordinates + Address */}
              <Box
                sx={{
                  mb: 3,
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
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LocationOnIcon fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight="medium" dir="ltr">
                        {lat.toFixed(6)}, {lng.toFixed(6)}
                      </Typography>
                    </Stack>
                  </Box>

                  {address && (
                    <Box flex={2}>
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
                  )}
                </Stack>
              </Box>
            </>
          )}

          {/* Back Button */}
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(ROUTES.MY_APPLICATIONS)}
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
              "&:hover": { borderWidth: 2 },
            }}
          >
            {t("notFound.backToHome")}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewLocationMapPage;
