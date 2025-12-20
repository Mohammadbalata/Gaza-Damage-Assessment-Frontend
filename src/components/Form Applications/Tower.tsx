import { useLanguage } from "../../contexts/LanguageContext";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import MultipleImagesInput from "./ImagesInput/MultipleImagesInput";
import { DAMAGE_TYPES } from "../../utils/DamageAssessment";

const Tower = ({ register, errors, watch, control }: any) => {
  const { t } = useLanguage();
  const propertyType = watch("tower.propertyType");
  const showOwnerName = propertyType === "ايجار" || propertyType === "انتفاع";
  const usageTypeWatch = watch("tower.usageType");
  const showUsageType = usageTypeWatch === "أخرى";
  const damageTypeWatch = watch("tower.damageType");
  const showDamageValue = damageTypeWatch === "هدم جزئي";
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">معلومات البرج</h3>
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
            className="input-field"
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
            className="input-field"
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
            className="input-field"
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
            className="input-field"
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
              className="input-field"
              type="text"
              placeholder="أدخل اسم المالك الأساسي"
              {...register("tower.propertyOwnerName", {
                required: t("common.required"),
              })}
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
            className="input-field"
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
            className="input-field"
          >
            <option value=""  >
              اختر النوع
            </option>
            <option value="سكني">سكني</option>
            <option value="تجاري">تجاري</option>
            <option value="مزدوج الاستخدام">مزدوج الاستخدام</option>
            <option value="أخرى">أخرى</option>
          </select>
          <div className="mr-3 mt-5">
            {showUsageType && (
              <input
                className="input-field"
                type="text"
                placeholder="أدخل نوع الاستخدام"
                {...register("tower.otherUsageType", {
                  required: t("common.required"),
                })}
                value={" "}
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
        <h3 className="text-lg font-semibold">الأضرار الإنشائية</h3>

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
            className="input-field"
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
            className="input-field"
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
            />
            <span>أعمدة</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("tower.criticalShearWallDamage")}
            />
            <span>جدران</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("tower.criticalRoofBelts")} />
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
            className="input-field"
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
            className="input-field mb-4"
          >
            <option value=""  >
              اختر نوع الضرر
            </option>
            <option value="هدم كلي"> هدم كلي</option>
            <option value="هدم جزئي">هدم جزئي</option>
          </select>
          {showDamageValue &&
            DAMAGE_TYPES.map((item, index) => (
              <div className="mr-3" key={index}>
                <input
                  type="checkbox"
                  value={item.value}
                  {...register("tower.damageTypes", {
                    required: "اختر نوع ضرر واحد على الأقل",
                  })}
                  className="accent-primary"
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
            className="input-field"
          >
            <option value=""  >
              0
            </option>
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
            className="input-field"
          >
            <option value=""   >
              اختر نوع
            </option>
            <option value="نعم">نعم</option>
            <option value="لا">لا </option>
          </select>
          {errors?.tower?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.tower.isHabitable.message}
            </p>
          )}
        </div>
        {/* ملاحظات إضافية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات إضافية
          </label>
          <textarea
            {...register("tower.additionalNotes")}
            className="input-field min-h-[100px] resize-none"
            placeholder="اكتب أي تفاصيل إضافية..."
          ></textarea>
        </div>
        {/* صور ومستندات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SingleImageInput
            control={control}
            name="tower.beforeWarImage"
            label="صورة العقار قبل الحرب ( إن وجد )"
          />

          <SingleImageInput
            control={control}
            name="tower.afterWarImage"
            label="صورة العقار بعد الحرب ( إن وجد )"
          />

          <MultipleImagesInput
            control={control}
            name="tower.ownershipDocuments"
            label="مستندات الملكية ( إن وجد )"
          />
        </div>
      </section>
    </div>
  );
};

export default Tower;
