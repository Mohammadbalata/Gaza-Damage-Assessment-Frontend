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
  const {
    nationalId,
    firstName,
    fatherName,
    grandfatherName,
    familyName,
    email,
    phoneNumber,
  } = useAppSelector((state) => state.auth);
  const { loading, error, currentLocation, previosLocations } = useAppSelector(
    (state) => state.location
  );

  const [loadingPage, setLoadingPage] = useState(loading);
  const [errorPage, setErrorPage] = useState(error);
  const dispatch = useAppDispatch();

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
            <div>
              <p className="text-sm text-gray-600">{t("form.fullName")}</p>
              <p className="font-medium">
                {firstName} {fatherName} {grandfatherName} {familyName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">البريد الإلكتروني</p>
              <p className="font-medium">{email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">رقم الموبايل</p>
              <p className="font-medium">{phoneNumber}</p>
            </div>
          </div>
        </section>
        {/* Previous Location (Before War) */}
        {previosLocations?.length && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">
                السكن السابق ( قبل الحرب )
              </h3>
            </div>

            {previosLocations?.map((location: any, index: number) => {
              const damageType =
                location?.extraData[location.extraData.buildingType]
                  ?.damageType;
              const propertyType =
                location?.extraData[location.extraData.buildingType]
                  ?.propertyType;
              const propertyArea =
                location?.extraData[location.extraData.buildingType]
                  ?.propertyArea;
              const isHabitable =
                location?.extraData[location.extraData.buildingType]
                  ?.isHabitable;

              return (
                <>
                  <section key={index + 1} className="mb-4 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        الممتلك - {index + 1}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("map.address")}
                      </p>
                      <p className="font-medium">{location.governorate}</p>
                    </div>
                  </section>
                  <section
                    key={index * 100}
                    className="mb-8 pb-8 border-b border-blue-400"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        تقييم أضرار الممتلك
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("form.damageLevel")}
                        </p>
                        <p className="font-medium capitalize">
                          {damageType || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          {t("form.propertyType")}
                        </p>
                        <p className="font-medium capitalize">
                          {propertyType || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          {t("form.propertySize")}
                        </p>
                        <p className="font-medium">
                          {propertyArea ?? 0} متر مربع
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          {t("form.isInhabitable")}
                        </p>
                        <p className="font-medium">
                          {isHabitable ? t("form.yes") : t("form.no")}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              );
            })}
          </>
        )}

        {/* Damage Assessment */}

        {/* Current Location */}
        {currentLocation.currentLocationAddress && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">السكن الحالي </h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("map.address")}</p>
              <p className="font-medium">
                {currentLocation.currentLocationAddress}
              </p>
            </div>
          </section>
        )}
      </div>
      <div className="flex gap-4">
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
