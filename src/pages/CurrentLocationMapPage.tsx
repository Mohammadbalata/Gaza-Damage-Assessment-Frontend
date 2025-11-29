import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useLanguage } from "../contexts/LanguageContext";
import { RotateCcw, Check } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ILocationMarkerProps } from "../interfaces/props/ILocationMarkerProps";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateCurrentLocation } from "../redux/slices/locationSlice";
import { ROUTES } from "../routes/Routes";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }: ILocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const CurrentLocationMapPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentLatitude, currentLongitude, currentLocationAddress } =
    useAppSelector((state) => state.location);
    const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>(
    currentLatitude && currentLongitude
      ? [currentLatitude, currentLongitude]
      : null
  );
  const [address, setAddress] = useState(currentLocationAddress || "");

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const center = position || defaultCenter;

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
    if (position) {
    dispatch(updateCurrentLocation({ lat: position[0], lng: position[1], address }))
      navigate(`${ROUTES.REVIEW}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">
          Select Your Current Location
        </h2>
        <p className="text-gray-600 mb-4">
          Please click on the map to mark your current location (where you are
          now).
        </p>

        <div className="mb-4 h-96 rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={center}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {position && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("map.coordinates")}
              </label>
              <p className="text-gray-900">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("map.address")}
              </label>
              <p className="text-gray-900">{address}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(`${ROUTES.DAMAGE_ASSESSMENT_DIALOG}`)}
            className="btn-outline flex-1"
          >
            {t("common.back")}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline flex-1"
            disabled={!position}
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            {t("map.reset")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-primary flex-1"
            disabled={!position}
          >
            <Check className="w-4 h-4 inline mr-2" />
            {t("map.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentLocationMapPage;
