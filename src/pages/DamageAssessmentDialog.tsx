import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  resetAllBuildings,
  saveApartmentInsideBuilding,
  saveIndependentBuilding,
  saveResidentialBuilding,
  setBuildingType,
} from "../redux/slices/damageSlice";
import { buildingOptions } from "../utils/DamageAssessment";
import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";
import IndependentBuilding from "../components/IndependentBuilding";
// import { useNavigate } from "react-router-dom";
import ApartmentInsideBuilding from "../components/ApartmentInsideBuilding";
// import { ROUTES } from "../routes/Routes";
import ResidentialBuilding from "../components/ResidentialBuilding";

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
      buildingType: damageAssessmentInfo.buildingType,
      IndependentBuilding: damageAssessmentInfo.IndependentBuilding,
      ApartmentInsideBuilding: damageAssessmentInfo.ApartmentInsideBuilding,
      ResidentialBuilding: damageAssessmentInfo.ResidentialBuilding,
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

    // navigate(`${ROUTES.CURRENT_LOCATION}`);
    console.log("success submitted");
    console.log(formData);
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
        return <div className="mt-2 text-blue-600">{selected}</div>;
      case "Camp":
        return <div className="mt-2 text-blue-600">{selected}</div>;
      case "additionalBuildings":
        return <div className="mt-2 text-blue-600">{selected}</div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
