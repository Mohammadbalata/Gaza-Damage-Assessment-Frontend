import { useLanguage } from "../../contexts/LanguageContext";
import { BuildingContent, DAMAGE_TYPES } from "../../utils/DamageAssessment";
import { IBuildingProps } from "../../interfaces/props/IBuildingProps";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import classNames from "classnames";
import { useEffect, useState } from "react";

const IndependentBuilding = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
  setValue,
  getValues,
}: IBuildingProps) => {
  const { t } = useLanguage();
  const [textLength, setTextLength] = useState(0);

  const propertyType = watch("IndependentBuilding.propertyType");
  const showOwnerName =
    propertyType === "ايجار" ||
    propertyType === "انتفاع" ||
    propertyType === "rent" ||
    propertyType === "usufruct";
  const damageTypeWatch = watch("IndependentBuilding.damageType");
  const showDamageValue =
    damageTypeWatch === "هدم جزئي" || damageTypeWatch === "Partial collapse";

  const BuildingContentWatch = watch("IndependentBuilding.isHabitable");
  const showBuildingContent =
    BuildingContentWatch === "نعم" || BuildingContentWatch === "Yes";
  const showHasPartners = propertyType === t("property.own");
  const hasPartners = watch("IndependentBuilding.hasPartners");
  const showPartnersCount = hasPartners === "نعم" || hasPartners === "Yes";

  const independentBuildingType = watch(
    "IndependentBuilding.independentBuildingType",
  );
  const isArabicHouse = independentBuildingType === t("form.arabicHouse");
  const showCommonFloorArea =
    independentBuildingType !== t("form.arabicHouse") &&
    independentBuildingType !== "";

  useEffect(() => {
    const currentDamage = getValues("IndependentBuilding.damagePercentage");
    const currentHabitable = getValues("IndependentBuilding.isHabitable");

    if (damageTypeWatch === "هدم كلي" || damageTypeWatch === "Total collapse") {
      if (currentDamage !== "100%")
        setValue("IndependentBuilding.damagePercentage", "100%");
      if (currentHabitable !== "لا")
        setValue("IndependentBuilding.isHabitable", t("form.no"));
    }

    if (
      damageTypeWatch === "هدم جزئي" ||
      damageTypeWatch === "Partial collapse"
    ) {
      if (currentDamage !== "")
        setValue("IndependentBuilding.damagePercentage", "");
      if (currentHabitable !== "")
        setValue("IndependentBuilding.isHabitable", "");
    }
  }, [damageTypeWatch, setValue, getValues]);

  useEffect(() => {
    if (!showHasPartners) {
      setValue("IndependentBuilding.hasPartners", "");
      setValue("IndependentBuilding.partnersCount", null);
    }
  }, [showHasPartners, setValue]);

  useEffect(() => {
    if (!showPartnersCount && showHasPartners) {
      setValue("IndependentBuilding.partnersCount", null);
    }
  }, [showPartnersCount, showHasPartners, setValue]);

  useEffect(() => {
    if (isArabicHouse) {
      setValue("IndependentBuilding.commonFloorArea", null);
    }
  }, [isArabicHouse, setValue]);
  console.log(isChangeToReviewPage);
  return (
    <div className="space-y-6">
      {/* تصنيف المبنى المستقل */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("form.independentBuildingType")}
          <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.independentBuildingType", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage === true
              ? "cursor-not-allowed bg-gray-200"
              : "",
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="" disabled>
            {t("form.independentBuildingType")}
          </option>
          <option value={t("form.independentVilla")}>
            {t("form.independentVilla")}
          </option>
          <option value={t("form.arabicHouse")}>
            {t("form.arabicHouse")}
          </option>
        </select>
        {errors?.IndependentBuilding?.independentBuildingType && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.independentBuildingType.message}
          </p>
        )}
      </div>

      {independentBuildingType && (
        <>
          {/* عدد الطوابق */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.numberOfFloors")}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={20}
              {...register("IndependentBuilding.numberOfFloors", {
                required: t("common.required"),
                min: { value: 1, message: "الحد الأدنى طابق واحد" },
                max: { value: 20, message: "الحد الأقصى 20 طابق" },
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
            {errors?.IndependentBuilding?.numberOfFloors && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.numberOfFloors.message}
              </p>
            )}
          </div>
          {/* مساحة الطابق الأرضي */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.groundFloorArea")}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              {...register("IndependentBuilding.groundFloorArea", {
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
            {errors?.IndependentBuilding?.groundFloorArea && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.groundFloorArea.message}
              </p>
            )}
          </div>
          {/* مساحة الطابق المتكرر */}
          {showCommonFloorArea && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.commonFloorArea")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                {...register("IndependentBuilding.commonFloorArea", {
                  required: showCommonFloorArea ? t("common.required") : false,
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
              {errors?.IndependentBuilding?.commonFloorArea && (
                <p className="text-red-600 text-sm">
                  {errors.IndependentBuilding.commonFloorArea.message}
                </p>
              )}
            </div>
          )}
          {/* نوع حيازة العقار */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("form.propertyType")} <span className="text-red-500">*</span>
            </label>
            <select
              {...register("IndependentBuilding.propertyType", {
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
                {t("form.propertyType")}
              </option>
              <option value={t("property.own")}>{t("property.own")}</option>
              <option value={t("property.rent")}>
                {t("property.rent")}{" "}
              </option>
              <option value={t("property.usufruct")}>
                {t("property.usufruct")}
              </option>
            </select>
            {errors?.IndependentBuilding?.propertyType && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding?.propertyType.message}
              </p>
            )}
          </div>

          {showHasPartners && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("form.hasPartners")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("IndependentBuilding.hasPartners", {
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
                {errors?.IndependentBuilding?.hasPartners && (
                  <p className="text-red-600 text-sm">
                    {errors.IndependentBuilding.hasPartners.message}
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
                    {...register("IndependentBuilding.partnersCount", {
                      required: showPartnersCount
                        ? t("common.required")
                        : false,
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
                  {errors?.IndependentBuilding?.partnersCount && (
                    <p className="text-red-600 text-sm">
                      {errors.IndependentBuilding.partnersCount.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {showOwnerName && (
            <div
              className={classNames({
                "cursor-not-allowed": isChangeToReviewPage === true,
              })}
            >
              <label className="block text-sm font-medium mb-1">
                {t("form.propertyOwnerName")}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder={t("form.propertyEnterOwnerName")}
                {...register("IndependentBuilding.propertyOwnerName", {
                  required: t("common.required"),
                })}
                className={classNames(
                  "input-field",
                  isChangeToReviewPage == true
                    ? "cursor-not-allowed pointer-events-none  bg-gray-200"
                    : "",
                )}
              />

              {errors?.IndependentBuilding?.propertyOwnerName && (
                <p className="text-red-600 text-sm">
                  {errors.IndependentBuilding.propertyOwnerName.message}
                </p>
              )}
            </div>
          )}

          {/* نوع السقف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.roofType")} <span className="text-red-500">*</span>
            </label>
            <select
              {...register("IndependentBuilding.roofType", {
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
                {t("form.roofType")}
              </option>
              <option value={t("roof.concreteSlab")}>
                {t("roof.concreteSlab")}
              </option>
              <option value={t("roof.tile")}>{t("roof.tile")}</option>
              <option value={t("roof.zinc")}>{t("roof.zinc")}</option>
              <option value={t("roof.asbestos")}>{t("roof.asbestos")}</option>
            </select>

            {errors?.IndependentBuilding?.roofType && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.roofType.message}
              </p>
            )}
          </div>

          {/* نوع الجدران */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.wallType")}
              <span className="text-red-500">*</span>
            </label>
            <select
              {...register("IndependentBuilding.wallType", {
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
                {t("form.wallType")}
              </option>
              <option value={t("wall.blockStone")}>
                {t("wall.blockStone")}
              </option>
              <option value={t("wall.partitions")}>
                {t("wall.partitions")}
              </option>
            </select>

            {errors?.IndependentBuilding?.wallType && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.wallType.message}
              </p>
            )}
          </div>

          {/* عمر المبنى */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.buildingAge")} <span className="text-red-500">*</span>
            </label>
            <select
              {...register("IndependentBuilding.buildingAge", {
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
                {t("form.buildingAge")}
              </option>
              <option value="0-10">{t("buildingAge.0_10")}</option>
              <option value="11-20">{t("buildingAge.11_20")}</option>
              <option value="21-30">{t("buildingAge.21_30")}</option>
              <option value="31-40">{t("buildingAge.31_40")}</option>
              <option value="41-50">{t("buildingAge.41_50")}</option>
              <option value="51-60">{t("buildingAge.51_60")}</option>
              <option value=">60">{t("buildingAge.above_60")}</option>
            </select>

            {errors?.IndependentBuilding?.buildingAge && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.buildingAge.message}
              </p>
            )}
          </div>

          {/* تفاصيل الضرر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.damageDetails")} <span className="text-red-500">*</span>
            </label>
            <select
              {...register("IndependentBuilding.damageType", {
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
                {t("form.damageDetails")}
              </option>
              <option value={t("damage.totalCollapse")}>
                {t("damage.totalCollapse")}
              </option>
              <option value={t("damage.partialCollapse")}>
                {t("damage.partialCollapse")}
              </option>
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
                        {...register("IndependentBuilding.damageTypes", {
                          required: "اختر نوع ضرر واحد على الأقل",
                        })}
                        className={classNames(
                          "accent-primary",
                          isChangeToReviewPage &&
                            "pointer-events-none accent-gray-200",
                        )}
                      />
                      <span className="mr-2"> {t(item.label)}</span>
                    </div>
                  ),
              )}

            {errors?.IndependentBuilding?.damageType && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.damageType.message}
              </p>
            )}
            {errors?.IndependentBuilding?.damageTypes && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.damageTypes.message}
              </p>
            )}
          </div>

          {/* نسبة الضرر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.damagePercentage")} (%)
              <span className="text-red-500">*</span>
            </label>
            <select
              {...register("IndependentBuilding.damagePercentage", {
                required: t("common.required"),
              })}
              className={classNames(
                "input-field",
                isChangeToReviewPage == true
                  ? "cursor-not-allowed bg-gray-200"
                  : "",
              )}
              disabled={
                (isChangeToReviewPage ? true : false) ||
                damageTypeWatch === "هدم كلي" ||
                damageTypeWatch === "Total collapse"
              }
            >
              <option value="" disabled>
                {t("form.damagePercentage")} (%)
              </option>
              <option value="25%">25%</option>
              <option value="50%">50% </option>
              <option value="75%">75% </option>
              <option value="100%">100% </option>
            </select>

            {errors?.IndependentBuilding?.damagePercentage && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.damagePercentage.message}
              </p>
            )}
          </div>
          {/* هل هو قابل للسكن حالياً؟ */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("form.isHabitable")}
              <span className="text-red-500">*</span>
            </label>

            <select
              {...register("IndependentBuilding.isHabitable", {
                required: t("common.required"),
              })}
              className={classNames(
                "input-field",
                isChangeToReviewPage === true
                  ? "cursor-not-allowed bg-gray-200"
                  : "",
              )}
              disabled={
                (isChangeToReviewPage ? true : false) ||
                damageTypeWatch === "هدم كلي" ||
                damageTypeWatch === "Total collapse"
              }
              // value={t("form.no")}
            >
              <option value="" disabled>
                {t("form.isHabitable")}
              </option>
              <option value={t("form.yes")}>{t("form.yes")}</option>
              <option value={t("form.no")}>{t("form.no")}</option>
            </select>

            {errors?.IndependentBuilding?.isHabitable && (
              <p className="text-red-600 text-sm">
                {errors.IndependentBuilding.isHabitable.message}
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
                      value={t(item.value)}
                      {...register("IndependentBuilding.BuildingContent", {
                        required: t("common.selectAtLeastOne"),
                      })}
                      className={classNames(
                        "accent-primary",
                        isChangeToReviewPage &&
                          "pointer-events-none accent-gray-200",
                      )}
                    />
                    <span className="mr-2"> {t(item.label)}</span>
                  </div>
                ))}

                {errors?.IndependentBuilding?.BuildingContent && (
                  <p className="text-red-600 text-sm">
                    {errors.IndependentBuilding.BuildingContent.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* اسم الشارع  */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("form.streetName")}{" "}
              <span className="text-gray-400">({t("common.optional")})</span>
            </label>
            <input
              type="text"
              {...register("IndependentBuilding.nameOfStreet")}
              className={classNames(
                "input-field mt-2",
                isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
              )}
              disabled={isChangeToReviewPage}
            />
          </div>
          {errors?.IndependentBuilding?.nameOfStreet && (
            <p className="text-red-600 text-sm">
              {errors.IndependentBuilding.nameOfStreet.message}
            </p>
          )}

          {/*  رقم المبنى */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("form.buildingNumber")}{" "}
              <span className="text-gray-400">({t("common.optional")})</span>
            </label>

            <input
              type="text"
              {...register("IndependentBuilding.buildingNumber")}
              className={classNames(
                "input-field mt-2",
                isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
              )}
              disabled={isChangeToReviewPage}
            />
          </div>
          {errors?.IndependentBuilding?.buildingNumber && (
            <p className="text-red-600 text-sm">
              {errors.IndependentBuilding.buildingNumber.message}
            </p>
          )}

          {/* ملاحظات إضافية */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
              <span>{t("form.additionalNotes")}</span>
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
                {...register("IndependentBuilding.additionalNotes")}
                className={classNames(
                  "input-field min-h-[100px] resize-none p-2 pb-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400",
                  isChangeToReviewPage ? "cursor-not-allowed bg-gray-200" : "",
                )}
                maxLength={300}
                disabled={isChangeToReviewPage}
                onChange={(e) => setTextLength(e.target.value.length)}
                placeholder={t("form.additionalNotesPlaceholder")}
              ></textarea>
            </div>
          </div>

          {/* صور ومستندات */}
          <div
            className={classNames("grid grid-cols-1 md:grid-cols-3 gap-4", {
              "cursor-not-allowed": isChangeToReviewPage === true,
            })}
          >
            <SingleImageInput
              control={control}
              name="IndependentBuilding.before_damage_image"
              label={t("form.beforeImage")}
              {...{ isChangeToReviewPage }}
            />

            <SingleImageInput
              control={control}
              name="IndependentBuilding.after_damage_image"
              label={t("form.afterImage")}
              {...{ isChangeToReviewPage }}
            />

            <MultipleImagesInput
              control={control}
              name="IndependentBuilding.ownership_documents"
              label={t("form.ownershipDocuments")}
              {...{ isChangeToReviewPage }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IndependentBuilding;
