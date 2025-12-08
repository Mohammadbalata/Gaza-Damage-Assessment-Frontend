import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useApplicationStore } from "../store/applicationStore";
import { FileText, MapPin, Home, Users } from "lucide-react";
import { generateTrackingNumber } from "../utils/helpers";
import { useAppSelector } from "../hooks/redux";
import { useEffect, useState, useRef } from "react";
import { axiosClient } from "../api/baseUrl";
import generatePDF from "react-to-pdf";

const ReviewPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data, setTrackingNumber } = useApplicationStore();
  const [applicationData, setApplicationData] = useState<any>({});

  const { nationalId } = useAppSelector((state) => state.auth);
  const { fullName, motherName, dateOfBirth } = useAppSelector(
    (state) => state.personal
  );

  const {
    addressBeforeWar,
    numberOfChildren,
    wifeNationalId,
    wifeName,
    phoneNumber,
  } = useAppSelector((state) => state.family);

  const {
    damageLevel,
    propertySize,
    isInhabitable,
    propertyType,
    numberOfRooms,
  } = useAppSelector((state) => state.damage);

  const pageRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    generatePDF(pageRef, { filename: "review-page.pdf" });
  };

  const handleSubmit = () => {
    const trackingNum = generateTrackingNumber();
    setTrackingNumber(trackingNum);
    navigate("/success");
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosClient.get("/applications/my-application", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.data) setApplicationData(res.data.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchApplication();
  }, []);

  console.log(applicationData);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6" ref={pageRef}>
        <h2 className="text-2xl font-bold mb-6">{t("review.title")}</h2>

        {/* Identity Information */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">
              {t("review.identityInfo")}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t("auth.nationalId")}</p>
              <p className="font-medium">{nationalId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.fullName")}</p>
              <p className="font-medium">{fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.motherName")}</p>
              <p className="font-medium">{motherName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.dateOfBirth")}</p>
              <p className="font-medium">{dateOfBirth}</p>
            </div>
          </div>
        </section>

        {/* Family Information */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("review.familyInfo")}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">
                {t("form.addressBeforeWar")}
              </p>
              <p className="font-medium">{addressBeforeWar}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                {t("form.numberOfChildren")}
              </p>
              <p className="font-medium">{numberOfChildren}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.wifeName")}</p>
              <p className="font-medium">{wifeName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                {t("form.wifeNationalId")}
              </p>
              <p className="font-medium">{wifeNationalId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.phoneNumber")}</p>
              <p className="font-medium">{phoneNumber}</p>
            </div>
          </div>
        </section>

        {/* Damage Assessment */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("review.damageInfo")}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t("form.damageLevel")}</p>
              <p className="font-medium capitalize">{damageLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.propertyType")}</p>
              <p className="font-medium capitalize">{propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.propertySize")}</p>
              <p className="font-medium">{propertySize} sq meters</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.numberOfRooms")}</p>
              <p className="font-medium">{numberOfRooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.isInhabitable")}</p>
              <p className="font-medium">
                {isInhabitable ? t("form.yes") : t("form.no")}
              </p>
            </div>
          </div>
        </section>

        {/* Previous Location (Before War) */}
        {data.previousLatitude && data.previousLongitude && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">
                Previous Location (Before War)
              </h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("map.address")}</p>
              <p className="font-medium">{data.previousLocationAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                {data.previousLatitude.toFixed(6)},{" "}
                {data.previousLongitude.toFixed(6)}
              </p>
            </div>
          </section>
        )}

        {/* Current Location */}
        {data.currentLatitude && data.currentLongitude && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Current Location</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("map.address")}</p>
              <p className="font-medium">{data.currentLocationAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                {data.currentLatitude.toFixed(6)},{" "}
                {data.currentLongitude.toFixed(6)}
              </p>
            </div>
          </section>
        )}

        {/* Documents */}
        {data.documents && data.documents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">{t("review.documents")}</h3>
            </div>
            <p className="text-gray-600">
              {data.documents.length} file(s) uploaded
            </p>
          </section>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={downloadPDF}
          className="btn-primary px-6 py-3 rounded-lg font-medium w-full"
        >
          {t("success.downloadReceipt")}
        </button>

        {/* <button
          type="button"
          onClick={() => navigate("/current-location")}
          className="btn-outline flex-1"
        >
          {t("common.back")}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary flex-1"
        >
          {t("review.submit")}
        </button> */}
      </div>
    </div>
  );
};

export default ReviewPage;
