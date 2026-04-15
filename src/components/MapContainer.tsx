import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useMemo } from "react";
import ChangeView from "./ChangeView";
import FormDialog from "./FormDialog";
// import { Box, Button, Dialog, Typography } from "@mui/material";

// Fix default marker icon for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapContainerProps {
  center: [number, number];
  zoom?: number;
  markerPosition?: [number, number] | null;
  setMarkerPosition?: (pos: [number, number]) => void;
  children?: React.ReactNode;
  height?: string;
  width?: string;
  setAddress: any;
  location?: any;
  isLoading?: boolean;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  setZoom?: (zoom: number) => void;
}

function LocationMarker({
  position,
  setPosition,
  setZoom,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  setZoom?: (zoom: number) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
    zoomend(e) {
      if (typeof setZoom === 'function') {
        setZoom(e.target.getZoom());
      }
    }
  });

  return position ? <Marker position={position} /> : null;
}

const MapContainer: React.FC<MapContainerProps> = ({
  center,
  zoom = 15,
  markerPosition,
  setMarkerPosition,
  children,
  height = "100%",
  width = "100%",
  setAddress,
  location,
  isLoading,
  openDialog,
  setOpenDialog,
  setZoom,
}) => {

  // Robust coordinate sanitation with stability
  const safeCenter: [number, number] = useMemo(() => [
    typeof center?.[0] === 'number' && !isNaN(center[0]) ? center[0] : 31.3547,
    typeof center?.[1] === 'number' && !isNaN(center[1]) ? center[1] : 34.3088
  ], [center?.[0], center?.[1]]);

  const safeZoom = useMemo(() => 
    typeof zoom === 'number' && !isNaN(zoom) ? zoom : 15
  , [zoom]);

  React.useEffect(() => {
    if (setAddress) setAddress("");
  }, [markerPosition]);

      const isLocationValid = 
        location?.governorate_id && 
        location?.municipality_id && 
        location?.neighborhood_id 

  return (
    <>
      <LeafletMap center={safeCenter} zoom={safeZoom} style={{ height, width }}>
        <ChangeView center={safeCenter} zoom={safeZoom} />

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        {setMarkerPosition ? (
          <LocationMarker
            position={markerPosition ?? null}
            setPosition={(pos) => {
              setMarkerPosition(pos);
              setOpenDialog(true);
            }}
            setZoom={setZoom}
          />
        ) : (
          markerPosition && <Marker position={markerPosition} />
        )}

        {children}
      </LeafletMap>
      {/* Remove location?.address check to ensure dialog opens even if geocoding is slow */}
      {isLocationValid ? (
        <FormDialog
          {...{ location }}
          isLoading={isLoading}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          canOpenDialogBuildings={false}
          {...{isLocationValid}}
        />
      ) : (
        <FormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          isLoading={isLoading}
          location={null}
          canOpenDialogBuildings={false}
          {...{isLocationValid}}
        />
      )}
      {/* {!location?.neighborhood &&<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4,
                    px: 2,
                    textAlign: 'center'
                  }}
                >
                  <Box 
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'error.lighter',
                      color: 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      backgroundColor: (theme) => theme.palette.error.main + '15'
                    }}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/>
                     <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/>
                     <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/>
                     <circle cx="12" cy="12" r="10"/>
                   </svg>
                  </Box>
                  
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    تحديد الحي الذي تتواجد فيه مطلوب
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 350 }}>
                    يرجى اختيار الحي الذي تتواجد فيه من الخريطة بدقة لتتمكن من تقديم طلب تقييم الأضرار
                  </Typography>
        
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    onClick={() => setOpenDialog(false)}
                    sx={{ px: 4, borderRadius: 2 }}
                  >
                    إغلاق
                  </Button>
                </Box>
      </Dialog>} */}
    </>
  );
};
export default MapContainer;
