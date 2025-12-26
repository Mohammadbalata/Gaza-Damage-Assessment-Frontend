import { useLanguage } from "../../contexts/LanguageContext";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import { BuildingContent, DAMAGE_TYPES } from "../../utils/DamageAssessment";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { IBuildingProps } from "../../interfaces/props/IBuildingProps";

const Tower = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
  getValues,
  setValue,
}: IBuildingProps) => {
  const { t } = useLanguage();
  const propertyType = watch("tower.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const usageTypeWatch = watch("tower.usageType");
  const showUsageType = usageTypeWatch === "أخرى";
  const damageTypeWatch = watch("tower.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  const [textLength, setTextLength] = useState(0);
  const BuildingContentWatch = watch("tower.isHabitable");
  const showBuildingContent = BuildingContentWatch === "نعم";
useEffect(() => {
  const currentDamage = getValues("tower.damagePercentage");
  const currentHabitable = getValues("tower.isHabitable");

  if (damageTypeWatch === "هدم كلي") {
    if (currentDamage !== "100%") setValue("tower.damagePercentage", "100%");
    if (currentHabitable !== "لا") setValue("tower.isHabitable", "لا");
  }

  if (damageTypeWatch === "هدم جزئي") {
    if (currentDamage !== "") setValue("tower.damagePercentage", "");
    if (currentHabitable !== "") setValue("tower.isHabitable", "");
  }
}, [damageTypeWatch, setValue, getValues]);
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        {/* Total Floors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عدد الطوابق <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.totalFloors", {
              required: t("common.required"),
              min: { value: 1, message: "الحد الأدنى طابق واحد" },
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.totalFloors && (
            <p className="text-red-600 text-sm">
              {errors.tower.totalFloors.message}
            </p>
          )}
        </div>
        {/* مساحة الطابق الأرضي */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مساحة الطابق الأرضي (م²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.groundFloorArea", {
              required: t("common.required"),
              min: { value: 20, message: "الحد الأدنى 20 م²" },
              max: { value: 2000, message: "الحد الأقصى 2000 م²" },
              valueAsNumber: true,
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.groundFloorArea && (
            <p className="text-red-600 text-sm">
              {errors.tower.groundFloorArea.message}
            </p>
          )}
        </div>
        {/* مساحة الطابق المتكرر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مساحة الطابق المتكرر (م²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.commonFloorArea", {
              required: t("common.required"),
              min: { value: 20, message: "الحد الأدنى 20 م²" },
              max: { value: 2000, message: "الحد الأقصى 2000 م²" },
              valueAsNumber: true,
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.commonFloorArea && (
            <p className="text-red-600 text-sm">
              {errors.tower.commonFloorArea.message}
            </p>
          )}
        </div>
        {/* نوع حيازة العقار */}
        <div>
          <label className="block text-sm font-medium mb-1">
            نوع حيازة العقار <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.propertyType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">لا يوجد</option>
            <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
            <option value="انتفاع">انتفاع </option>
          </select>
          {errors?.tower?.propertyType && (
            <p className="text-red-600 text-sm">
              {errors.tower?.propertyType.message}
            </p>
          )}
        </div>
        {showOwnerName && (
          <div>
            <label className="block text-sm font-medium mb-1">
              اسم المالك الأساسي <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="أدخل اسم المالك الأساسي"
              {...register("tower.propertyOwnerName", {
                required: t("common.required"),
              })}
              className={classNames(
                "input-field",
                isChangeToReviewPage == true
                  ? "cursor-not-allowed bg-gray-200"
                  : ""
              )}
              disabled={isChangeToReviewPage ? true : false}
            />

            {errors?.tower?.propertyOwnerName && (
              <p className="text-red-600 text-sm">
                {errors.tower.propertyOwnerName.message}
              </p>
            )}
          </div>
        )}

        {/* عدد الوحدات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عدد الوحدات (شقق / مكاتب / محلات){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.unitsCount", {
              valueAsNumber: true,
              min: { value: 0, message: "لا يمكن أن يكون أقل من 0" },
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.unitsCount && (
            <p className="text-red-600 text-sm">
              {errors.tower.unitsCount.message}
            </p>
          )}
        </div>

        {/* Usage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع الاستخدام <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.usageType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر النوع</option>
            <option value="سكني">سكني</option>
            <option value="تجاري">تجاري</option>
            <option value="مزدوج الاستخدام">مزدوج الاستخدام</option>
            <option value="أخرى">أخرى</option>
          </select>
          <div className="mr-3 mt-5">
            {showUsageType && (
              <input
                type="text"
                placeholder="أدخل نوع الاستخدام"
                {...register("tower.otherUsageType", {
                  required: t("common.required"),
                })}
                className={classNames(
                  "input-field",
                  isChangeToReviewPage == true
                    ? "cursor-not-allowed bg-gray-200"
                    : ""
                )}
                disabled={isChangeToReviewPage ? true : false}
              />
            )}
            {errors?.tower?.otherUsageType && (
              <p className="text-red-600 text-sm">
                {errors.tower.otherUsageType.message}
              </p>
            )}
          </div>
          {errors?.tower?.usageType && (
            <p className="text-red-600 text-sm">
              {errors.tower.usageType.message}
            </p>
          )}
        </div>
      </section>
      <section className="space-y-6">
        {/* Collapsed Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الطوابق المنهارة <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.collapsedFloors", {
              valueAsNumber: true,
              required: t("common.required"),
            })}
            min={0}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.collapsedFloors && (
            <p className="text-red-600 text-sm">
              {errors.tower.collapsedFloors.message}
            </p>
          )}
        </div>

        {/* Partially Collapsed Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الطوابق المتضررة جزئياً <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.partialCollapses", {
              valueAsNumber: true,
              required: t("common.required"),
            })}
            min={0}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.partialCollapses && (
            <p className="text-red-600 text-sm">
              {errors.tower.partialCollapses.message}
            </p>
          )}
        </div>

        {/* Critical Structural Damage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            عناصر انشائية متضررة ( تشكل خطر ):
          </label>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("tower.criticalColumnDamage")}
              className={classNames(
                "accent-primary",
                isChangeToReviewPage && "pointer-events-none accent-gray-200"
              )}
            />
            <span>أعمدة</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("tower.criticalShearWallDamage")}
              className={classNames(
                "accent-primary",
                isChangeToReviewPage && "pointer-events-none accent-gray-200"
              )}
            />
            <span>جدران</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("tower.criticalRoofBelts")}
              className={classNames(
                "accent-primary",
                isChangeToReviewPage && "pointer-events-none accent-gray-200"
              )}
            />
            <span>أحزمة و كشفات أسقف</span>
          </div>
        </div>
      </section>
      <section className="space-y-6">
        {/* Unusable Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الطوابق غير الصالحة للاستخدام{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.unusableFloors", {
              valueAsNumber: true,
              required: t("common.required"),
            })}
            min={0}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.tower?.unusableFloors && (
            <p className="text-red-600 text-sm">
              {errors.tower.unusableFloors.message}
            </p>
          )}
        </div>
        {/* تفاصيل الضرر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تفاصيل الضرر <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.damageType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field mb-4",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر نوع الضرر</option>
            <option value="هدم كلي"> هدم كلي</option>
            <option value="هدم جزئي">هدم جزئي</option>
          </select>
          {showDamageValue &&
            DAMAGE_TYPES.map((item, index) => (
              <div
                className={classNames("mr-3", {
                  "cursor-not-allowed": isChangeToReviewPage,
                })}
                key={index}
              >
                <input
                  type="checkbox"
                  value={item.value}
                  {...register("tower.damageTypes", {
                    required: "اختر نوع ضرر واحد على الأقل",
                  })}
                  className={classNames(
                    "accent-primary",
                    isChangeToReviewPage &&
                      "pointer-events-none accent-gray-200"
                  )}
                />
                <span className="mr-2">{item.label}</span>
              </div>
            ))}

          {errors?.tower?.damageTypes && (
            <p className="text-red-600 mr-3 mt-2 text-sm">
              {errors.tower.damageTypes.message}
            </p>
          )}
          {errors?.tower?.damageType && (
            <p className="text-red-600 text-sm">
              {errors.tower.damageType.message}
            </p>
          )}
        </div>
        {/* نسبة الضرر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نسبة الضرر (%) <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.damagePercentage", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">0</option>
            <option value="25%">25%</option>
            <option value="50%">50% </option>
            <option value="75%">75% </option>
            <option value="100%">100% </option>
          </select>

          {errors?.tower?.damagePercentage && (
            <p className="text-red-600 text-sm">
              {errors.tower.damagePercentage.message}
            </p>
          )}
        </div>
        {/* هل هو قابل للسكن حالياً؟ */}
        <div>
          <label className="block text-sm font-medium mb-1">
            هل هو قابل للسكن حالياً؟ <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.isHabitable", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر نوع</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا </option>
          </select>
          {errors?.tower?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.tower.isHabitable.message}
            </p>
          )}
          {showBuildingContent && (
            <div className="mt-5">
              {BuildingContent?.map((item, index) => (
                <div
                  className={classNames("mr-3", {
                    "cursor-not-allowed": isChangeToReviewPage,
                  })}
                  key={index}
                >
                  <input
                    type="checkbox"
                    value={item.value}
                    {...register("tower.BuildingContent", {
                      required: "اختر واحد على الأقل",
                    })}
                    className={classNames(
                      "accent-primary",
                      isChangeToReviewPage &&
                        "pointer-events-none accent-gray-200"
                    )}
                  />
                  <span className="mr-2">{item.label}</span>
                </div>
              ))}
              {errors?.tower?.BuildingContent && (
                <p className="text-red-600 text-sm">
                  {errors.tower.BuildingContent.message}
                </p>
              )}
            </div>
          )}
        </div>
        {/* ملاحظات إضافية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات إضافية
          </label>
          <div className="relative">
            <textarea
              {...register("IndependentBuilding.additionalNotes")}
              placeholder="اكتب أي تفاصيل إضافية..."
              className={classNames(
                "input-field min-h-[100px] resize-none p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400",
                isChangeToReviewPage ? "cursor-not-allowed bg-gray-100" : ""
              )}
              maxLength={300}
              disabled={isChangeToReviewPage}
              onChange={(e) => setTextLength(e.target.value.length)}
            ></textarea>

            {/* عداد الحروف المتبقية */}
            <div className={`text-sm text-gray-500 absolute bottom-3 right-2 `}>
              {300 - textLength} {t("common.lettersRemaining")}
            </div>
          </div>
        </div>
        {/* صور ومستندات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SingleImageInput
            control={control}
            name="tower.beforeWarImage"
            label="صورة العقار قبل الحرب ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <SingleImageInput
            control={control}
            name="tower.afterWarImage"
            label="صورة العقار بعد الحرب ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <MultipleImagesInput
            control={control}
            name="tower.ownershipDocuments"
            label="مستندات الملكية ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />
        </div>
      </section>
    </div>
  );
};

export default Tower;
