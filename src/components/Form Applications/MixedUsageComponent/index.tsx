import classNames from "classnames";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  addUnit,
  removeUnit,
  setFloor,
  updateUnit,
} from "../../../redux/slices/mixedUsageSlice";

/* ========= Types ========= */
type FloorKey = "ground" | "mezzanine" | "roof";
type UnitField = "usage" | "activity";

/* ========= Component ========= */
const MixedUsageComponent = ({
  register,
  isChangeToReviewPage,
  showUsageType,
  watch,
}: any) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  const usageType = watch("ResidentialBuilding.usageType");
  const showMixedUsage = usageType === "مزدوج الاستخدام";

  const { floors, units } = useAppSelector((state) => state.mixedUsage);

  const floorLabels: Record<FloorKey, string> = {
    ground: "الطابق الأرضي",
    mezzanine: "السدة",
    roof: "الروف",
  };

  /* ========= Handlers ========= */
  const handleFloorChange = (floor: FloorKey, value: boolean) => {
    if (isChangeToReviewPage) return;
    dispatch(setFloor({ floor, value }));
  };

  const handleAddUnit = (floor: FloorKey) => {
    if (isChangeToReviewPage) return;
    dispatch(addUnit(floor));
  };

  const handleRemoveUnit = (floor: FloorKey, index: number) => {
    if (isChangeToReviewPage) return;
    dispatch(removeUnit({ floor, index }));
  };

  const handleUpdateUnit = (
    floor: FloorKey,
    index: number,
    field: UnitField,
    value: string
  ) => {
    dispatch(updateUnit({ floor, index, field, value }));
  };

  /* ========= Render ========= */
  return (
    <div className="space-y-4">
      {/* نوع الاستخدام */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع الاستخدام <span className="text-red-500">*</span>
        </label>

        <select
          {...register("ResidentialBuilding.usageType", {
            required: t("common.required"),
          })}
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
          <div className="mt-4">
            <input
              {...register("ResidentialBuilding.otherUsageType", {
                required: t("common.required"),
              })}
              disabled={isChangeToReviewPage}
              placeholder="أدخل نوع الاستخدام"
              className="input-field"
            />
          </div>
        )}
      </div>

      {/* الطوابق */}
      {showMixedUsage && (
        <div className="space-y-4">
          <label className="font-medium">اسم الطابق</label>

          {(Object.keys(floors) as FloorKey[]).map((floorKey) => (
            <div key={floorKey} className="border p-3 rounded-md">
              {/* checkbox */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={floors[floorKey]}
                  disabled={isChangeToReviewPage}
                  onChange={(e) =>
                    handleFloorChange(floorKey, e.target.checked)
                  }
                />
                {floorLabels[floorKey]}
              </label>

              {/* إضافة وحدة */}
              {floors[floorKey] && !isChangeToReviewPage && (
                <button
                  type="button"
                  className="mt-2 text-blue-600 underline"
                  onClick={() => handleAddUnit(floorKey)}
                >
                  + إضافة وحدة
                </button>
              )}

              {/* الوحدات */}
              {units[floorKey].map((unit: any, index: any) => (
                <div
                  key={index}
                  className="mt-3 mr-4 space-y-2 border p-3 rounded-md relative"
                >
                  {!isChangeToReviewPage && (
                    <button
                      type="button"
                      className="absolute top-2 left-2 text-red-600 text-sm"
                      onClick={() => handleRemoveUnit(floorKey, index)}
                    >
                      حذف ✕
                    </button>
                  )}

                  <select
                    value={unit.usage}
                    disabled={isChangeToReviewPage}
                    onChange={(e) =>
                      handleUpdateUnit(floorKey, index, "usage", e.target.value)
                    }
                    className={classNames(
                      "input-field",
                      isChangeToReviewPage && "cursor-not-allowed bg-gray-200"
                    )}
                  >
                    <option value="">نوع الاستخدام</option>
                    <option value="سكني">سكني</option>
                    <option value="تجاري">تجاري</option>
                    <option value="خدماتي">خدماتي</option>
                  </select>

                  {(unit.usage === "تجاري" || unit.usage === "خدماتي") && (
                    <input
                      type="text"
                      value={unit.activity}
                      disabled={isChangeToReviewPage}
                      onChange={(e) =>
                        handleUpdateUnit(
                          floorKey,
                          index,
                          "activity",
                          e.target.value
                        )
                      }
                      placeholder="اسم النشاط"
                      className={classNames(
                        "input-field",
                        isChangeToReviewPage && "cursor-not-allowed bg-gray-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MixedUsageComponent;
