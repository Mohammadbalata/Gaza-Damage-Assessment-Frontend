import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  resetAllBuildings,
  saveApartmentInsideBuilding,
  saveIndependentBuilding,
  saveTower,
  saveResidentialBuilding,
  setBuildingType,
  saveCompHouse,
  saveAdditionalBuildings,
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

const DamageAssessmentDialog = () => {
  // const navigate = useNavigate();
  const { t } = useLanguage();
  const damageAssessmentInfo = useAppSelector((state) => state.damage);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
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

  const onSubmit = (formData: IDamageAssessmentState) => {
    const type = formData.buildingType;
    if (type === "independentBuilding")
      dispatch(saveIndependentBuilding(formData));
    if (type === "apartmentInsideBuilding")
      dispatch(saveApartmentInsideBuilding(formData));
    if (type === "residentialBuilding")
      dispatch(saveResidentialBuilding(formData));
    if (type === "Tower") dispatch(saveTower(formData));
    if (type === "Camp") {
      dispatch(saveCompHouse(formData));
    }
    if (type === "additionalBuildings")
      dispatch(saveAdditionalBuildings(formData));

    // navigate(`${ROUTES.CURRENT_LOCATION}`);
    console.log("success submitted");
    // console.log(formData);

    // navigate(`${ROUTES.CURRENT_LOCATION}`);
  };
  const BuildingTypeView = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected = damageAssessmentInfo.buildingType;
    switch (selected) {
      case "independentBuilding":
        return <IndependentBuilding {...{ register }} {...{ errors }} />;
      case "apartmentInsideBuilding":
        return <ApartmentInsideBuilding {...{ register }} {...{ errors }} />;
      case "residentialBuilding":
        return <ResidentialBuilding {...{ register }} {...{ errors }} />;
      case "Tower":
        return <Tower {...{ register }} {...{ errors }} />;
      case "Camp":
        return <CampHousing {...{ register }} {...{ errors }} />;
      case "additionalBuildings":
        return <AdditionalBuildings {...{ register }} {...{ errors }} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {damageAssessmentInfo.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{damageAssessmentInfo.error}</p>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Damage Assessment</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                dispatch(resetAllBuildings()); // امسح بيانات المباني السابقة
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
          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Continue to Current Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DamageAssessmentDialog;
