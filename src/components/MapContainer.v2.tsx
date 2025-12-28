import React, { useRef, useEffect, useState } from "react";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import "@arcgis/core/assets/esri/themes/light/main.css";
import FormDialog from "./FormDialog";

interface ArcGISMapContainerProps {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  markerPosition?: [number, number] | null;
  setMarkerPosition?: (pos: [number, number]) => void;
  children?: React.ReactNode;
  height?: string;
  width?: string;
  location?: any;
  setAddress?: (addr: string) => void;
  webmapId?: string; // ArcGIS WebMap ID (optional)
}

const ArcGISMapContainer: React.FC<ArcGISMapContainerProps> = ({
  center,
  zoom = 13,
  markerPosition,
  setMarkerPosition,
  children,
  height = "100%",
  width = "100%",
  location,
  setAddress,
  webmapId = "904af244856c476d809250d2604d9db0", // default WebMap
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);

  // initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const webmap = new WebMap({
      portalItem: { id: webmapId },
    });

    const viewInstance = new MapView({
      container: mapRef.current,
      map: webmap,
      center: center,
      zoom: zoom,
    });

    // create a graphics layer for marker
    const graphicsLayer = new GraphicsLayer();
    webmap.add(graphicsLayer);
    graphicsLayerRef.current = graphicsLayer;

    // click event for placing marker
    viewInstance.on("click", (evt) => {
      const { longitude, latitude } = evt.mapPoint;
      const pos: [number, number] = [longitude, latitude];

      // set marker position
      setMarkerPosition?.(pos);
      setOpenDialog(true);

      // add marker graphic
      graphicsLayer.removeAll();
      const pointGraphic = new Graphic({
        geometry: { type: "point", longitude, latitude },
        symbol: {
          type: "simple-marker",
          color: "red",
          size: 12,
          outline: { color: "white", width: 1 },
        },
      });
      graphicsLayer.add(pointGraphic);

      // reset address if needed
      setAddress?.("");
    });

    setView(viewInstance);

    return () => {
      viewInstance.destroy();
    };
  }, [mapRef]);

  // update marker if markerPosition changes externally
  useEffect(() => {
    if (!markerPosition || !graphicsLayerRef.current) return;
    graphicsLayerRef.current.removeAll();
    const [longitude, latitude] = markerPosition;
    const pointGraphic = new Graphic({
      geometry: { type: "point", longitude, latitude },
      symbol: {
        type: "simple-marker",
        color: "red",
        size: 12,
        outline: { color: "white", width: 1 },
      },
    });
    graphicsLayerRef.current.add(pointGraphic);

    // pan to marker
    view?.goTo({ center: markerPosition, zoom });
  }, [markerPosition]);

  return (
    <>
      <div ref={mapRef} style={{ height, width }} />
      {children}
      {location?.address && (
        <FormDialog
          {...{ location }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};

export default ArcGISMapContainer;
