import classNames from "classnames";
import { useLanguage } from "../../contexts/LanguageContext";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import { DAMAGE_TYPES } from "../../utils/DamageAssessment";

const AdditionalBuildings = ({ register, errors, watch, control }: any) => {
  const { t } = useLanguage();
  const propertyType = watch("additionalBuildings.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const damageTypeWatch = watch("additionalBuildings.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";

  const roomTypeWatch = watch("additionalBuildings.roomType");
  const showUsageType = roomTypeWatch === "أخرى";
  const floorsCountWatch = watch("additionalBuildings.floorsCount");
  const showfloorsCount = floorsCountWatch > 0;
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
            className="input-field"
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
                  className="input-field"
                  type="text"
                  placeholder="أدخل نوع المبنى"
                  {...register("additionalBuildings.otherRoomType", {
                    required: t("common.required"),
                  })}
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
              {errors.additionalBuildings.type.message}
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
            className="input-field"
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
            className="input-field"
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
              className="input-field"
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
            className="input-field"
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
              className="input-field"
              type="text"
              placeholder="أدخل اسم المالك الأساسي"
              {...register("additionalBuildings.propertyOwnerName", {
                required: t("common.required"),
              })}
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
            className="input-field"
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
            className="input-field mb-4"
          >
            <option value="">اختر نوع الضرر</option>
            <option value="هدم كلي"> هدم كلي</option>
            <option value="هدم جزئي">هدم جزئي</option>
          </select>
          {showDamageValue &&
            DAMAGE_TYPES.map(
              (item, index) =>
                item.buildingType !== "بناية" && (
                  <div className="mr-3" key={index}>
                    <input
                      type="checkbox"
                      value={item.value}
                      {...register("additionalBuildings.damageTypes", {
                        required: "اختر نوع ضرر واحد على الأقل",
                      })}
                      className="accent-primary"
                    />
                    <span className="mr-2">{item.label}</span>
                  </div>
                )
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
            className="input-field"
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
            className="input-field"
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
        </div>
        {/* ملاحظات إضافية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات إضافية
          </label>
          <textarea
            {...register("additionalBuildings.additionalNotes")}
            className="input-field min-h-[100px] resize-none"
            placeholder="اكتب أي تفاصيل إضافية..."
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <SingleImageInput
            control={control}
            name="additionalBuildings.beforeWarImage"
            label="صورة العقار قبل الحرب ( إن وجد )"
          />

          <SingleImageInput
            control={control}
            name="additionalBuildings.afterWarImage"
            label="صورة العقار بعد الحرب ( إن وجد )"
          />

          <MultipleImagesInput
            control={control}
            name="additionalBuildings.ownershipDocuments"
            label="مستندات الملكية ( إن وجد )"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalBuildings;
