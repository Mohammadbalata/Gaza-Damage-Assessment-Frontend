import { useLanguage } from "../../contexts/LanguageContext";

interface CampHousingProps {
  register: any;
  errors: any;
}

const CampHousing = ({ register, errors }: CampHousingProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      {/* ============================= */}
      {/* 1. Unit Type */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">نوع الوحدة</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            نوع المسكن <span className="text-red-500">*</span>
          </label>
          <select
            {...register("compHouse.unitType", {
              required: t("common.required"),
            })}
            className="input-field"
          >
            <option value="">اختر النوع</option>
            <option value="block">مسكن بلوك بسيط</option>
            <option value="caravan">كرفان معدني</option>
            <option value="tent">خيمة محمية</option>
          </select>
          {errors?.compHouse?.unitType && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.unitType.message}
            </p>
          )}
        </div>
      </section>
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
          className="input-field"
        />
        {errors?.compHouse?.propertyArea && (
          <p className="text-red-600 text-sm">
            {errors.compHouse.propertyArea.message}
          </p>
        )}
      </div>
       <div>
          <label className="block text-sm font-medium mb-1">
            نوع العقار
          </label>
          <select
            {...register("compHouse.habitability")}
            className="input-field"
          >
            <option value="">لا يوجد</option>
            <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
          </select>
          {errors?.compHouse?.habitability && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.habitability.message}
            </p>
          )}
        </div>
      {/* ============================= */}
      {/* 2. Damage Details */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">تفاصيل الضرر</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("compHouse.directHitCollapse")}
            />
            <span>إصابة مباشرة أدت إلى انهيار</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              فتحات أو ضرر في السقف
            </label>
            <select
              {...register("compHouse.roofHoles")}
              className="input-field"
            >
              <option value="">لا يوجد</option>
              <option value="torn">سقف ممزق</option>
              <option value="holes">ثقوب في السقف</option>
            </select>
            {errors?.compHouse?.roofHoles && (
              <p className="text-red-600 text-sm">
                {errors.compHouse.roofHoles.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              تشققات في الجدران
            </label>
            <select
              {...register("compHouse.minorCracks")}
              className="input-field"
            >
              <option value="">لا يوجد</option>
              <option value="minor">تشققات بسيطة</option>
              <option value="moderate">تشققات متوسطة</option>
            </select>
            {errors?.compHouse?.minorCracks && (
              <p className="text-red-600 text-sm">
                {errors.compHouse.minorCracks.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              الأبواب والنوافذ
            </label>
            <select
              {...register("compHouse.doorsWindowsDamage")}
              className="input-field"
            >
              <option value="">لا يوجد</option>
              <option value="damaged">تضرر</option>
              <option value="broken">مكسور</option>
            </select>
            {errors?.compHouse?.doorsWindowsDamage && (
              <p className="text-red-600 text-sm">
                {errors.compHouse.doorsWindowsDamage.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              ضرر شبكة الكهرباء
            </label>
            <select
              {...register("compHouse.electricalDamage")}
              className="input-field"
            >
              <option value="">لا يوجد</option>
              <option value="cut">كيبل مقطوع</option>
              <option value="exposed">كيبل مكشوف</option>
            </select>
            {errors?.compHouse?.electricalDamage && (
              <p className="text-red-600 text-sm">
                {errors.compHouse.electricalDamage.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("compHouse.waterLeak")} />
            <span>تسرب مياه من السقف</span>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* 3. Assessment */}
      {/* ============================= */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تفاصيل الضرر <span className="text-red-500">*</span>
        </label>
        <select
          {...register("compHouse.damageType", {
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
        </select>

        {errors?.compHouse?.damageType && (
          <p className="text-red-600 text-sm">
            {errors.compHouse.damageType.message}
          </p>
        )}
      </div>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold">التقييم</h3>

        {/* <div>
          <label className="block text-sm font-medium mb-1">
            إمكانية السكن
          </label>
          <select
            {...register("compHouse.habitability")}
            className="input-field"
          >
            <option value="">اختر</option>
            <option value="habitable">صالح للسكن</option>
            <option value="partially">صالح جزئياً</option>
            <option value="not-habitable">غير صالح</option>
          </select>
          {errors?.compHouse?.habitability && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.habitability.message}
            </p>
          )}
        </div> */}

        <div>
          <label className="block text-sm font-medium mb-1">
            نسبة التلف (%)
          </label>
          <input
            type="number"
            {...register("compHouse.damagePercentage", {
              min: 0,
              max: 100,
              valueAsNumber: true,
            })}
            className="input-field"
          />
          {errors?.compHouse?.damagePercentage && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.damagePercentage.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            هل هو قابل للسكن حالياً؟
          </label>
          <select
            {...register("compHouse.isHabitable")}
            className="input-field"
          >
            <option value="">لا يوجد</option>
            <option value="true">نعم</option>
            <option value="false">لا </option>
          </select>
          {errors?.compHouse?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.compHouse.isHabitable.message}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CampHousing;
