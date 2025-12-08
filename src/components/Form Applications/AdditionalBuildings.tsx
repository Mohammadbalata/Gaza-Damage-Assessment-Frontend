import { useLanguage } from "../../contexts/LanguageContext";

const AdditionalBuildings = ({ register, errors }: any) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      {/* ============================= */}
      {/* 1. Room Type */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">نوع المبنى</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            نوع الغرفة / المبنى <span className="text-red-500">*</span>
          </label>
          <select
            {...register("additionalBuildings.type", {
              required: t("common.required"),
            })}
            className="input-field"
          >
            <option value="">اختر النوع</option>
            <option value="agricultural">غرفة زراعية</option>
            <option value="service">غرفة خدمات</option>
            <option value="storage">مخزن</option>
            <option value="fence">سور</option>
          </select>
          {errors?.additional?.type && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.type.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مساحة الغرفة / المبنى (م²) <span className="text-red-500">*</span>
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
        <div>
          <label className="block text-sm font-medium mb-1">
            نوع العقار
          </label>
          <select
            {...register("additionalBuildings.habitability")}
            className="input-field"
          >
            <option value="">لا يوجد</option>
            <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
          </select>
          {errors?.additionalBuildings.habitability && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.habitability.message}
            </p>
          )}
        </div>
      </section>

      {/* ============================= */}
      {/* 2. Construction Type */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">نوع الإنشاء</h3>

        <div>
          <select
            {...register("additionalBuildings.constructionType", {
              required: t("common.required"),
            })}
            className="input-field"
          >
            <option value="">اختر النوع</option>
            <option value="zinc">زينكو</option>
            <option value="block">بلّوك</option>
            <option value="metal">صفيح</option>
            <option value="prefab">غرفة جاهزة</option>
          </select>
          {errors?.additional?.constructionType && (
            <p className="text-red-600 text-sm">
              {errors.additionalBuildings.constructionType.message}
            </p>
          )}
        </div>
      </section>

      {/* ============================= */}
      {/* 3. Damage Details */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">تفاصيل الضرر</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("additionalBuildings.roofCollapse")}
            />
            <span>سقوط السقف</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              كسر الجدران
            </label>
            <select
              {...register("additionalBuildings.wallDamage")}
              className="input-field"
            >
              <option value="">لا يوجد</option>
              <option value="minor">كسر بسيط</option>
              <option value="major">كسر شديد</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("additionalBuildings.doorDamage")}
            />
            <span>تضرر الأبواب</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("additionalBuildings.waterNetwork")}
            />
            <span>تلف شبكة المياه</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تفاصيل الضرر <span className="text-red-500">*</span>
            </label>
            <select
              {...register("additionalBuildings.damageType", {
                required: t("common.required"),
              })}
              className="input-field"
            >
              <option value="">اختر نوع الضرر</option>
          <option value="انهيار كامل">انهيار كامل</option>
          <option value="انهيار جزئي">انهيار جزئي</option>
          <option value="تشققات إنشائية">تشققات إنشائية</option>
          <option value="تضرر الواجهات">تضرر الواجهات</option>
          <option value="تضرر السقف">تضرر السقف</option>
          <option value="تضرر الأبواب">تضرر الأبواب والنوافذ</option>
          <option value="تضرر التشطيبات">تضرر التشطيبات</option>
          <option value="تضرر الكهرباء">تضرر الكهرباء</option>
          <option value="تضرر شبكة المياه والصرف">تضرر شبكة المياه والصرف</option>
              <option value="waterNetworkDamage">
                تضرر شبكة المياه والصرف
              </option>
            </select>

            {errors?.additionalBuildings?.damageType && (
              <p className="text-red-600 text-sm">
                {errors.additionalBuildings.damageType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              نسبة الضرر (%)
            </label>
            <input
              type="number"
              {...register("additionalBuildings.damagePercent", {
                min: { value: 0, message: "لا يمكن أن تكون أقل من 0" },
                max: { value: 100, message: "لا يمكن أن تتجاوز 100" },
                valueAsNumber: true,
              })}
              className="input-field"
            />
            {errors?.additional?.damagePercent && (
              <p className="text-red-600 text-sm">
                {errors.additionalBuildings.damagePercent.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              هل هو قابل للسكن حالياً؟
            </label>
            <select
              {...register("additionalBuildings.isHabitable")}
              className="input-field"
            >
              <option value="">لا يوجد</option>
              <option value="true">نعم</option>
              <option value="false">لا </option>
            </select>
            {errors?.additionalBuildings?.isHabitable && (
              <p className="text-red-600 text-sm">
                {errors.additionalBuildings.isHabitable.message}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdditionalBuildings;
