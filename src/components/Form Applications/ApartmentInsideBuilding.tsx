import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { useLanguage } from "../../contexts/LanguageContext";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import { DAMAGE_TYPES } from "../../utils/DamageAssessment";
import classNames from "classnames";
import { useState } from "react";

interface ApartmentInsideBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
  watch: any;
  control: any;
  isChangeToReviewPage: boolean;
}
const ApartmentInsideBuilding = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
}: ApartmentInsideBuildingProps) => {
  const { t } = useLanguage();
  const [textLength, setTextLength] = useState(0);

  const propertyType = watch("ApartmentInsideBuilding.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const damageTypeWatch = watch("ApartmentInsideBuilding.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  return (
    <div className="space-y-6">
      {/* رقم الطابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الطابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ApartmentInsideBuilding.floorNumber", {
            required: t("common.required"),
            min: { value: -5, message: "الحد الأدنى -5 (طوابق سفلية)" },
            max: { value: 200, message: "الحد الأقصى 200" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ApartmentInsideBuilding?.floorNumber && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.floorNumber.message}
          </p>
        )}
      </div>

      {/* رقم الشقة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الشقة / الموقع <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("ApartmentInsideBuilding.apartmentNumber", {
            required: t("common.required"),
            minLength: { value: 1, message: "رقم الشقة غير صالح" },
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ApartmentInsideBuilding?.apartmentNumber && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.apartmentNumber.message}
          </p>
        )}
      </div>

      {/* مساحة الشقة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة الشقة (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ApartmentInsideBuilding.propertyArea", {
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
        {errors?.ApartmentInsideBuilding?.propertyArea && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.propertyArea.message}
          </p>
        )}
      </div>
      {/* نوع حيازة العقار */}
      <div>
        <label className="block text-sm font-medium mb-1">
          نوع حيازة العقار <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.propertyType", {
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
        {errors?.ApartmentInsideBuilding?.propertyType && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding?.propertyType.message}
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
            {...register("ApartmentInsideBuilding.propertyOwnerName", {
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

          {errors?.ApartmentInsideBuilding?.propertyOwnerName && (
            <p className="text-red-600 text-sm">
              {errors.ApartmentInsideBuilding.propertyOwnerName.message}
            </p>
          )}
        </div>
      )}
      {/* Usage Type */}
      <div>
        <label className="block text-sm font-medium mb-1">
          نوع الاستخدام <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.usageType", {
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
          <option value="اداري">اداري</option>
          <option value="خدماتي">خدماتي</option>
        </select>
        {errors?.ApartmentInsideBuilding?.usageType && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.usageType.message}
          </p>
        )}
      </div>
      {/* ضرر المبنى الأم */}
      <div className="edit">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ضرر المبنى الأساسي (إن وجد)
        </label>
        <select
          {...register("ApartmentInsideBuilding.mainBuildingDamage")}
          defaultValue=""
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">اختر نوع الضرر</option>
          <option value="لا يوجد ضرر">لا يوجد ضرر</option>
          <option value="تشققات في الأعمدة">تشققات في الأعمدة</option>
          <option value="تضرر الواجهات">تضرر الواجهات</option>
          <option value="تضرر السقف">تضرر السقف</option>
          <option value="تضرر الجدران">تضرر الجدران</option>
          <option value="تضرر جزئي">تضرر جزئي</option>
          <option value="تضرر كلي">تضرر كلي</option>
        </select>
      </div>
      {/* نوع الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تفاصيل الضرر <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.damageType", {
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
          DAMAGE_TYPES.map(
            (item, index) =>
              item.buildingType !== "بناية" && (
                <div
                  className={classNames("mr-3", {
                    "cursor-not-allowed": isChangeToReviewPage,
                  })}
                  key={index}
                >
                  <input
                    type="checkbox"
                    value={item.value}
                    {...register("ApartmentInsideBuilding.damageTypes", {
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
              )
          )}
        {errors?.ApartmentInsideBuilding?.damageType && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.damageType.message}
          </p>
        )}
        {errors?.ApartmentInsideBuilding?.damageTypes && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.damageTypes.message}
          </p>
        )}
      </div>
      {/* نسبة الضرر */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة الضرر (%) <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.damagePercentage", {
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

        {errors?.ApartmentInsideBuilding?.damagePercentage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.damagePercentage.message}
          </p>
        )}
      </div>
      {/* هل هو قابل للسكن حالياً؟ */}
      <div>
        <label className="block text-sm font-medium mb-1">
          هل هو قابل للسكن حالياً؟ <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.isHabitable", {
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
        {errors?.ApartmentInsideBuilding?.isHabitable && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.isHabitable.message}
          </p>
        )}
      </div>

      {/* أقرب معلم */}
      <div>
        <label className="block text-sm font-medium mb-1">
          أقرب معلم <span className="text-red-500">*</span>
        </label>

        <select
          {...register("ApartmentInsideBuilding.nearestLandmark", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage}
        >
          <option value="">اختر معلم</option>
          <option value="school">مدرسة</option>
          <option value="mosque">مسجد</option>
          <option value="hospital">مستشفى</option>
          <option value="market">سوق</option>
          <option value="street">شارع رئيسي</option>
          <option value="other">أخرى</option>
        </select>

        {errors?.ApartmentInsideBuilding?.nearestLandmark && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.nearestLandmark.message}
          </p>
        )}
      </div>

      {/* اسم الشارع  */}
      <div>
        <label className="block text-sm font-medium mb-1">
          اسم الشارع <span className="text-gray-400">(اختياري)</span>
        </label>

        <input
          type="text"
          {...register("ApartmentInsideBuilding.nameOfStreet")}
          className={classNames(
            "input-field mt-2",
            isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage}
        />
      </div>
      {errors?.ApartmentInsideBuilding?.nameOfStreet && (
        <p className="text-red-600 text-sm">
          {errors.ApartmentInsideBuilding.nameOfStreet.message}
        </p>
      )}

      {/*  رقم المبنى */}
      <div>
        <label className="block text-sm font-medium mb-1">
          رقم المبنى <span className="text-gray-400">(اختياري)</span>
        </label>

        <input
          type="text"
          {...register("ApartmentInsideBuilding.buildingNumber")}
          className={classNames(
            "input-field mt-2",
            isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage}
        />
      </div>
      {errors?.ApartmentInsideBuilding?.buildingNumber && (
        <p className="text-red-600 text-sm">
          {errors.ApartmentInsideBuilding.buildingNumber.message}
        </p>
      )}

      {/* ملاحظات إضافية */}
      <div>
        <label className=" text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
          <span>ملاحظات إضافية</span>
          {/* عداد الحروف ضمن اللابل */}
          <span
            className={`text-sm text-gray-500 ${
              isChangeToReviewPage ? `bg-gray-200` : `bg-white`
            }  px-1 pointer-events-none`}
          >
            300 / {textLength}
          </span>
        </label>

        <div className="relative">
          <textarea
            {...register("ApartmentInsideBuilding.additionalNotes")}
            className={classNames(
              "input-field min-h-[100px] resize-none p-2 pb-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400",
              isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : ""
            )}
            maxLength={300}
            disabled={isChangeToReviewPage}
            onChange={(e) => setTextLength(e.target.value.length)}
            placeholder="اكتب أي تفاصيل إضافية (إن وجدت)..."
          ></textarea>
        </div>
      </div>

      {/* صور ومستندات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleImageInput
          control={control}
          name="ApartmentInsideBuilding.beforeWarImage"
          label="صورة العقار قبل الحرب ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <SingleImageInput
          control={control}
          name="ApartmentInsideBuilding.afterWarImage"
          label="صورة العقار بعد الحرب ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <MultipleImagesInput
          control={control}
          name="ApartmentInsideBuilding.ownershipDocuments"
          label="مستندات الملكية ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />
      </div>
    </div>
  );
};

export default ApartmentInsideBuilding;
