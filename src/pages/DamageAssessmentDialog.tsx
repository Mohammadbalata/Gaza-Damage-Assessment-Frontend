import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  resetAllBuildings,
  setBuildingType,
} from "../redux/slices/damageSlice";
import {
  buildFormDataWithoutImages,
  buildingOptions,
  dispatchByType,
} from "../utils/DamageAssessment";
import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";
import IndependentBuilding from "../components/Form Applications/IndependentBuilding";
import Tower from "../components/Form Applications/Tower";

import ApartmentInsideBuilding from "../components/Form Applications/ApartmentInsideBuilding";
import CampHousing from "../components/Form Applications/CampHousing";
import AdditionalBuildings from "../components/Form Applications/AdditionalBuildings";
import ResidentialBuilding from "../components/Form Applications/ResidentialBuilding";
import { AlertCircle } from "lucide-react";
import { Button, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { axiosClient } from "../api/baseUrl";

const DamageAssessmentDialog = ({
  setApplications,
  onClose,
  location,
  setIsCurrentLocation,
}: any) => {
  const { t } = useLanguage();
  const damageAssessmentInfo = useAppSelector((state) => state.damage);
  const dispatch = useAppDispatch();
  const [isChangeToReviewPage, setIsChangeToReviewPage] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IDamageAssessmentState>({
    defaultValues: {
      buildingType: damageAssessmentInfo.buildingType || "",
      IndependentBuilding: damageAssessmentInfo.IndependentBuilding || "",
      ApartmentInsideBuilding: damageAssessmentInfo.ApartmentInsideBuilding,
      ResidentialBuilding: damageAssessmentInfo.ResidentialBuilding,
      tower: damageAssessmentInfo.tower || "",
      loading: damageAssessmentInfo.loading,
      error: damageAssessmentInfo.error,
    },
  });
  const resetBuildingTypeSelect = () => {
    setValue("buildingType", "");
    dispatch(setBuildingType(""));
    dispatch(resetAllBuildings()); // يرجع على <option value="">
  };

  const addApplication = (
    type: string,
    extraData: any,
    images: {
      beforeWarImage?: File;
      afterWarImage?: File;
      ownershipDocuments?: File[];
    }
  ) => {
    setApplications((prev: any) => [
      ...prev,
      {
        buildingType: type,
        extraData,
        latitude: location?.position[0],
        longitude: location?.position[1],
        address: location?.address,
        neighborhood: location?.neighborhood,
        ...images,
      },
    ]);
  };

  const onSubmit = (formData: any) => {
    setIsChangeToReviewPage(true);
    if (!isChangeToReviewPage) return;

    const type = formData.buildingType;
    const formDataWithoutImg: any = buildFormDataWithoutImages(formData);

    dispatchByType(dispatch, type, formDataWithoutImg);

    addApplication(type, formDataWithoutImg[type], {
      beforeWarImage: formData[type]?.beforeWarImage,
      afterWarImage: formData[type]?.afterWarImage,
      ownershipDocuments: formData[type]?.ownershipDocuments,
    });
    console.log("success submitted");

    onClose();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axiosClient
      .get("/applications/my-application", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: any) => {
        const isCurrentLocation = res.data.data.locations.filter(
          (location: any) => location.type === "CURRENT"
        );
        if (isCurrentLocation.length !== 0) {
          setIsCurrentLocation(true);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    resetBuildingTypeSelect();
  }, [onClose]);

  const BuildingTypeView = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected = damageAssessmentInfo.buildingType;
    switch (selected) {
      case "IndependentBuilding":
        return (
          <IndependentBuilding
            {...{ register }}
            {...{ watch }}
            {...{ control }}
            {...{ errors }}
            {...{ isChangeToReviewPage }}
          />
        );
      case "ApartmentInsideBuilding":
        return (
          <ApartmentInsideBuilding
            {...{ register }}
            {...{ watch }}
            {...{ control }}
            {...{ errors }}
            {...{ isChangeToReviewPage }}
          />
        );
      case "ResidentialBuilding":
        return (
          <ResidentialBuilding
            {...{ register }}
            {...{ watch }}
            {...{ control }}
            {...{ errors }}
            {...{ isChangeToReviewPage }}
          />
        );
      case "tower":
        return (
          <Tower
            {...{ register }}
            {...{ watch }}
            {...{ control }}
            {...{ errors }}
            {...{ isChangeToReviewPage }}
          />
        );
      case "compHouse":
        return (
          <CampHousing
            {...{ register }}
            {...{ watch }}
            {...{ control }}
            {...{ errors }}
            {...{ isChangeToReviewPage }}
          />
        );
      case "additionalBuildings":
        return (
          <AdditionalBuildings
            {...{ register }}
            {...{ watch }}
            {...{ control }}
            {...{ errors }}
            {...{ isChangeToReviewPage }}
          />
        );
    }
  };

  return (
    <div className="w-full mx-auto">
      {damageAssessmentInfo.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{damageAssessmentInfo.error}</p>
        </div>
      )}

      <div
        className={classNames("card shadow-none hover:shadow-none", {
          "bg-gray-200": isChangeToReviewPage,
        })}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Damage Assessment</h2>
        </div>
        <form className="space-y-6">
          <div
            className={classNames({
              "cursor-not-allowed": isChangeToReviewPage,
            })}
          >
            <label
              htmlFor="buildingType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              نوع المبنى <span className="text-red-500">*</span>
            </label>
            <select
              id="buildingType "
              {...register("buildingType", { required: t("common.required") })}
              className={classNames("input-field", {
                " cursor-not-allowed bg-gray-200": isChangeToReviewPage,
              })}
              onChange={(e) => {
                // dispatch(resetAllBuildings()); // امسح بيانات المباني السابقة
                dispatch(setBuildingType(e.target.value)); // احفظ النوع الجديد
              }}
              disabled={isChangeToReviewPage ? true : false}
            >
              <option value="">اختر مبنى</option>
              {buildingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.buildingType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.buildingType.message}
              </p>
            )}
          </div>
          <BuildingTypeView />
          <DialogActions>
            <Button
              className="!text-[17px]"
              onClick={() => {
                dispatch(resetAllBuildings());
                onClose();
                setIsChangeToReviewPage(false);
              }}
            >
              إلغاء
            </Button>
            <Button
              className={classNames(
                isChangeToReviewPage ? "!inline-block" : "!hidden"
              )}
              onClick={() => {
                setIsChangeToReviewPage(false);
              }}
              variant="outlined"
            >
              تعديل الطلب
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              {isChangeToReviewPage ? "اعتماد الطلب" : "مراجعة الطلب"}
            </Button>
          </DialogActions>
        </form>
      </div>
    </div>
  );
};

export default DamageAssessmentDialog;
