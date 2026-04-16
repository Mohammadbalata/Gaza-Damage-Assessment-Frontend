import { useMap } from "react-leaflet";
import { useEffect } from "react";

const ChangeView = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const isDifferent = 
      Math.abs(currentCenter.lat - center[0]) > 0.0001 || 
      Math.abs(currentCenter.lng - center[1]) > 0.0001 || 
      currentZoom !== zoom;

    if (isDifferent) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 0.8, // Match the 800ms duration from ArcGISMapContainer
      });
    }
  }, [center, zoom, map]);

  return null;
};

export default ChangeView;
