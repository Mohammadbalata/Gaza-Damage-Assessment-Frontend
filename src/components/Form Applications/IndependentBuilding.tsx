import { useLanguage } from "../../contexts/LanguageContext";
import { DAMAGE_TYPES } from "../../utils/DamageAssessment";
import { IndependentBuildingProps } from "../../interfaces/props/IImageUploadInputProps";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import classNames from "classnames";

const IndependentBuilding = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
}: IndependentBuildingProps) => {
  const { t } = useLanguage();

  const propertyType = watch("IndependentBuilding.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const damageTypeWatch = watch("IndependentBuilding.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";

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
          {...register("IndependentBuilding.numberOfFloors", {
            required: t("common.required"),
            min: { value: 1, message: "الحد الأدنى طابق واحد" },
            max: { value: 200, message: "الحد الأقصى 200 طابق" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
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
          مساحة الطابق الأرضي (م²) <span className="text-red-500">*</span>
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
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة الطابق المتكرر (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          {...register("IndependentBuilding.commonFloorArea", {
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
        {errors?.IndependentBuilding?.commonFloorArea && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.commonFloorArea.message}
          </p>
        )}
      </div>
      {/* نوع حيازة العقار */}
      <div>
        <label className="block text-sm font-medium mb-1">
          نوع حيازة العقار <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.propertyType", {
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
        {errors?.IndependentBuilding?.propertyType && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding?.propertyType.message}
          </p>
        )}
      </div>
      {showOwnerName && (
        <div
          className={classNames({
            "cursor-not-allowed": isChangeToReviewPage === true,
          })}
        >
          <label className="block text-sm font-medium mb-1">
            اسم المالك الأساسي <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="أدخل اسم المالك الأساسي"
            {...register("IndependentBuilding.propertyOwnerName", {
              required: t("common.required"),
            })}
            className={classNames(
              "input-field",
              isChangeToReviewPage == true
                ? "cursor-not-allowed pointer-events-none  bg-gray-200"
                : ""
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
          نوع السقف <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.roofType", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">اختر النوع</option>
          <option value="بلاطة خرسانية">بلاطة خرسانية</option>
          <option value="كرميد">كرميد</option>
          <option value="زينكو">زينكو</option>
          <option value="أسبست">أسبست</option>
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
          نوع الجدران <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.wallType", {
            required: t("common.required"),
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">اختر النوع</option>
          <option value="بلوك / حجر">بلوك / حجر</option>
          <option value="قواطع ( خشب - ألمنيوم - جبص - زينكو )">
            قواطع ( خشب - ألمنيوم - جبص - زينكو )
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
          عمر المبنى <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          {...register("IndependentBuilding.buildingAge", {
            required: t("common.required"),
            min: { value: 1, message: "الحد الأدنى سنة واحدة" },
            max: { value: 200, message: "الحد الأقصى 200 سنة" },
            valueAsNumber: true,
          })}
          className={classNames(
            "input-field",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        />

        {errors?.IndependentBuilding?.buildingAge && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.buildingAge.message}
          </p>
        )}
      </div>

      {/* تفاصيل الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تفاصيل الضرر <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.damageType", {
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
                <div className={classNames('mr-3',{'cursor-not-allowed':isChangeToReviewPage})} key={index}>
                  <input
                    type="checkbox"
                    value={item.value}
                    {...register("IndependentBuilding.damageTypes", {
                      required: "اختر نوع ضرر واحد على الأقل",
                    })}
                    className={classNames(
                      "accent-primary",
                      isChangeToReviewPage && "pointer-events-none accent-gray-200"
                    )}
                  />
                  <span className="mr-2">{item.label}</span>
                </div>
              )
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
          نسبة الضرر (%) <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.damagePercentage", {
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

        {errors?.IndependentBuilding?.damagePercentage && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.damagePercentage.message}
          </p>
        )}
      </div>
      {/* هل هو قابل للسكن حالياً؟ */}
      <div>
        <label className="block text-sm font-medium mb-1">
          هل هو قابل للسكن حالياً؟ <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.isHabitable", {
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
        {errors?.IndependentBuilding?.isHabitable && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.isHabitable.message}
          </p>
        )}
      </div>

      {/* ملاحظات إضافية */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات إضافية
        </label>
        <textarea
          {...register("IndependentBuilding.additionalNotes")}
          className={classNames(
            "input-field min-h-[100px] resize-none",
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        ></textarea>
      </div>
      {/* صور ومستندات */}
      <div
        className={classNames("grid grid-cols-1 md:grid-cols-3 gap-4", {
          "cursor-not-allowed": isChangeToReviewPage === true,
        })}
      >
        <SingleImageInput
          control={control}
          name="IndependentBuilding.beforeWarImage"
          label="صورة العقار قبل الحرب ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <SingleImageInput
          control={control}
          name="IndependentBuilding.afterWarImage"
          label="صورة العقار بعد الحرب ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />

        <MultipleImagesInput
          control={control}
          name="IndependentBuilding.ownershipDocuments"
          label="مستندات الملكية ( إن وجد )"
          {...{ isChangeToReviewPage }}
        />
      </div>
    </div>
  );
};

export default IndependentBuilding;
