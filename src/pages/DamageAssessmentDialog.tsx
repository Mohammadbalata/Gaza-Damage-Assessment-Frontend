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

interface DamageAssessmentDialogProps {
  setApplications?: any;
  onClose: () => void;
  location: any;
  readOnly?: boolean;
  initialData?: any;
  setIsCurrentLocation?: any;
}

const DamageAssessmentDialog = ({
  setApplications,
  onClose,
  location,
  readOnly = false,
  initialData,
  setIsCurrentLocation,
}: DamageAssessmentDialogProps) => {
  const { t } = useLanguage();
  const damageAssessmentInfo = useAppSelector((state) => state.damage);
  const dispatch = useAppDispatch();
  const [isChangeToReviewPage, setIsChangeToReviewPage] = useState(readOnly);
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

  useEffect(() => {
    if (initialData) {
      const type = initialData?.extraData?.buildingType;
      dispatch(setBuildingType(type));
      setValue("buildingType", type);
      if (initialData.extraData) {
        setValue(type as any, initialData.extraData[type]);

        dispatchByType(dispatch, type, initialData.extraData);
      }
    }
  }, [initialData, dispatch, setValue]);

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
    if (readOnly) {
      onClose();
      return;
    }

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
      .get("/applications/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: any) => {
        console.log(res.data.data.citizen.current_location);
        const isCurrentLocation = res.data.data.citizen.current_location;
        if (isCurrentLocation) {
          setIsCurrentLocation(true);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!initialData) {
      resetBuildingTypeSelect();
    }
  }, [onClose]);

  const BuildingTypeView = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected =
      damageAssessmentInfo.buildingType || initialData.extraData.buildingType;
    // Pass readOnly/disabled state to children if they support it
    // Using CSS pointer-events-none for a generic read-only mode wrapper could also work
    const commonProps = {
      register,
      watch,
      control,
      errors,
      isChangeToReviewPage: isChangeToReviewPage, // Keep existing review logic
    };

    switch (selected) {
      case "IndependentBuilding":
        return <IndependentBuilding {...commonProps} />;
      case "ApartmentInsideBuilding":
        return <ApartmentInsideBuilding {...commonProps} />;
      case "ResidentialBuilding":
        return <ResidentialBuilding {...commonProps} />;
      case "tower":
        return <Tower {...commonProps} />;
      case "compHouse":
        return <CampHousing {...commonProps} />;
      case "additionalBuildings":
        return <AdditionalBuildings {...commonProps} />;
      default:
        return null;
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
          "bg-gray-200": isChangeToReviewPage || readOnly,
        })}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {readOnly ? t("common.reviewRequest") : "Damage Assessment"}
          </h2>
        </div>
        <form
          className={classNames("space-y-6", {
            "pointer-events-none opacity-80": readOnly,
          })}
        >
          <div
            className={classNames({
              "cursor-not-allowed": isChangeToReviewPage || readOnly,
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
                " cursor-not-allowed bg-gray-200":
                  isChangeToReviewPage || readOnly,
              })}
              onChange={(e) => {
                // dispatch(resetAllBuildings()); // امسح بيانات المباني السابقة
                dispatch(setBuildingType(e.target.value)); // احفظ النوع الجديد
              }}
              disabled={isChangeToReviewPage || readOnly}
              value={damageAssessmentInfo.buildingType} // Ensure controlled value from store/form match
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

          {/* Actions Area - Hide/Modify based on ReadOnly */}
          {!readOnly && (
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
          )}

          {readOnly && (
            <DialogActions>
              <Button variant="contained" onClick={onClose}>
                {t("common.close")}
              </Button>
            </DialogActions>
          )}
        </form>
      </div>
    </div>
  );
};

export default DamageAssessmentDialog;
