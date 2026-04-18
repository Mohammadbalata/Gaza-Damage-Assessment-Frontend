import { useLanguage } from "../../../../app/providers/LanguageContext";

import {
  BuildingContent,
  DAMAGE_TYPE_CompHouse,
} from "../../utils/DamageAssessment";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { IBuildingProps } from "../../../../shared/types/props/IBuildingProps";
import SingleImageInput from "../ImagesInput/SingleImageInput";
import MultipleImagesInput from "../ImagesInput/MultipleImagesInput";

const CampHousing = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
  getValues,
  setValue,
}: IBuildingProps) => {
  const { t } = useLanguage();
  const propertyType = watch("compHouse.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const damageTypeWatch = watch("compHouse.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  const [textLength, setTextLength] = useState(0);
  const BuildingContentWatch = watch("compHouse.isHabitable");
  const showBuildingContent = BuildingContentWatch === "نعم";
  const showHasPartners = propertyType === "ملك";
  const hasPartners = watch("compHouse.hasPartners");
  const showPartnersCount = hasPartners === "نعم";

  useEffect(() => {
    const currentDamage = getValues("compHouse.damagePercentage");
    const currentHabitable = getValues("compHouse.isHabitable");

    if (damageTypeWatch === "هدم كلي") {
      if (currentDamage !== "100%")
        setValue("compHouse.damagePercentage", "100%");
      if (currentHabitable !== "لا") setValue("compHouse.isHabitable", "لا");
    }

    if (damageTypeWatch === "هدم جزئي") {
      if (currentDamage !== "") setValue("compHouse.damagePercentage", "");
      if (currentHabitable !== "") setValue("compHouse.isHabitable", "");
    }
  }, [damageTypeWatch, setValue, getValues]);

  useEffect(() => {
    if (!showHasPartners) {
      setValue("compHouse.hasPartners", "");
      setValue("compHouse.partnersCount", null);
    }
  }, [showHasPartners, setValue]);

  useEffect(() => {
    if (!showPartnersCount && showHasPartners) {
      setValue("compHouse.partnersCount", null);
    }
  }, [showPartnersCount, showHasPartners, setValue]);
  return (
    <div className="space-y-6">
      {/* مساحة المسكن */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة المسكن (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("compHouse.propertyArea", {
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
        {errors?.compHouse?.propertyArea && (
          <p className="text-red-600 text-sm">
            {errors.compHouse.propertyArea.message}
          </p>
        )}
      </div>
      {/*نوع حيازة العقار */}
      <div>
        <label className="block text-sm font-medium mb-1">
          نوع حيازة العقار <span className="text-red-500">*</span>
        </label>
        <select
          {...register("compHouse.propertyType", {
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
        {errors?.compHouse?.propertyType && (
          <p className="text-red-600 text-sm">
            {errors.compHouse?.propertyType.message}
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
              {...register("compHouse.hasPartners", {
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
            {errors?.compHouse?.hasPartners && (
              <p className="text-red-600 text-sm">
                {errors.compHouse.hasPartners.message}
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
                {...register("compHouse.partnersCount", {
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
              {errors?.compHouse?.partnersCount && (
                <p className="text-red-600 text-sm">
                  {errors.compHouse.partnersCount.message}
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
            {...register("compHouse.propertyOwnerName", {
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

          {errors?.compHouse?.propertyOwnerName && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.propertyOwnerName.message}
            </p>
          )}
        </div>
      )}
      {/* عمر المبنى */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عمر العقار <span className="text-red-500">*</span>
        </label>
        <select
          {...register("compHouse.buildingAge", {
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
            عمر العقار
          </option>
          <option value="0-10">0 - 10 سنوات</option>
          <option value="11-20">11 - 20 سنة</option>
          <option value="21-30">21 - 30 سنة</option>
          <option value="31-40">31 - 40 سنة</option>
          <option value="41-50">41 - 50 سنة</option>
          <option value="51-60">51 - 60 سنة</option>
          <option value=">60">أكثر من 60 سنة</option>
        </select>

        {errors?.compHouse?.buildingAge && (
          <p className="text-red-600 text-sm">
            {errors.compHouse.buildingAge.message}
          </p>
        )}
      </div>
      {/* تفاصيل الضرر */}
      <section className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تفاصيل الضرر <span className="text-red-500">*</span>
          </label>
          <select
            {...register("compHouse.damageType", {
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
            DAMAGE_TYPE_CompHouse.map((item, index) => (
              <div
                className={classNames("mr-3", {
                  "cursor-not-allowed": isChangeToReviewPage,
                })}
                key={index}
              >
                <input
                  type="checkbox"
                  value={item.value}
                  {...register("compHouse.damageTypes", {
                    required: "اختر نوع ضرر واحد على الأقل",
                  })}
                  className={classNames(
                    "accent-primary",
                    isChangeToReviewPage &&
                      "pointer-events-none accent-gray-200",
                  )}
                />
                <span className="mr-2">{t(item.label)}</span>
              </div>
            ))}
          {errors?.compHouse?.damageTypes && (
            <p className="text-red-600 mr-3 mt-2 text-sm">
              {errors.compHouse.damageTypes.message}
            </p>
          )}
          {errors?.compHouse?.damageType && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.damageType.message}
            </p>
          )}
        </div>
        {/* نسبة الضرر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نسبة الضرر (%) <span className="text-red-500">*</span>
          </label>
          <select
            {...register("compHouse.damagePercentage", {
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

          {errors?.compHouse?.damagePercentage && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.damagePercentage.message}
            </p>
          )}
        </div>
        {/*هل قابل للسكن حاليا */}
        <div>
          <label className="block text-sm font-medium mb-1">
            هل هو قابل للسكن حالياً؟ <span className="text-red-500">*</span>
          </label>
          <select
            {...register("compHouse.isHabitable", {
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
          {errors?.compHouse?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.isHabitable.message}
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
                    {...register("compHouse.BuildingContent", {
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
              {errors?.compHouse?.BuildingContent && (
                <p className="text-red-600 text-sm">
                  {errors.compHouse.BuildingContent.message}
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
            {...register("compHouse.nameOfStreet")}
            className={classNames(
              "input-field mt-2",
              isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
            )}
            disabled={isChangeToReviewPage}
          />
        </div>
        {errors?.compHouse?.nameOfStreet && (
          <p className="text-red-600 text-sm">
            {errors.compHouse.nameOfStreet.message}
          </p>
        )}

        {/*  رقم المبنى */}
        <div>
          <label className="block text-sm font-medium mb-1">
            رقم المبنى <span className="text-gray-400">(اختياري)</span>
          </label>

          <input
            type="text"
            {...register("compHouse.buildingNumber")}
            className={classNames(
              "input-field mt-2",
              isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
            )}
            disabled={isChangeToReviewPage}
          />
        </div>
        {errors?.compHouse?.buildingNumber && (
          <p className="text-red-600 text-sm">
            {errors.compHouse.buildingNumber.message}
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
              {...register("compHouse.additionalNotes")}
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
            name="compHouse.before_damage_image"
            label="صورة العقار قبل الدمار ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <SingleImageInput
            control={control}
            name="compHouse.after_damage_image"
            label="صورة العقار بعد الدمار ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <MultipleImagesInput
            control={control}
            name="compHouse.ownership_documents"
            label="مستندات الملكية ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />
        </div>
      </section>
    </div>
  );
};

export default CampHousing;
