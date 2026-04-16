import { useLanguage } from "../../../../app/providers/LanguageContext";
import { BuildingContent, DAMAGE_TYPES } from "../../utils/DamageAssessment";
import { IBuildingProps } from "../../../../shared/types/props/IBuildingProps";
import classNames from "classnames";
import { useEffect, useState } from "react";
import MixedUsageComponent from "../MixedUsageComponent";
import SingleImageInput from "../ImagesInput/SingleImageInput";
import MultipleImagesInput from "../ImagesInput/MultipleImagesInput";

const ResidentialBuilding = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
  getValues,
  setValue,
}: IBuildingProps) => {
  const { t } = useLanguage();
  const propertyType = watch("ResidentialBuilding.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const usageTypeWatch = watch("ResidentialBuilding.usageType");
  const showUsageType = usageTypeWatch === "أخرى";
  const damageTypeWatch = watch("ResidentialBuilding.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  const [textLength, setTextLength] = useState(0);
  const BuildingContentWatch = watch("ResidentialBuilding.isHabitable");
  const showBuildingContent = BuildingContentWatch === "نعم";
  const showHasPartners = propertyType === "ملك";
  const hasPartners = watch("ResidentialBuilding.hasPartners");
  const showPartnersCount = hasPartners === "نعم";

  useEffect(() => {
    const currentDamage = getValues("ResidentialBuilding.damagePercentage");
    const currentHabitable = getValues("ResidentialBuilding.isHabitable");

    if (damageTypeWatch === "هدم كلي") {
      if (currentDamage !== "100%")
        setValue("ResidentialBuilding.damagePercentage", "100%");
      if (currentHabitable !== "لا")
        setValue("ResidentialBuilding.isHabitable", "لا");
    }

    if (damageTypeWatch === "هدم جزئي") {
      if (currentDamage !== "")
        setValue("ResidentialBuilding.damagePercentage", "");
      if (currentHabitable !== "")
        setValue("ResidentialBuilding.isHabitable", "");
    }
  }, [damageTypeWatch, setValue, getValues]);

  useEffect(() => {
    if (!showHasPartners) {
      setValue("ResidentialBuilding.hasPartners", "");
      setValue("ResidentialBuilding.partnersCount", null);
    }
  }, [showHasPartners, setValue]);

  useEffect(() => {
    if (!showPartnersCount && showHasPartners) {
      setValue("ResidentialBuilding.partnersCount", null);
    }
  }, [showPartnersCount, showHasPartners, setValue]);

  return (
    <div className="space-y-6">
      {/* عدد الطوابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عدد الطوابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          max={20}
          {...register("ResidentialBuilding.floorsCount", {
            required: t("common.required"),
            min: { value: 1, message: "يجب أن يكون على الأقل طابق واحد" },
            max: { value: 20, message: "الحد الأقصى 20" },
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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="" disabled>
            نوع حيازة العقار
          </option>
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

      {showHasPartners && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("form.hasPartners")} <span className="text-red-500">*</span>
            </label>
            <select
              {...register("ResidentialBuilding.hasPartners", {
                required: showHasPartners ? t("common.required") : false,
              })}
              className={classNames(
                "input-field",
                isChangeToReviewPage && "cursor-not-allowed bg-gray-200",
              )}
              disabled={isChangeToReviewPage}
            >
              <option value="" disabled>
                {t("form.hasPartners")}
              </option>
              <option value="نعم">{t("form.yes")}</option>
              <option value="لا">{t("form.no")}</option>
            </select>
            {errors?.ResidentialBuilding?.hasPartners && (
              <p className="text-red-600 text-sm">
                {errors.ResidentialBuilding.hasPartners.message}
              </p>
            )}
          </div>

          {showPartnersCount && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("form.partnersCount")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder={t("form.partnersCountPlaceholder")}
                {...register("ResidentialBuilding.partnersCount", {
                  required: showPartnersCount ? t("common.required") : false,
                  min: {
                    value: 1,
                    message: t("validation.minPartners") || "1",
                  },
                  valueAsNumber: true,
                })}
                className={classNames(
                  "input-field",
                  isChangeToReviewPage && "cursor-not-allowed bg-gray-200",
                )}
                disabled={isChangeToReviewPage}
              />
              {errors?.ResidentialBuilding?.partnersCount && (
                <p className="text-red-600 text-sm">
                  {errors.ResidentialBuilding.partnersCount.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
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
                : "",
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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
          )}
          disabled={isChangeToReviewPage ? true : false}
        />
        {errors?.ResidentialBuilding?.apartmentsPerFloor && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.apartmentsPerFloor.message}
          </p>
        )}
      </div>
      <MixedUsageComponent
        {...{ register }}
        {...{ isChangeToReviewPage }}
        {...{ showUsageType }}
        {...{ watch }}
        {...{ errors }}
        usageTypePath="ResidentialBuilding.usageType"
        otherUsageTypePath="ResidentialBuilding.otherUsageType"
        selector={(state) => {
          const rb = state.damage.ResidentialBuilding;
          return {
            floors: {
              ground: rb.MixedUsage_floors_ground,
              mezzanine: rb.MixedUsage_floors_mezzanine,
              roof: rb.MixedUsage_floors_roof,
            },
            units: {
              ground: rb.MixedUsage_units_ground,
              mezzanine: rb.MixedUsage_units_mezzanine,
              roof: rb.MixedUsage_units_roof,
            },
          };
        }}
        entityKey="ResidentialBuilding"
      />
      {/* عمر المبنى */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عمر المبنى <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.buildingAge", {
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
            عمر المبنى
          </option>
          <option value="0-10">0 - 10 سنوات</option>
          <option value="11-20">11 - 20 سنة</option>
          <option value="21-30">21 - 30 سنة</option>
          <option value="31-40">31 - 40 سنة</option>
          <option value="41-50">41 - 50 سنة</option>
          <option value="51-60">51 - 60 سنة</option>
          <option value=">60">أكثر من 60 سنة</option>
        </select>

        {errors?.ResidentialBuilding?.buildingAge && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.buildingAge.message}
          </p>
        )}
      </div>

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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="" disabled>
            تفاصيل الضرر
          </option>
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
                  isChangeToReviewPage && "pointer-events-none accent-gray-200",
                )}
              />
              <span className="mr-2">{t(item.label)}</span>
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
      {showDamageValue && (
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
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : "",
            )}
            disabled={isChangeToReviewPage ? true : false}
          />
          {errors?.ResidentialBuilding?.unusableFloors && (
            <p className="text-red-600 text-sm">
              {errors.ResidentialBuilding.unusableFloors.message}
            </p>
          )}
        </div>
      )}
      {/* ====== الأضرار الإنشائية ====== */}
      {showDamageValue && (
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
                  : "",
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
              عدد الطوابق المتضررة جزئياً{" "}
              <span className="text-red-500">*</span>
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
                  : "",
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
                  isChangeToReviewPage && "pointer-events-none accent-gray-200",
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
                  isChangeToReviewPage && "pointer-events-none accent-gray-200",
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
                  isChangeToReviewPage && "pointer-events-none accent-gray-200",
                )}
              />
              <span>أحزمة و كشفات أسقف</span>
            </div>
          </div>
        </section>
      )}
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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="" disabled>
            نسبة الضرر (%)
          </option>
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
            isChangeToReviewPage == true
              ? "cursor-not-allowed bg-gray-200"
              : "",
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="" disabled>
            هل هو قابل للسكن حالياً؟
          </option>
          <option value="نعم">نعم</option>
          <option value="لا">لا </option>
        </select>
        {errors?.ResidentialBuilding?.isHabitable && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.isHabitable.message}
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
                  {...register("ResidentialBuilding.BuildingContent", {
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
            {errors?.ResidentialBuilding?.BuildingContent && (
              <p className="text-red-600 text-sm">
                {errors.ResidentialBuilding.BuildingContent.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* اسم الشارع  */}
      <div>
        <label className="block text-sm font-medium mb-1">
          اسم الشارع <span className="text-gray-400">(اختياري)</span>
        </label>

        <input
          type="text"
          {...register("ResidentialBuilding.nameOfStreet")}
          className={classNames(
            "input-field mt-2",
            isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
          )}
          disabled={isChangeToReviewPage}
        />
      </div>
      {errors?.ResidentialBuilding?.nameOfStreet && (
        <p className="text-red-600 text-sm">
          {errors.ResidentialBuilding.nameOfStreet.message}
        </p>
      )}

      {/*  رقم المبنى */}
      <div>
        <label className="block text-sm font-medium mb-1">
          رقم المبنى <span className="text-gray-400">(اختياري)</span>
        </label>

        <input
          type="text"
          {...register("ResidentialBuilding.buildingNumber")}
          className={classNames(
            "input-field mt-2",
            isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
          )}
          disabled={isChangeToReviewPage}
        />
      </div>
      {errors?.ResidentialBuilding?.buildingNumber && (
        <p className="text-red-600 text-sm">
          {errors.ResidentialBuilding.buildingNumber.message}
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
            {...register("ResidentialBuilding.additionalNotes")}
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

      {/* صور ومستندات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleImageInput
          control={control}
          name="ResidentialBuilding.before_damage_image"
          label="صورة العقار قبل الدمار ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <SingleImageInput
          control={control}
          name="ResidentialBuilding.after_damage_image"
          label="صورة العقار بعد الدمار ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <MultipleImagesInput
          control={control}
          name="ResidentialBuilding.ownership_documents"
          label="مستندات الملكية ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />
      </div>
    </div>
  );
};

export default ResidentialBuilding;
