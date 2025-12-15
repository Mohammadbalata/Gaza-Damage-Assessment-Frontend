import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import ChangeView from "./ChangeView";
import FlyToLocation from "./FlyToLocation";
import FormDialog from "./FormDialog";

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
  setApplications?: any;
  location?: any;
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
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
  setApplications,
  location,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  useEffect(() => {
    if (setAddress) setAddress("");
  }, [markerPosition]);

  return (
    <>
      <LeafletMap center={center} zoom={zoom} style={{ height, width }}>
        <ChangeView center={center} zoom={zoom} />

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        {setMarkerPosition && (
          <LocationMarker
            position={markerPosition ?? null}
            setPosition={(pos) => {
              setMarkerPosition(pos);
              setOpenDialog(true); // ✅ افتح الفورم
            }}
          />
        )}

        <FlyToLocation target={center} />
        {children}
      </LeafletMap>
      {location.governorate && (
        <FormDialog
          {...{ setApplications }}
          {...{ location }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};
export default MapContainer;
