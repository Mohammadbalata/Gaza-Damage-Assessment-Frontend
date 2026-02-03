import classNames from "classnames";
import { useLanguage } from "../../contexts/LanguageContext";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import { BuildingContent, DAMAGE_TYPES } from "../../utils/DamageAssessment";
import { useEffect, useState } from "react";

const AdditionalBuildings = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
  getValues,
  setValue,
}: any) => {
  const { t } = useLanguage();
  const propertyType = watch("additionalBuildings.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const damageTypeWatch = watch("additionalBuildings.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  const BuildingContentWatch = watch("additionalBuildings.isHabitable");
  const showBuildingContent = BuildingContentWatch === "نعم";

  const roomTypeWatch = watch("additionalBuildings.roomType");
  const showUsageType = roomTypeWatch === "أخرى";
  const floorsCountWatch = watch("additionalBuildings.floorsCount");
  const showfloorsCount = floorsCountWatch > 0;
  const [textLength, setTextLength] = useState(0);

  useEffect(() => {
    const currentDamage = getValues("additionalBuildings.damagePercentage");
    const currentHabitable = getValues("additionalBuildings.isHabitable");

    if (damageTypeWatch === "هدم كلي") {
      if (currentDamage !== "100%")
        setValue("additionalBuildings.damagePercentage", "100%");
      if (currentHabitable !== "لا")
        setValue("additionalBuildings.isHabitable", "لا");
    }

    if (damageTypeWatch === "هدم جزئي") {
      if (currentDamage !== "")
        setValue("additionalBuildings.damagePercentage", "");
      if (currentHabitable !== "")
        setValue("additionalBuildings.isHabitable", "");
    }
  }, [damageTypeWatch, setValue, getValues]);

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            نوع الغرفة / المبنى <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.roomType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر النوع</option>
            <option value="غرف زراعية">غرفة زراعية / خدمات</option>
            <option value="مخازن"> مخازن / بركسات</option>
            <option value="استراحات">استراحات / كافتيريا</option>
            <option value="صالات">صالات</option>
            <option value="أسوار">أسوار</option>
            <option value="أخرى">أخرى</option>
          </select>
          {
            <div className="mr-3 mt-5">
              {showUsageType && (
                <input
                  type="text"
                  placeholder="أدخل نوع المبنى"
                  {...register("additionalBuildings.otherRoomType", {
                    required: t("common.required"),
                  })}
                  className={classNames(
                    "input-field",
                    isChangeToReviewPage == true
                      ? "cursor-not-allowed bg-gray-200"
                      : "",
                  )}
                  disabled={isChangeToReviewPage ? true : false}
                />
              )}
              {errors?.additionalBuildings?.otherRoomType && (
                <p className="text-red-600 text-sm">
                  {errors.additionalBuildings.otherRoomType.message}
                </p>
              )}
            </div>
          }
          {errors?.additionalBuildings?.type && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings?.type.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مساحة الطابق الأرضي (م²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("additionalBuildings.propertyArea", {
              required: t("common.required"),
              min: { value: 20, message: "الحد الأدنى 20 م²" },
              max: { value: 2000, message: "الحد الأقصى 2000 م²" },
              valueAsNumber: true,
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.additionalBuildings?.propertyArea && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.propertyArea.message}
            </p>
          )}
        </div>
        {/* عدد الطوابق */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عدد الطوابق <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("additionalBuildings.floorsCount", {
              required: t("common.required"),
              max: { value: 200, message: "الحد الأقصى 200" },
              valueAsNumber: true,
            })}
            min={0}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.additionalBuildings?.floorsCount && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.floorsCount.message}
            </p>
          )}
        </div>
        {
          <div className={classNames(showfloorsCount ? "block" : "hidden")}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مساحة الطابق المتكرر (م²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("additionalBuildings.commonFloorArea", {
                required: t("common.required"),
                min: { value: 20, message: "الحد الأدنى 20 م²" },
                max: { value: 2000, message: "الحد الأقصى 2000 م²" },
                valueAsNumber: true,
              })}
              className={classNames(
                "input-field",
                isChangeToReviewPage == true
                  ? "cursor-not-allowed bg-gray-200"
                  : "",
              )}
              disabled={isChangeToReviewPage ? true : false}
            />
            {errors?.additionalBuildings?.commonFloorArea && (
              <p className="text-red-600 text-sm">
                {errors.additionalBuildings.commonFloorArea.message}
              </p>
            )}
          </div>
        }

        <div>
          <label className="block text-sm font-medium mb-1">
            نوع حيازة العقار <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.propertyType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">لا يوجد</option>
            <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
            <option value="انتفاع">انتفاع </option>
          </select>
          {errors?.additionalBuildings?.propertyType && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings?.propertyType.message}
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
              {...register("additionalBuildings.propertyOwnerName", {
                required: t("common.required"),
              })}
              className={classNames(
                "input-field",
                isChangeToReviewPage == true
                  ? "cursor-not-allowed bg-gray-200"
                  : "",
              )}
              disabled={isChangeToReviewPage ? true : false}
            />

            {errors?.additionalBuildings?.propertyOwnerName && (
              <p className="text-red-600 text-sm">
                {errors.additionalBuildings.propertyOwnerName.message}
              </p>
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            نوع الإنشاء <span className="text-red-500">*</span>
          </label>

          <select
            {...register("additionalBuildings.constructionType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر نوع الإنشاء</option>
            <option value="معرشات زينكو">معرشات زينكو</option>
            <option value="جدران زينكو">جدران زينكو</option>
            <option value="منشئة خرسانية">منشئة خرسانية</option>
            <option value="غرفة جاهزة ( كونتينر )">
              غرفة جاهزة ( كونتينر )
            </option>
          </select>
          {errors?.additionalBuildings?.constructionType && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.constructionType.message}
            </p>
          )}
        </div>
        {/* عمر المبنى */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عمر المبنى <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.buildingAge", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="" disabled>
              اختر العمر التقريبي
            </option>
            <option value="0-10">0 - 10 سنوات</option>
            <option value="11-20">11 - 20 سنة</option>
            <option value="21-30">21 - 30 سنة</option>
            <option value="31-40">31 - 40 سنة</option>
            <option value="41-50">41 - 50 سنة</option>
            <option value="51-60">51 - 60 سنة</option>
            <option value=">60">أكثر من 60 سنة</option>
          </select>

          {errors?.additionalBuildings?.buildingAge && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.buildingAge.message}
            </p>
          )}
        </div>
      </section>

      <div className="space-y-6">
        {/* تفاصيل الضرر */}
        <div>
          <label className="block text-sm font-medium mb-1">
            نوع الضرر <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.damageType", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field mb-4",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
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
                      {...register("additionalBuildings.damageTypes", {
                        required: "اختر نوع ضرر واحد على الأقل",
                      })}
                      className={classNames(
                        "accent-primary",
                        isChangeToReviewPage &&
                          "pointer-events-none accent-gray-200",
                      )}
                    />
                    <span className="mr-2">{item.label}</span>
                  </div>
                ),
            )}

          {errors?.additionalBuildings?.damageType && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.damageType.message}
            </p>
          )}
          {errors?.additionalBuildings?.damageTypes && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.damageTypes.message}
            </p>
          )}
        </div>

        {/* نسبة الضرر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نسبة الضرر (%) <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.damagePercentage", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">0</option>
            <option value="25%">25%</option>
            <option value="50%">50% </option>
            <option value="75%">75% </option>
            <option value="100%">100% </option>
          </select>

          {errors?.additionalBuildings?.damagePercentage && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.damagePercentage.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            هل هو قابل للاستخدام ؟ <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.isHabitable", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر نوع</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا </option>
          </select>
          {errors?.additionalBuildings?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.isHabitable.message}
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
                    {...register("additionalBuildings.BuildingContent", {
                      required: "اختر واحد على الأقل",
                    })}
                    className={classNames(
                      "accent-primary",
                      isChangeToReviewPage &&
                        "pointer-events-none accent-gray-200",
                    )}
                  />
                  <span className="mr-2">{item.label}</span>
                </div>
              ))}
              {errors?.additionalBuildings?.BuildingContent && (
                <p className="text-red-600 text-sm">
                  {errors.additionalBuildings.BuildingContent.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* اسم الشارع (إن وُجد) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            اسم الشارع <span className="text-gray-400">(اختياري)</span>
          </label>

          <input
            type="text"
            {...register("additionalBuildings.nameOfStreet")}
            className={classNames(
              "input-field mt-2",
              isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
            )}
            disabled={isChangeToReviewPage}
          />
        </div>
        {errors?.additionalBuildings?.nameOfStreet && (
          <p className="text-red-600 text-sm">
            {errors.additionalBuildings.nameOfStreet.message}
          </p>
        )}

        {/*  رقم المبنى */}
        {/* رقم المبنى (إن وُجد) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            رقم المبنى <span className="text-gray-400">(اختياري)</span>
          </label>

          <input
            type="text"
            {...register("additionalBuildings.buildingNumber")}
            className={classNames(
              "input-field mt-2",
              isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
            )}
            disabled={isChangeToReviewPage}
          />
        </div>

        {errors?.additionalBuildings?.buildingNumber && (
          <p className="text-red-600 text-sm">
            {errors.additionalBuildings.buildingNumber.message}
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
              {...register("additionalBuildings.additionalNotes")}
              className={classNames(
                "input-field min-h-[100px] resize-none p-2 pb-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400",
                isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
              )}
              maxLength={300}
              disabled={isChangeToReviewPage}
              onChange={(e) => setTextLength(e.target.value.length)}
              placeholder="اكتب أي تفاصيل إضافية (إن وجدت)..."
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <SingleImageInput
            control={control}
            name="additionalBuildings.beforeWarImage"
            label="صورة العقار قبل الدمار ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <SingleImageInput
            control={control}
            name="additionalBuildings.afterWarImage"
            label="صورة العقار بعد الدمار ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <MultipleImagesInput
            control={control}
            name="additionalBuildings.ownershipDocuments"
            label="مستندات الملكية ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalBuildings;
