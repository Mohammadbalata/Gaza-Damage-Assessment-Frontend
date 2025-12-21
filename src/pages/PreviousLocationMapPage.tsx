import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch } from "../hooks/redux";
import { updatePreviousLocation } from "../redux/slices/locationSlice";
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
import BackButton from "../components/Shared/BackButton";
import axios from "axios";

const PreviousLocationMapPage = () => {
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>();
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState<string>(locations[11].name);

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.349013, 34.292483];

  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  const { loading } = usePost(`applications/add-previous-location`, {
    onSuccess: () => {
      navigate(`${ROUTES.CURRENT_LOCATION}`);
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
  //   // const token = localStorage.getItem("token");
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgyLCJuYXRpb25hbF9pZCI6IjQxMDAzMTkzNCIsInR5cGUiOiJjaXRpemVuIiwiaWF0IjoxNzY2MDQ3Nzc2LCJleHAiOjE3NjY2NTI1NzZ9.pI0xW5SCevH21LVbaCBaX74YTt9RXMxJN9Taxrn7DL8";
  //   const newFormData = new FormData();

  //   if (applications.length !== 0) {
  //     dispatch(
  //       updatePreviousLocation({
  //         previosLocations: applications,
  //       })
  //     );
  //     applications.map((application: any) => {
  //       // execute({
  //       //   latitude: application.latitude.toString(),
  //       //   longitude: application.longitude.toString(),
  //       //   address: application.address,
  //       //   extraData: JSON.stringify({
  //       //     buildingType: application.buildingType,
  //       //     [application.buildingType]: application.extraData,
  //       //   }),
  //       //   neighborhood: application.neighborhood,
  //       //   beforeWarImage: application.beforeWarImage,
  //       //   afterWarImage: application.afterWarImage,
  //       //   ownershipDocuments: application.ownershipDocuments,
  //       // });
  //       // axiosClient.post(
  //       //   "applications/add-previous-location",
  //       //   {
  //       //     latitude: application.latitude.toString(),
  //       //     longitude: application.longitude.toString(),
  //       //     address: application.address,
  //       //     extraData: JSON.stringify({
  //       //       buildingType: application.buildingType,
  //       //       [application.buildingType]: application.extraData,
  //       //     }),
  //       //     neighborhood: application.neighborhood,
  //       //     beforeWarImage: application.beforeWarImage,
  //       //     afterWarImage: application.afterWarImage,
  //       //     ownershipDocuments: application.ownershipDocuments,
  //       //   },
  //       //   {
  //       //     header: {
  //       //       Authorization: `Bearer ${token}`,
  //       //     },
  //       //   }
  //       // );
  //       // await axios
  //       // .post('https://backend-5549.onrender.com/applications/add-previous-location', {
  //       //     latitude: application.latitude.toString(),
  //       //     longitude: application.longitude.toString(),
  //       //     address: application.address,
  //       //     extraData: JSON.stringify({
  //       //       buildingType: application.buildingType,
  //       //       [application.buildingType]: application.extraData,
  //       //     }),
  //       //     neighborhood: application.neighborhood,
  //       //     beforeWarImage: application.beforeWarImage,
  //       //     afterWarImage: application.afterWarImage,
  //       //     ownershipDocuments: application.ownershipDocuments,
  //       //   }, {
  //       //   headers: {
  //       //     Authorization: `Bearer ${token}`,
  //       //   },
  //       // })
  //       // .then((res) => {
  //       //   console.log(res.data.data);
  //       // });
  //       newFormData.append("latitude", application.latitude.toString());
  //       newFormData.append("longitude", application.longitude.toString());
  //       newFormData.append("address", application.address.toString());
  //       newFormData.append("neighborhood", application.neighborhood.toString());
  //       newFormData.append(
  //         "extraData",
  //         JSON.stringify({
  //           buildingType: application.buildingType,
  //           [application.buildingType]: application.extraData,
  //         })
  //       );
  //       newFormData.append("beforeWarImage", application.beforeWarImage);
  //       newFormData.append("afterWarImage", application.afterWarImage);
  //       application.ownershipDocuments?.forEach((file: any) => {
  //         newFormData.append("ownershipDocuments[]", file);
  //       });
  //       axios
  //         .post(
  //           "https://backend-5549.onrender.com/applications/add-previous-location",
  //           newFormData,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         )
  //         .then((res) => {
  //           console.log(res.data.data);
  //         });
  //     });
  //   }
  //   console.log(applications);
  // };

  const handleConfirm = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgyLCJuYXRpb25hbF9pZCI6IjQxMDAzMTkzNCIsInR5cGUiOiJjaXRpemVuIiwiaWF0IjoxNzY2MDQ3Nzc2LCJleHAiOjE3NjY2NTI1NzZ9.pI0xW5SCevH21LVbaCBaX74YTt9RXMxJN9Taxrn7DL8";

    if (applications.length === 0) return;

    dispatch(updatePreviousLocation({ previosLocations: applications }));

    const createApplicationFormData = (application: any) => {
      const formData = new FormData();

      formData.append("latitude", application.latitude.toString());
      formData.append("longitude", application.longitude.toString());
      formData.append("address", application.address.toString());
      formData.append("neighborhood", application.neighborhood.toString());

      formData.append(
        "extraData",
        JSON.stringify({
          buildingType: application.buildingType,
          [application.buildingType]: application.extraData,
        })
      );

      if (application.beforeWarImage) {
        formData.append("beforeWarImage", application.beforeWarImage);
      }
      if (application.afterWarImage) {
        formData.append("afterWarImage", application.afterWarImage);
      }
      if (
        application.ownershipDocuments &&
        application.ownershipDocuments.length > 0
      ) {
        application.ownershipDocuments.forEach((file: any) =>
          formData.append("ownershipDocuments", file)
        );
      }

      return formData;
    };

    // إرسال كل تطبيق للباك اند بشكل متسلسل
    for (const application of applications) {
      const formData = createApplicationFormData(application);

      try {
        const res = await axios.post(
          "https://backend-5549.onrender.com/applications/add-previous-location",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data.data);
      } catch (err) {
        console.error("Failed to send application:", err);
      }
    }

    console.log(applications);
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
              {...{ setApplications }}
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

export default PreviousLocationMapPage;
