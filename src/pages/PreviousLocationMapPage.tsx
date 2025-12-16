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

const PreviousLocationMapPage = () => {
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();
  const { t } = useLanguage();

  const dispatch = useAppDispatch();
  const [position, setPosition] = useState<[number, number] | null>();
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState<string>(locations[11].name);

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.349013, 34.292483];

  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  const { loading, execute } = usePost(`applications/add-previous-location`, {
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

  const handleConfirm = () => {
    if (applications.length !== 0) {
      dispatch(
        updatePreviousLocation({
          previosLocations: applications,
        })
      );
      applications.map((application: any) => {
        execute({
          latitude: application.latitude.toString(),
          longitude: application.longitude.toString(),
          address: application.address,
          extraData: JSON.stringify({
            buildingType: application.buildingType,
            [application.buildingType]: application.extraData,
          }),
          neighborhood: application.neighborhood,
        });
      });
      console.log(applications);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">
          اختر موقعك السابق (قبل الحرب)
        </h2>
        <p className="text-gray-600 mb-4">
          يرجى النقر على الخريطة لتحديد موقع ممتلكاتك قبل الحرب.
        </p>
        <div className="mb-4 h-96 rounded-lg overflow-hidden border border-gray-300">
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

        <div className="flex flex-wrap gap-4">
          {/* <button
            type="button"
            onClick={() => navigate(`${ROUTES.PASSWORD_DISPLAY}`)}
            className="btn-outline basis-3/4 sm:basis-1/4 grow-[2] shrink-[2]"
          >
            {t("common.back")}
          </button> */}
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline grow-[2] shrink-[2]"
            disabled={!position}
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            {t("map.reset")}
          </button>
          <SelectLocations
            {...{ handleReset }}
            {...{ setNeighborhood }}
            setCenter={setCenter}
            className=" grow-[2] shrink-[2]"
          />
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-primary grow-[2] shrink-[2]"
            disabled={
              !position ||
              loading ||
              !address ||
              address === "لا يوجد اتصال في الانترنت"
            }
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
