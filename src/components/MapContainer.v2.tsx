import React, { useRef, useEffect, useState, useMemo } from "react";
import { CircularProgress, Box } from "@mui/material";
import FormDialog from "./FormDialog";

interface ArcGISMapContainerProps {
  center: [number, number]; // [lat, lng]
  zoom?: number;
  markerPosition?: [number, number] | null;
  setMarkerPosition?: (pos: [number, number]) => void;
  children?: React.ReactNode;
  height?: string;
  width?: string;
  location?: any;
  setAddress?: (addr: string) => void;
  webmapId?: string; // ArcGIS WebMap ID (optional)
  readOnly?: boolean; // إذا true، الخريطة للعرض فقط
  isLoading?: boolean;
  setZoom?: (zoom: number) => void;
}

// Extend Window interface to include esri
declare global {
  interface Window {
    require: any;
    esri: any;
  }
}

const ArcGISMapContainer: React.FC<ArcGISMapContainerProps> = ({
  center,
  zoom = 13,
  readOnly,
  markerPosition,
  setMarkerPosition,
  children,
  height = "100%",
  width = "100%",
  location,
  setAddress,
  webmapId = "904af244856c476d809250d2604d9db0", // default WebMap
  isLoading,
  setZoom,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setView] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const graphicsLayerRef = useRef<any>(null);
  const viewRef = useRef<any>(null);

  // initialize map with WebMap ID using CDN
  useEffect(() => {
    if (!mapRef.current) return;

    setLoading(true);
    let isMounted = true;

    // Check if ArcGIS API is loaded
    if (!window.require) {
      console.error(
        "ArcGIS API not loaded. Make sure to include the script in your index.html",
      );
      setLoading(false);
      return;
    }

    // Load ArcGIS modules from CDN
    window.require(
      [
        "esri/WebMap",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
      ],
      (WebMap: any, MapView: any, Graphic: any, GraphicsLayer: any) => {
        if (!isMounted || !mapRef.current) return;

        const webmap = new WebMap({
          portalItem: { id: webmapId },
          basemap: "satellite",
        });

        const viewInstance = new MapView({
          container: mapRef.current,
          map: webmap,
          center: [center[1], center[0]], // Convert [lat, lng] to [lng, lat] for ArcGIS
          zoom: zoom,
        });

        viewRef.current = viewInstance;

        // Watch for zoom changes
        viewInstance.watch("zoom", (newValue: number) => {
          if (typeof setZoom === "function") {
            setZoom(newValue);
          }
        });

        // Wait for webmap to load before adding graphics layer
        webmap.when(() => {
          if (!isMounted) return;

          // create a graphics layer for marker
          const graphicsLayer = new GraphicsLayer();
          webmap.add(graphicsLayer);
          graphicsLayerRef.current = graphicsLayer;
        });

        // click event for placing marker
        if (!readOnly) {
          viewInstance.on("click", (evt: any) => {
            const { latitude, longitude } = evt.mapPoint;
            const pos: [number, number] = [latitude, longitude];

            if (setMarkerPosition) {
              setMarkerPosition(pos);
              setOpenDialog(true);
            }

            if (graphicsLayerRef.current) {
              graphicsLayerRef.current.removeAll();
              const pointGraphic = new Graphic({
                geometry: { type: "point", latitude, longitude },
                symbol: {
                  type: "simple-marker",
                  color: [226, 119, 40],
                  size: 16,
                  outline: { color: [255, 255, 255], width: 3 },
                },
              });
              graphicsLayerRef.current.add(pointGraphic);
            }

            if (setAddress) setAddress("");
          });
        }

        // Wait for view to be ready
        viewInstance
          .when(() => {
            if (!isMounted) return;
            setView(viewInstance);
            setLoading(false);
          })
          .catch((error: any) => {
            console.error("Error loading map:", error);
            if (isMounted) setLoading(false);
          });
      },
    );

    return () => {
      isMounted = false;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [webmapId, readOnly]);

  // Robust coordinate sanitation with stability
  const safeCenter = useMemo(
    () => [
      typeof center?.[0] === "number" && !isNaN(center[0])
        ? center[0]
        : 31.3547,
      typeof center?.[1] === "number" && !isNaN(center[1])
        ? center[1]
        : 34.3088,
    ],
    [center?.[0], center?.[1]],
  );

  const safeZoom = useMemo(
    () => (typeof zoom === "number" && !isNaN(zoom) ? zoom : 13),
    [zoom],
  );

  // update view center when safeCenter or safeZoom changes
  useEffect(() => {
    if (viewRef.current && !loading) {
      viewRef.current
        .goTo(
          {
            center: [safeCenter[1], safeCenter[0]], // Convert [lat, lng] to [lng, lat]
            zoom: safeZoom,
          },
          {
            duration: 800, // smooth animation
          },
        )
        .catch((error: any) => {
          console.log(error);
          console.log("Navigation cancelled or failed");
        });
    }
  }, [safeCenter, safeZoom, loading]);

  // update marker if markerPosition changes externally
  useEffect(() => {
    if (!markerPosition || !graphicsLayerRef.current) {
      // Clear marker if position is null
      if (!markerPosition && graphicsLayerRef.current) {
        graphicsLayerRef.current.removeAll();
      }
      return;
    }

    // Load Graphic module to create marker
    if (!window.require) return;

    window.require(["esri/Graphic"], (Graphic: any) => {
      if (graphicsLayerRef.current) {
        graphicsLayerRef.current.removeAll();
        const [latitude, longitude] = markerPosition; // Assumed [lat, lng]
        const pointGraphic = new Graphic({
          geometry: {
            type: "point",
            latitude,
            longitude, // API accepts { latitude, longitude }
          },
          symbol: {
            type: "simple-marker",
            color: [226, 119, 40], // Orange color
            size: 16,
            outline: {
              color: [255, 255, 255],
              width: 3,
            },
          },
        });
        graphicsLayerRef.current.add(pointGraphic);

        // pan to marker if view is ready
        if (viewRef.current && !loading) {
          viewRef.current
            .goTo(
              {
                center: [markerPosition[1], markerPosition[0]], // Convert [lat, lng] to [lng, lat]
                zoom,
              },
              {
                duration: 800,
              },
            )
            .catch((error: any) => {
              console.log(error);
              console.log("Navigation cancelled or failed");
            });
        }
      }
    });
  }, [markerPosition, zoom, loading]);

  const isLocationValid = 
    location?.governorate_id && 
    location?.municipality_id && 
    location?.neighborhood_id

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div ref={mapRef} style={{ height, width }} />
      {children}
      {isLocationValid ? (
        <FormDialog
          {...{ location }}
          isLoading={isLoading}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          canOpenDialogBuildings={true}
          {...{isLocationValid}}
        />
      ) : (
        <FormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          isLoading={isLoading}
          location={null} // Passing null indicates invalid location to FormDialog
          canOpenDialogBuildings={true}
          {...{isLocationValid}}
        />
      )}
    </>
  );
};

export default ArcGISMapContainer;
