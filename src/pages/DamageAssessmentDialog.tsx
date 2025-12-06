import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  saveIndependentBuilding,
  saveTower,
  setBuildingType,
} from "../redux/slices/damageSlice";
import { buildingOptions } from "../utils/DamageAssessment";
import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";
import IndependentBuilding from "../components/Form Applications/IndependentBuilding";
import Tower from "../components/Form Applications/Tower";
// import { ROUTES } from "../routes/Routes";
// import { useNavigate } from "react-router-dom";

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
      independentBuilding: damageAssessmentInfo.independentBuilding || "",
      tower: damageAssessmentInfo.tower || "",
    },
  });

  const onSubmit = (formData: IDamageAssessmentState) => {
    if (formData.buildingType === "independentBuilding") {
      dispatch(saveIndependentBuilding(formData));
      console.log("indep into if");
      // reset({
      //   buildingType: damageAssessmentInfo.buildingType,
      //   independentBuilding: {},
      // });
    } if (formData.buildingType === "Tower") {
      console.log("tower into if");
      // reset({
      //   buildingType: damageAssessmentInfo.buildingType,
      //   independentBuilding: {
      //     numberOfFloors: 0,
      //     floorArea: 0,
      //     roofType: "",
      //     wallType: "",
      //     buildingAge: 0,
      //     damagePercentage: 0,
      //     habitability: "",
      //     damageType: "",
      //     additionalNotes: "",
      //   },
      // });
      dispatch(saveTower(formData));
    }
    console.log(formData);
    // if (damageAssessmentInfo.buildingType === "Tower") {
    //   dispatch(saveTower(formData));
    //   console.log(formData.tower)
    //   console.log("success submitted");
    // }
    // navigate(`${ROUTES.CURRENT_LOCATION}`);
  };
  const BuildingTypeView = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected = damageAssessmentInfo.buildingType;
    switch (selected) {
      case "independentBuilding":
        return <IndependentBuilding {...{ register }} {...{ errors }} />;
      case "Apartment":
        return <div className="mt-2 text-blue-600">{selected}</div>;
      case "residentialBuilding":
        return <div className="mt-2 text-blue-600">{selected}</div>;
      case "Tower":
        return <Tower {...{ register }} {...{ errors }} />;
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
                // console.log('changed')
                // dispatch(setDamageEmpty());
                dispatch(setBuildingType(e.target.value));
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
