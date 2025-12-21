import { useLanguage } from "../../contexts/LanguageContext";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import { DAMAGE_TYPE_CompHouse } from "../../utils/DamageAssessment";
import classNames from "classnames";
interface CampHousingProps {
  register: any;
  errors: any;
  watch: any;
  control: any;
  isChangeToReviewPage: boolean;
}

const CampHousing = ({
  register,
  errors,
  watch,
  control,
  isChangeToReviewPage,
}: CampHousingProps) => {
  const { t } = useLanguage();
  const propertyType = watch("compHouse.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const damageTypeWatch = watch("compHouse.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
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
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
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
            isChangeToReviewPage == true ? "cursor-not-allowed bg-gray-200" : ""
          )}
          disabled={isChangeToReviewPage ? true : false}
        >
          <option value="">لا يوجد</option>
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
                : ""
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
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر نوع الضرر</option>
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
                      "pointer-events-none accent-gray-200"
                  )}
                />
                <span className="mr-2">{item.label}</span>
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
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          >
            <option value="">اختر نوع</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا </option>
          </select>
          {errors?.compHouse?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.isHabitable.message}
            </p>
          )}
        </div>
        {/* ملاحظات إضافية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات إضافية
          </label>
          <textarea
            {...register("compHouse.additionalNotes")}
            placeholder="اكتب أي تفاصيل إضافية..."
            className={classNames(
              "input-field min-h-[100px] resize-none",
              isChangeToReviewPage == true
                ? "cursor-not-allowed bg-gray-200"
                : ""
            )}
            disabled={isChangeToReviewPage ? true : false}
          ></textarea>
        </div>
        {/* صور ومستندات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SingleImageInput
            control={control}
            name="compHouse.beforeWarImage"
            label="صورة العقار قبل الحرب ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <SingleImageInput
            control={control}
            name="compHouse.afterWarImage"
            label="صورة العقار بعد الحرب ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />

          <MultipleImagesInput
            control={control}
            name="compHouse.ownershipDocuments"
            label="مستندات الملكية ( إن وجد )"
            {...{ isChangeToReviewPage }}
          />
        </div>
      </section>
    </div>
  );
};

export default CampHousing;
