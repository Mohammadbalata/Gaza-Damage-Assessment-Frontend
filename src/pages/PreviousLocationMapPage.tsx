import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch } from "../hooks/redux";
// import { updatePreviousLocation } from "../redux/slices/locationSlice";
// import { ROUTES } from "../routes/Routes";
import MapContainer from "../components/MapContainer";
// import { usePost } from "../hooks/api/useApi";
import SelectLocations, { locations } from "../components/SelectLocations";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { setError } from "../redux/slices/damageSlice";
import { ROUTES } from "../routes/Routes";
// import axios from "axios";
// import { axiosClient } from "../api/baseUrl";

const PreviousLocationMapPage = () => {
  // const [application, setApplication] = useState({});
  // const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);

  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>();
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState<string>(locations[11].name);

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.349013, 34.292483];

  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  // const { loading } = usePost(`applications/add-previous-location`, {
  //   onSuccess: () => {

  //   },
  //   onError: (err) => {
  //     console.log(err);
  //   },
  // });

  useEffect(() => {
    if (position) {
      // Reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name);
        })
        .catch((error: any) => {
          // setAddress(
          //   `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`
          // );
          setAddress("لا يوجد اتصال في الانترنت");
          console.log(error);
        });
    }
  }, [position]);

  const handleReset = () => {
    setPosition(null);
    setAddress("");
  };

  // const handleConfirm = async () => {
  //   const token = localStorage.getItem("token");

  //   dispatch(updatePreviousLocation({ previosLocation: application }));

  //   const createApplicationFormData = (application: any) => {
  //     const formData = new FormData();

  //     formData.append("latitude", application.latitude.toString());
  //     formData.append("longitude", application.longitude.toString());
  //     formData.append("address", application.address.toString());
  //     formData.append("neighborhood", application.neighborhood.toString());

  //     formData.append(
  //       "extraData",
  //       JSON.stringify({
  //         buildingType: application.buildingType,
  //         [application.buildingType]: application.extraData,
  //       })
  //     );

  //     if (application.beforeWarImage) {
  //       formData.append("beforeWarImage", application.beforeWarImage);
  //     }
  //     if (application.afterWarImage) {
  //       formData.append("afterWarImage", application.afterWarImage);
  //     }
  //     if (
  //       application.ownershipDocuments &&
  //       application.ownershipDocuments.length > 0
  //     ) {
  //       application.ownershipDocuments.forEach((file: any) =>
  //         formData.append("ownershipDocuments", file)
  //       );
  //     }

  //     return formData;
  //   };

  //   // إرسال كل تطبيق للباك اند بشكل متسلسل
  //   const formData = createApplicationFormData(application);

  //   try {
  //     await axios
  //       .post(
  //         "https://backend-5549.onrender.com/applications/add-previous-location",
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((res: any) => {
  //         if (isCurrentLocation) {
  //           navigate(`${ROUTES.CITIZEN_DASHBOARD}`);
  //         } else {
  //           navigate(`${ROUTES.CURRENT_LOCATION}`);
  //         }
  //         console.log(res.data.data);
  //       });
  //   } catch (err) {
  //     console.error("Failed to send application:", err);
  //   }

  //   console.log(application);
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   axiosClient
  //     .get("/applications/my-applications", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res: any) => {
  //       console.log(res.data.data.citizen.current_location);
  //       const isCurrentLocation = res.data.data.citizen.current_location;
  //       if (isCurrentLocation) {
  //         setIsCurrentLocation(true);
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }, []);

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
              location={{ position, address, neighborhood }}
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
            direction={{ xs: "column", sm: "row" }}
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
                // className is passed to FullWidth FormControl in SelectLocations
              />
            </Box>

            {/* <Button
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
            </Button> */}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PreviousLocationMapPage;
