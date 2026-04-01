import classNames from "classnames";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  IFloorsState,
  IUnit,
  IUnitsState,
} from "../../../interfaces/store/IDamageAssessmentState";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  setMixedUsageFloors,
  setMixedUsageUnits,
} from "../../../redux/slices/damageSlice";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

/* ========= Props ========= */
interface MixedUsageProps {
  register: any;
  watch: any;
  errors: any;
  isChangeToReviewPage: boolean;
  showUsageType: boolean;
  entityKey: "ResidentialBuilding" | "tower";

  /** dynamic form paths */
  usageTypePath: string;
  otherUsageTypePath: string;

  /** redux */
  selector: (state: any) => {
    floors: IFloorsState;
    units: IUnitsState;
  };
}

/* ========= Component ========= */
const MixedUsageComponent: React.FC<MixedUsageProps> = ({
  register,
  watch,
  errors,
  isChangeToReviewPage,
  showUsageType,
  usageTypePath,
  otherUsageTypePath,
  selector,
  entityKey,
}) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  const usageTypeWatch = watch(usageTypePath);
  const isMixedUsage = usageTypeWatch === "مزدوج الاستخدام";

  const mixedUsageData = useAppSelector(selector);

  /* ========= Local State (Single Source of Truth) ========= */
  const [floorsState, setFloorsState] = useState<IFloorsState>({
    ground: false,
    mezzanine: false,
    roof: false,
  });

  const [unitsState, setUnitsState] = useState<IUnitsState>({
    ground: [],
    mezzanine: [],
    roof: [],
  });

  /* ========= Init from Redux ========= */
  useEffect(() => {
    if (mixedUsageData) {
      if (mixedUsageData.floors) {
        setFloorsState(mixedUsageData.floors);
      }
      if (mixedUsageData.units) {
        setUnitsState((prev) => ({
          ...prev,
          ground: mixedUsageData.units.ground || [],
          mezzanine: mixedUsageData.units.mezzanine || [],
          roof: mixedUsageData.units.roof || [],
        }));
      }
    }
  }, [mixedUsageData]);

  const floorLabels: Record<keyof IFloorsState, string> = {
    ground: "الطابق الأرضي",
    mezzanine: "السدة",
    roof: "الروف",
  };

  /* ========= Helpers ========= */
  const syncUnitsToRedux = () => {
    dispatch(
      setMixedUsageUnits({
        entity: entityKey,
        units: unitsState,
      })
    );
  };

  /* ========= Handlers ========= */
  const addUnit = (floor: keyof IUnitsState) => {
    if (isChangeToReviewPage) return;

    setUnitsState((prev) => ({
      ...prev,
      [floor]: [...(prev[floor] || []), { usage: "", activity: "" }],
    }));
  };

  const removeUnit = (floor: keyof IUnitsState, index: number) => {
    if (isChangeToReviewPage) return;

    setUnitsState((prev) => {
      const updated = [...(prev[floor] || [])];
      updated.splice(index, 1);
      return { ...prev, [floor]: updated };
    });

    setTimeout(syncUnitsToRedux, 0);
  };

  const updateUnit = (
    floor: keyof IUnitsState,
    index: number,
    field: keyof IUnit,
    value: string
  ) => {
    setUnitsState((prev) => {
      const updated = [...(prev[floor] || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [floor]: updated };
    });
  };

  /* ========= Render ========= */
  return (
    <div className="space-y-4">
      {/* نوع الاستخدام */}
      <div>
        <label className="block text-sm font-medium mb-1">
          نوع الاستخدام <span className="text-red-500">*</span>
        </label>

        <select
          {...register(usageTypePath, { required: t("common.required") })}
          disabled={isChangeToReviewPage}
          className={classNames(
            "input-field",
            isChangeToReviewPage && "cursor-not-allowed bg-gray-200"
          )}
        >
          <option value="">اختر النوع</option>
          <option value="سكني">سكني</option>
          <option value="تجاري">تجاري</option>
          <option value="مزدوج الاستخدام">مزدوج الاستخدام</option>
          <option value="أخرى">أخرى</option>
        </select>

        {showUsageType && (
          <input
            {...register(otherUsageTypePath, {
              required: t("common.required"),
            })}
            placeholder="أدخل نوع الاستخدام"
            disabled={isChangeToReviewPage}
            className="input-field mt-3"
          />
        )}

        {errors && <p className="text-red-600 text-sm">{errors?.message}</p>}
      </div>

      {/* الطوابق */}
      {isMixedUsage && (
        <div className="space-y-4">
          <label className="font-medium">اسم الطابق</label>

          {(Object?.keys(floorsState) as (keyof IFloorsState)[]).map(
            (floorKey) => (
              <div key={floorKey} className="border p-3 rounded-md">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={floorsState[floorKey] || false}
                    disabled={isChangeToReviewPage}
                    onChange={(e) => {
                      const updated = {
                        ...floorsState,
                        [floorKey]: e.target.checked,
                      };
                      setFloorsState(updated);
                      dispatch(
                        setMixedUsageFloors({
                          entity: entityKey,
                          floors: updated,
                        })
                      );
                    }}
                  />
                  {floorLabels[floorKey]}
                </label>

                {floorsState[floorKey] && !isChangeToReviewPage && (
                  <Button
                    variant="contained"
                    className="!mt-4"
                    onClick={() => addUnit(floorKey)}
                  >
                    <AddIcon fontSize="inherit" />
                    <span className="!ml-1"> إضافة وحدة</span>
                  </Button>
                )}

                {(unitsState[floorKey] || []).map((unit: any, index: number) => (
                  <div
                    key={index}
                    className="mt-3 mr-4 space-y-2 border p-3 rounded-md flex flex-col items-end"
                  >
                    <div className="flex justify-between w-full">
                      <label className="font-normal text-md mr-2">
                        نوع الاستخدام{" "}
                      </label>
                      {!isChangeToReviewPage && (
                        <Button
                          color="error"
                          variant="contained"
                          className="h-8"
                          onClick={() => removeUnit(floorKey, index)}
                        >
                          <DeleteIcon fontSize="inherit" />
                          <span className="mr-1 !text-md">حذف</span>
                        </Button>
                      )}
                    </div>

                    <select
                      value={unit.usage}
                      disabled={isChangeToReviewPage}
                      className="input-field"
                      onChange={(e) =>
                        updateUnit(floorKey, index, "usage", e.target.value)
                      }
                      onBlur={syncUnitsToRedux}
                    >
                      <option value="">نوع الاستخدام</option>
                      <option value="سكني">سكني</option>
                      <option value="تجاري">تجاري</option>
                      <option value="خدماتي">خدماتي</option>
                    </select>

                    {(unit.usage === "تجاري" || unit.usage === "خدماتي") && (
                      <div className="w-full !mt-5">
                        <label className="font-normal text-md mr-2">
                          اسم النشاط :
                        </label>
                        <input
                          type="text"
                          placeholder="اسم النشاط"
                          value={unit.activity}
                          disabled={isChangeToReviewPage}
                          className="input-field mt-1"
                          onChange={(e) =>
                            updateUnit(
                              floorKey,
                              index,
                              "activity",
                              e.target.value
                            )
                          }
                          onBlur={syncUnitsToRedux}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MixedUsageComponent;
