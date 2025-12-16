import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  saveAdditionalBuildings,
  saveApartmentInsideBuilding,
  saveCompHouse,
  saveIndependentBuilding,
  saveResidentialBuilding,
  saveTower,
  setBuildingType,
} from "../redux/slices/damageSlice";
import { buildingOptions } from "../utils/DamageAssessment";
import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";
import IndependentBuilding from "../components/Form Applications/IndependentBuilding";
import Tower from "../components/Form Applications/Tower";

import ApartmentInsideBuilding from "../components/Form Applications/ApartmentInsideBuilding";
import CampHousing from "../components/Form Applications/CampHousing";
import AdditionalBuildings from "../components/Form Applications/AdditionalBuildings";
import ResidentialBuilding from "../components/Form Applications/ResidentialBuilding";
import { AlertCircle } from "lucide-react";
import { Button, DialogActions } from "@mui/material";
import { useEffect } from "react";

const DamageAssessmentDialog = ({
  setApplications,
  onClose,
  location,
}: any) => {
  const { t } = useLanguage();
  const damageAssessmentInfo = useAppSelector((state) => state.damage);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
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
    dispatch(setBuildingType("")); // يرجع على <option value="">
  };

  const onSubmit = (formData: IDamageAssessmentState) => {
    // dispatchBuildingType(dispatch, formData);
    console.log(formData);
    const type = formData.buildingType;
    if (type === "IndependentBuilding") {
      dispatch(saveIndependentBuilding(formData));
      setApplications((prev: any) => [
        ...prev,
        {
          buildingType: type,
          extraData: formData.IndependentBuilding,
          latitude: location?.position[0],
          longitude: location?.position[1],
          address: location?.address,
          neighborhood: location?.neighborhood,
        },
      ]);
    }
    if (type === "ApartmentInsideBuilding") {
      dispatch(saveApartmentInsideBuilding(formData));
      setApplications((prev: any) => [
        ...prev,
        {
          buildingType: type,
          extraData: formData.ApartmentInsideBuilding,
          latitude: location?.position[0],
          longitude: location?.position[1],
          address: location?.address,
          neighborhood: location?.neighborhood,
        },
      ]);
    }
    if (type === "ResidentialBuilding") {
      dispatch(saveResidentialBuilding(formData));
      setApplications((prev: any) => [
        ...prev,
        {
          buildingType: type,
          extraData: formData.ResidentialBuilding,
          latitude: location?.position[0],
          longitude: location?.position[1],
          address: location?.address,
          neighborhood: location?.neighborhood,
        },
      ]);
    }

    if (type === "tower") {
      dispatch(saveTower(formData));
      setApplications((prev: any) => [
        ...prev,
        {
          buildingType: type,
          extraData: formData.tower,
          latitude: location?.position[0],
          longitude: location?.position[1],
          address: location?.address,
          neighborhood: location?.neighborhood,
        },
      ]);
    }
    if (type === "compHouse") {
      dispatch(saveCompHouse(formData));
      setApplications((prev: any) => [
        ...prev,
        {
          buildingType: type,
          extraData: formData.compHouse,
          latitude: location?.position[0],
          longitude: location?.position[1],
          address: location?.address,
          neighborhood: location?.neighborhood,
        },
      ]);
    }
    if (type === "additionalBuildings") {
      dispatch(saveAdditionalBuildings(formData));
      setApplications((prev: any) => [
        ...prev,
        {
          buildingType: type,
          extraData: formData.additionalBuildings,
          latitude: location?.position[0],
          longitude: location?.position[1],
          address: location?.address,
          neighborhood: location?.neighborhood,
        },
      ]);
    }
    console.log("success submitted");
    onClose();
    // Reset form values
  };
  useEffect(() => {
    resetBuildingTypeSelect();
  }, [onClose]);

  const BuildingTypeView = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected = damageAssessmentInfo.buildingType;
    switch (selected) {
      case "IndependentBuilding":
        return <IndependentBuilding {...{ register }} {...{ errors }} />;
      case "ApartmentInsideBuilding":
        return <ApartmentInsideBuilding {...{ register }} {...{ errors }} />;
      case "ResidentialBuilding":
        return <ResidentialBuilding {...{ register }} {...{ errors }} />;
      case "tower":
        return <Tower {...{ register }} {...{ errors }} />;
      case "compHouse":
        return <CampHousing {...{ register }} {...{ errors }} />;
      case "additionalBuildings":
        return <AdditionalBuildings {...{ register }} {...{ errors }} />;
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

      <div className="card shadow-none hover:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Damage Assessment</h2>
        </div>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="buildingType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              نوع المبنى <span className="text-red-500">*</span>
            </label>
            <select
              id="buildingType"
              {...register("buildingType", { required: t("common.required") })}
              className="input-field"
              onChange={(e) => {
                // dispatch(resetAllBuildings()); // امسح بيانات المباني السابقة
                dispatch(setBuildingType(e.target.value)); // احفظ النوع الجديد
              }}
            >
              <option value="">{t("common.required")}</option>
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
            <Button className="!text-[17px]" onClick={onClose}>
              إلغاء
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              اعتماد الطلب
            </Button>
          </DialogActions>
        </form>
      </div>
    </div>
  );
};

export default DamageAssessmentDialog;
