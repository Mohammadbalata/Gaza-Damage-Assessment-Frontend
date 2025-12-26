import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { useLanguage } from "../../contexts/LanguageContext";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import { DAMAGE_TYPES } from "../../utils/DamageAssessment";
import classNames from "classnames";
import { useState } from "react";

interface ResidentialBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
  watch: any;
  control: any;
  isChangeToReviewPage: boolean;
}

const ResidentialBuilding = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
}: ResidentialBuildingProps) => {
  const { t } = useLanguage();
  const propertyType = watch("ResidentialBuilding.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const usageTypeWatch = watch("ResidentialBuilding.usageType");
  const showUsageType = usageTypeWatch === "أخرى";
  const damageTypeWatch = watch("ResidentialBuilding.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  const [textLength, setTextLength] = useState(0);

  return (
    <div className="space-y-6">
      {/* عدد الطوابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عدد الطوابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.floorsCount", {
            required: t("common.required"),
            min: { value: 1, message: "يجب أن يكون على الأقل طابق واحد" },
            max: { value: 200, message: "الحد الأقصى 200" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ResidentialBuilding?.floorsCount && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.floorsCount.message}
          </p>
        )}
      </div>
      {/* مساحة الطوابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة الطابق الأرضي (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.groundFloorArea", {
            required: t("common.required"),
            min: { value: 20, message: "الحد الأدنى 20 م²" },
            max: { value: 2000, message: "الحد الأقصى 2000 م²" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ResidentialBuilding?.groundFloorArea && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.groundFloorArea.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة الطابق المتكرر (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.commonFloorArea", {
            required: t("common.required"),
            min: { value: 20, message: "الحد الأدنى 20 م²" },
            max: { value: 2000, message: "الحد الأقصى 2000 م²" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ResidentialBuilding?.commonFloorArea && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.commonFloorArea.message}
          </p>
        )}
      </div>
      {/* نوع حيازة العقار */}
      <div>
        <label className="block text-sm font-medium mb-1">
          نوع حيازة العقار <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.propertyType", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">لا يوجد</option>
          <option value="ملك">ملك</option>
          <option value="ايجار">ايجار </option>
          <option value="انتفاع">انتفاع </option>
        </select>
        {errors?.ResidentialBuilding?.propertyType && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding?.propertyType.message}
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
            {...register("ResidentialBuilding.propertyOwnerName", {
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

          {errors?.ResidentialBuilding?.propertyOwnerName && (
            <p className="text-red-600 text-sm">
              {errors.ResidentialBuilding.propertyOwnerName.message}
            </p>
          )}
        </div>
      )}
      {/* عدد الشقق في كل طابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عدد الشقق في كل طابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.apartmentsPerFloor", {
            required: t("common.required"),
            min: {
              value: 1,
              message: "يجب أن يحتوي الطابق على شقة واحدة على الأقل",
            },
            max: { value: 50, message: "الحد الأقصى 50" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ResidentialBuilding?.apartmentsPerFloor && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.apartmentsPerFloor.message}
          </p>
        )}
      </div>

      {/* نوع الاستخدام */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع الاستخدام <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.usageType", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
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
              {...register("ResidentialBuilding.otherUsageType", {
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
          {errors?.ResidentialBuilding?.otherUsageType && (
            <p className="text-red-600 text-sm">
              {errors.ResidentialBuilding.otherUsageType.message}
            </p>
          )}
        </div>
        {errors?.ResidentialBuilding?.usageType && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.usageType.message}
          </p>
        )}
      </div>
      {/* ====== الأضرار الإنشائية ====== */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">الأضرار الإنشائية</h3>

        {/* Collapsed Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الطوابق المنهارة <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("ResidentialBuilding.collapsedFloors", {
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
          {errors?.ResidentialBuilding?.collapsedFloors && (
            <p className="text-red-600 text-sm">
              {errors.ResidentialBuilding.collapsedFloors.message}
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
            {...register("ResidentialBuilding.partialCollapses", {
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
          {errors?.ResidentialBuilding?.partialCollapses && (
            <p className="text-red-600 text-sm">
              {errors.ResidentialBuilding.partialCollapses.message}
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
              {...register("ResidentialBuilding.criticalColumnDamage")}
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
              {...register("ResidentialBuilding.criticalShearWallDamage")}
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
              {...register("ResidentialBuilding.criticalRoofBelts")}
              className={classNames(
                "accent-primary",
                isChangeToReviewPage && "pointer-events-none accent-gray-200"
              )}
            />
            <span>أحزمة و كشفات أسقف</span>
          </div>
        </div>
      </section>

      {/* ====== مستوى الضرر ====== */}

      {/* تفاصيل الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تفاصيل الضرر <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.damageType", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field mb-4",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
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
                {...register("ResidentialBuilding.damageTypes", {
                  required: "اختر نوع ضرر واحد على الأقل",
                })}
                className={classNames(
                  "accent-primary",
                  isChangeToReviewPage && "pointer-events-none accent-gray-200"
                )}
              />
              <span className="mr-2">{item.label}</span>
            </div>
          ))}
        {errors?.ResidentialBuilding?.damageTypes && (
          <p className="text-red-600 mr-3 mt-2 text-sm">
            {errors.ResidentialBuilding.damageTypes.message}
          </p>
        )}
        {errors?.ResidentialBuilding?.damageType && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.damageType.message}
          </p>
        )}
      </div>
      {/* عدد الطوابق الغير صالحة للاستخدام */}
      <div>
        <label className="block text-sm font-medium mb-1">
          عدد الطوابق غير الصالحة للاستخدام{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.unusableFloors", {
            valueAsNumber: true,
            required: t("common.required"),
          })}
          min={0}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ResidentialBuilding?.unusableFloors && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.unusableFloors.message}
          </p>
        )}
      </div>
      {/* نسبة الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة الضرر (%) <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.damagePercentage", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">0</option>
          <option value="25%">25%</option>
          <option value="50%">50% </option>
          <option value="75%">75% </option>
          <option value="100%">100% </option>
        </select>

        {errors?.ResidentialBuilding?.damagePercentage && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.damagePercentage.message}
          </p>
        )}
      </div>
      {/* هل هو قابل للسكن حالياً؟ */}
      <div>
        <label className="block text-sm font-medium mb-1">
          هل هو قابل للسكن حالياً؟ <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.isHabitable", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">اختر نوع</option>
          <option value="نعم">نعم</option>
          <option value="لا">لا </option>
        </select>
        {errors?.ResidentialBuilding?.isHabitable && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.isHabitable.message}
          </p>
        )}
      </div>
      {/* ملاحظات */}
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
          name="ResidentialBuilding.beforeWarImage"
          label="صورة العقار قبل الحرب ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <SingleImageInput
          control={control}
          name="ResidentialBuilding.afterWarImage"
          label="صورة العقار بعد الحرب ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <MultipleImagesInput
          control={control}
          name="ResidentialBuilding.ownershipDocuments"
          label="مستندات الملكية ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />
      </div>
    </div>
  );
};

export default ResidentialBuilding;
