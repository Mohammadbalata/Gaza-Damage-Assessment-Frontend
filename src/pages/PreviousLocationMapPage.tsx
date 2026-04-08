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
import DamageAssessmentStepper from "../components/Shared/DamageAssessmentStepper";

const PreviousLocationMapPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();

  // Data States (Local JSON for Sync)
  const [localGovData, setLocalGovData] = useState<any[]>([]);
  const [localMuniData, setLocalMuniData] = useState<any[]>([]);
  const [localNhData, setLocalNhData] = useState<any[]>([]);
  const [localLmData, setLocalLmData] = useState<any[]>([]);
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
  const [targetNames, setTargetNames] = useState<any>({
    governorate: "",
    municipality: "",
    neighborhood: "",
    landmark: ""
  });
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
        const [govLocalRes, muniLocalRes, nhLocalRes, lmLocalRes, govBackendRes] = await Promise.all([
          fetch("/Governorates.json"),
          fetch("/Municipalitys.json"),
          fetch("/Neighborhoods.json"),
          fetch("/Landmarks.json"),
          axiosClient.get(API.locations.governorates).catch(() => ({ data: { governorates: [] } }))
        ]);
        
        const govL = await govLocalRes.json();
        const muniL = await muniLocalRes.json();
        const nhL = await nhLocalRes.json();
        const lmL = await lmLocalRes.json();
        
        if (govL.features) setLocalGovData(govL.features);
        if (muniL.features) setLocalMuniData(muniL.features);
        if (nhL.features) setLocalNhData(nhL.features);
        if (lmL.features) setLocalLmData(lmL.features);
        
        if (govBackendRes.data.governorates) setGovernoratesList(govBackendRes.data.governorates);
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
          .then((res: any) => {
            setAllMunicipalities(res.data.municipalities || []);
            // Clear children if not matching target names
            if (!targetNames.municipality) {
               setSelectedMunicipality("");
               setSelectedNeighborhoodName("");
               setSelectedLandmarkName("");
            }
          })
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
          .then((res: any) => {
            setAllNeighborhoods(res.data.neighborhoods || []);
            if (!targetNames.neighborhood) {
              setSelectedNeighborhoodName("");
              setSelectedLandmarkName("");
            }
          })
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
          .then((res: any) => {
             setAllLandmarks(res.data.landmarks || []);
             if (!targetNames.landmark) {
               setSelectedLandmarkName("");
             }
          })
          .catch(() => {})
          .finally(() => setLmLoading(false));
      }
    }
  }, [selectedNeighborhoodName, allNeighborhoods]);
  // Sync targetNames with Selects (Cascading)
  useEffect(() => {
    if (targetNames.governorate && governoratesList.length > 0) {
      const mappedGov = GOV_MAPPING[targetNames.governorate] || targetNames.governorate;
      const match = findMatch(governoratesList, mappedGov);
      if (match && selectedGovernorate !== match.name) {
        setSelectedGovernorate(match.name);
      }
    }
  }, [targetNames.governorate, governoratesList]);

  useEffect(() => {
    if (targetNames.municipality && allMunicipalities.length > 0) {
      const match = findMatch(allMunicipalities, targetNames.municipality);
      if (match && selectedMunicipality !== match.name) {
        setSelectedMunicipality(match.name);
      }
    }
  }, [targetNames.municipality, allMunicipalities]);

  useEffect(() => {
    if (targetNames.neighborhood && allNeighborhoods.length > 0) {
      const match = findMatch(allNeighborhoods, targetNames.neighborhood);
      if (match && selectedNeighborhoodName !== match.name) {
        setSelectedNeighborhoodName(match.name);
      }
    }
  }, [targetNames.neighborhood, allNeighborhoods]);

  useEffect(() => {
    if (targetNames.landmark && allLandmarks.length > 0) {
      const match = findMatch(allLandmarks, targetNames.landmark);
      if (match && selectedLandmarkName !== match.name) {
        setSelectedLandmarkName(match.name);
      }
    }
  }, [targetNames.landmark, allLandmarks]);

  const normalizeText = (text: string) => {
    if (!text) return "";
    return text.toString().trim()
      .replace(/[\uFEFF\u200B\u200C\u200D\u0640]/g, "") // Added \u0640 (Tatweel/Kashida)
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/^(محافظه|بلديه|حي|قريه|مخيم)\s+/g, "")
      .replace(/\s+/g, "");
  };

  const GOV_MAPPING: Record<string, string> = {
    "الشمال": "شمال غزة",
    "شمال غزة": "شمال غزة",
    "دير البلح": "الوسطى",
    "دير البلح - الوسطى": "الوسطى",
    "الوسطى": "الوسطى",
    "غزة": "غزة",
    "خان يونس": "خان يونس",
    "رفح": "رفح",
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
      const govLandmarks = localLmData.filter(f => 
        f.properties.المحافظة === name || f.properties.Governorat === name || f.properties.Name === name
      );
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
      // Find First feature that matches municipality and governorate (disambiguation)
      const muniFeature = localMuniData.find(f => 
        (f.properties.Mun_Name === name || f.properties.Name === name || f.properties.البلدية === name) &&
        (normalizeText(f.properties.المحافظة) === normalizeText(selectedGovernorate) || 
         normalizeText(f.properties.Governorat) === normalizeText(selectedGovernorate) ||
         normalizeText(f.properties.المحا) === normalizeText(selectedGovernorate))
      );

      if (muniFeature && muniFeature.properties.X && muniFeature.properties.Y) {
        setCenter([muniFeature.properties.Y, muniFeature.properties.X]);
        setZoom(13);
      } else {
         const muniLandmarks = localLmData.filter(f => 
           (f.properties.البلدية === name || f.properties.Municipali === name) &&
           (normalizeText(f.properties.المحافظة) === normalizeText(selectedGovernorate) || normalizeText(f.properties.Governorat) === normalizeText(selectedGovernorate))
         );
         if (muniLandmarks.length > 0) {
           const first = muniLandmarks[0];
           setCenter([first.geometry.coordinates[1], first.geometry.coordinates[0]]);
           setZoom(13);
         }
      }
    }
  };

  const handleNeighborhoodChange = (event: any) => {
    const name = event.target.value;
    setSelectedNeighborhoodName(name);
    setSelectedLandmarkName("");
    
    const nhFeature = localNhData.find(f => 
      (f.properties.الحي === name || f.properties.Neighborho === name || f.properties.name === name) &&
      (normalizeText(f.properties.البلدية) === normalizeText(selectedMunicipality) || 
       normalizeText(f.properties.Municipali) === normalizeText(selectedMunicipality) ||
       normalizeText(f.properties.البلد) === normalizeText(selectedMunicipality))
    );

    if (nhFeature && nhFeature.properties.X && nhFeature.properties.Y) {
        setCenter([nhFeature.properties.Y, nhFeature.properties.X]);
        setZoom(15);
    } else {
        const neighborhoodLandmarks = localLmData.filter(f => 
          (f.properties.الحي === name || f.properties.Neighborho === name) &&
          (normalizeText(f.properties.البلدية) === normalizeText(selectedMunicipality) || normalizeText(f.properties.Municipali) === normalizeText(selectedMunicipality))
        );
        if (neighborhoodLandmarks.length > 0) {
          const first = neighborhoodLandmarks[0];
          setCenter([first.geometry.coordinates[1], first.geometry.coordinates[0]]);
          setZoom(15);
        }
    }
  };

  const handleLandmarkChange = (event: any) => {
    const name = event.target.value;
    setSelectedLandmarkName(name);
    
    // Disambiguate by matching neighborhood and municipality
    const landmarkFeature = localLmData.find(f => 
      (f.properties.اسم_المعلم === name || f.properties.name === name || f.properties.Landmark === name) &&
      (normalizeText(f.properties.الحي) === normalizeText(selectedNeighborhoodName) || normalizeText(f.properties.Neighborho) === normalizeText(selectedNeighborhoodName)) &&
      (normalizeText(f.properties.البلدية) === normalizeText(selectedMunicipality) || 
       normalizeText(f.properties.Municipali) === normalizeText(selectedMunicipality) ||
       normalizeText(f.properties.البلد) === normalizeText(selectedMunicipality))
    );

    if (landmarkFeature && landmarkFeature.geometry) {
      const coords: [number, number] = [landmarkFeature.geometry.coordinates[1], landmarkFeature.geometry.coordinates[0]];
      setCenter(coords);
      setPosition(coords);
      setZoom(18);
    }
  };


  // Find nearest landmark or neighborhood when position changes (from map click)
  useEffect(() => {
    if (position && (localLmData.length > 0 || localGovData.length > 0)) {
      // 1. Find Governorate by Polygon
      let govNameFound = "";
      for (const feature of localGovData) {
        if (feature.geometry?.type === "Polygon") {
          if (isPointInPolygon(position, feature.geometry.coordinates)) {
            govNameFound = feature.properties.Name || feature.properties.المحافظة || feature.properties.Governorat || feature.properties.المحا;
            break;
          }
        }
      }

      // 2. Find Municipality by Polygon
      let muniNameFound = "";
      for (const feature of localMuniData) {
        if (feature.geometry?.type === "Polygon") {
          if (isPointInPolygon(position, feature.geometry.coordinates)) {
            muniNameFound = feature.properties.Mun_Name || feature.properties.البلدية || feature.properties.Municipali || feature.properties.البلد;
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
            nhNameFound = feature.properties.الحي || feature.properties.Neighborho || feature.properties.name;
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
        const dist = Math.pow(position[0] - lLat, 2) + Math.pow(position[1] - lLng, 2);
        if (dist < minDistance) {
          minDistance = dist;
          nearestLandmark = f;
        }
      });

      let lmNameFound = "";
      if (nearestLandmark && minDistance < 0.0005) { // Threshold for proximity
        lmNameFound = nearestLandmark.properties.اسم_المعلم || nearestLandmark.properties.name || nearestLandmark.properties.Landmark;
        
        // Use landmark properties as fallback/accuracy boost
        if (!govNameFound) govNameFound = nearestLandmark.properties.المحافظة || nearestLandmark.properties.Governorat || nearestLandmark.properties.المحا;
        if (!muniNameFound) muniNameFound = nearestLandmark.properties.البلدية || nearestLandmark.properties.Municipali || nearestLandmark.properties.البلد;
        if (!nhNameFound) nhNameFound = nearestLandmark.properties.الحي || nearestLandmark.properties.Neighborho;
      }

      // Set target names for synchronization (triggers cascading matching effects)
      setTargetNames({
        governorate: govNameFound,
        municipality: muniNameFound,
        neighborhood: nhNameFound,
        landmark: lmNameFound
      });
    }
  }, [position, localLmData, localGovData, localMuniData, localNhData]);

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
    setTargetNames({ governorate: "", municipality: "", neighborhood: "", landmark: "" });
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
          <DamageAssessmentStepper 
            activeStep={position ? 1 : 0}
            step1Completed={!!(selectedGovernorate && selectedMunicipality && selectedNeighborhoodName)}
            step2Completed={!!position}
          />
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
