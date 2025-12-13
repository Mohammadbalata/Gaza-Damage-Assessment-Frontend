import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updatePreviousLocation } from "../redux/slices/locationSlice";
import { ROUTES } from "../routes/Routes";
import MapContainer from "../components/MapContainer";
import { usePost } from "../hooks/api/useApi";

const PreviousLocationMapPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { previousLatitude, previousLongitude, previousLocationAddress } =
    useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>(
    previousLatitude && previousLongitude
      ? [previousLatitude, previousLongitude]
      : null
  );
  const [address, setAddress] = useState(previousLocationAddress || "");

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.3547, 34.3088];
  const center = position || defaultCenter;

  const { loading, execute } = usePost(`applications/add-previous-location`, {
    onSuccess: () => {
      navigate(`${ROUTES.DAMAGE_ASSESSMENT_DIALOG}`);
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
          setAddress(data.display_name || "Location selected");
        })
        .catch(() => {
          // setAddress(
          //   `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`
          // );
          setAddress('')
        });
    }
  }, [position]);

  const handleReset = () => {
    setPosition(null);
    setAddress("");
  };

  const handleConfirm = () => {
    if (position && address) {
      dispatch(
        updatePreviousLocation({
          previousLatitude: position[0],
          previousLongitude: position[1],
          previousLocationAddress,
        })
      );
      execute({
        latitude: position[0].toString(),
        longitude: position[1].toString(),
        governorate: address,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">
          Select Your Previous Location (Before War)
        </h2>
        <p className="text-gray-600 mb-4">
          Please click on the map to mark the location of your property before
          the war.
        </p>
        <div className="mb-4 h-96 rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={center}
            zoom={15}
            markerPosition={position}
            setMarkerPosition={setPosition}
            height="100%"
            width="100%"
            {...{setAddress}}
          />
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
            onClick={() => navigate(`${ROUTES.PASSWORD_DISPLAY}`)}
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
            disabled={(!position || loading || !address)}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {t("common.loading")}
              </div>
            ) : (
              <>
                <Check className="w-4 h-4 inline mr-2" />
                {t("map.confirm")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviousLocationMapPage;
