import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

import { FileText, MapPin, Home, AlertTriangle } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { axiosClient } from "../api/baseUrl";
import { getReviewData } from "../utils/getReviewData";
import { ROUTES } from "../routes/Routes";

const ReviewPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { nationalId } = useAppSelector((state) => state.auth);
  const { previousLocationAddress, currentLocationAddress, loading, error } =
    useAppSelector((state) => state.location);

  const damageState = useAppSelector((state) => state.damage);

  const buildingMap: any = {
    IndependentBuilding: damageState.IndependentBuilding,
    ApartmentInsideBuilding: damageState.ApartmentInsideBuilding,
    ResidentialBuilding: damageState.ResidentialBuilding,
    tower: damageState.tower,
    compHouse: damageState.compHouse,
    additionalBuildings: damageState.additionalBuildings,
  };
  // const selected = buildingOptions.filter((element: any) => {
  //   if (element.value === 'compHouse') {
  //     // console.log(buildingMap[element.value])
  //     return buildingMap[element.value]
  //   }
  // });
  // console.log(selected);
  const selected = buildingMap[damageState.buildingType] || {};
  // console.log(selected)
  const { damageType, isHabitable, propertyType, propertyArea } = selected;
  const [loadingPage, setLoadingPage] = useState(loading);
  const [errorPage, setErrorPage] = useState(error);
  const dispatch = useAppDispatch();
  // const pageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    navigate(`${ROUTES.SUCCESS}`);
  };

  useEffect(() => {
    setLoadingPage(true);
    const token = localStorage.getItem("token");
    axiosClient
      .get("/applications/my-application", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: any) => {
        getReviewData(dispatch, res);
        setLoadingPage(false);
      })
      .catch((error: any) => {
        setLoadingPage(false);
        setErrorPage(error);
        console.log(error);
      });
  }, []);
  if (loadingPage) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }
  if (errorPage) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg text-gray-700 mb-2">{errorPage.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
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
            {/* <div>
              <p className="text-sm text-gray-600">{t("form.fullName")}</p>
              <p className="font-medium">{}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.motherName")}</p>
              <p className="font-medium">{}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("form.dateOfBirth")}</p>
              <p className="font-medium">{}</p>
            </div> */}
          </div>
        </section>

        {/* Family Information */}
        {/* <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("review.familyInfo")}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">
                {t("form.addressBeforeWar")}
              </p>
              <p className="font-medium">{}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                {t("form.numberOfChildren")}
              </p>
              <p className="font-medium">{}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.wifeName")}</p>
              <p className="font-medium">{}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                {t("form.wifeNationalId")}
              </p>
              <p className="font-medium">{}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.phoneNumber")}</p>
              <p className="font-medium">{}</p>
            </div>
          </div>
        </section> */}

        {/* Damage Assessment */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("review.damageInfo")}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t("form.damageLevel")}</p>
              <p className="font-medium capitalize">{damageType || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.propertyType")}</p>
              <p className="font-medium capitalize">{ propertyType || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.propertySize")}</p>
              <p className="font-medium">{propertyArea ?? 0} متر مربع</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{t("form.isInhabitable")}</p>
              <p className="font-medium">
                {isHabitable ? t("form.yes") : t("form.no")}
              </p>
            </div>
          </div>
        </section>

        {/* Previous Location (Before War) */}
        {previousLocationAddress && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">
                السكن السابق ( قبل الحرب )
              </h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("map.address")}</p>
              <p className="font-medium">{previousLocationAddress}</p>
            </div>
          </section>
        )}

        {/* Current Location */}
        {currentLocationAddress && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">السكن الحالي </h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("map.address")}</p>
              <p className="font-medium">{currentLocationAddress}</p>
            </div>
          </section>
        )}

        {/* Documents */}
        {/* {data.documents && data.documents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">{t("review.documents")}</h3>
            </div>
            <p className="text-gray-600">
              {data.documents.length} file(s) uploaded
            </p>
          </section>
        )} */}
      </div>

      <div className="flex gap-4">
        {/* <button
          onClick={downloadPDF}
          className="btn-primary px-6 py-3 rounded-lg font-medium w-full"
        >
          {t("success.downloadReceipt")}
        </button> */}

        <button
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
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
