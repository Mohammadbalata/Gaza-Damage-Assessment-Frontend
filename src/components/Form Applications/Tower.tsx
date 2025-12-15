import { useLanguage } from "../../contexts/LanguageContext";

const Tower = ({ register, errors }: any) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      {/* ============================= */}
      {/* 1. Tower Basic Information */}
      {/* ============================= */}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مساحة البرج (م²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("tower.propertyArea", {
              required: t("common.required"),
              min: { value: 20, message: "الحد الأدنى 20 م²" },
              max: { value: 2000, message: "الحد الأقصى 2000 م²" },
              valueAsNumber: true,
            })}
            className="input-field"
          />
          {errors?.tower?.propertyArea && (
            <p className="text-red-600 text-sm">
              {errors.tower.propertyArea.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">نوع العقار</label>
          <select {...register("tower.propertyType")} className="input-field">
            <option value="">لا يوجد</option>
            <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
          </select>
          {errors?.tower?.propertyType && (
            <p className="text-red-600 text-sm">
              {errors.tower?.propertyType.message}
            </p>
          )}
        </div>
        {/* Service Floors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            طوابق الخدمات
          </label>
          <input
            type="number"
            {...register("tower.serviceFloors", { valueAsNumber: true })}
            className="input-field"
          />
        </div>

        {/* Number of units */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عدد الوحدات (شقق / مكاتب / محلات)
          </label>
          <input
            type="number"
            {...register("tower.unitsCount", {
              valueAsNumber: true,
              min: { value: 0, message: "لا يمكن أن يكون أقل من 0" },
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
          <label className="block text-sm font-medium mb-1">
            نوع الاستخدام
          </label>
          <select
            {...register("tower.usageType", { required: t("common.required") })}
            className="input-field"
          >
            <option value="">اختر النوع</option>
            <option value="residential">سكني</option>
            <option value="commercial">تجاري</option>
            <option value="mixed">مختلط</option>
          </select>
          {errors?.tower?.usageType && (
            <p className="text-red-600 text-sm">
              {errors.tower.usageType.message}
            </p>
          )}
        </div>

        {/* Structural System */}
        <div>
          <label className="block text-sm font-medium mb-1">
            النظام الإنشائي
          </label>
          <select
            {...register("tower.structuralSystem", {
              required: t("common.required"),
            })}
            className="input-field"
          >
            <option value="">اختر النوع</option>
            <option value="columns">أعمدة + جسور</option>
            <option value="shearWalls">جدران قص</option>
          </select>
        </div>
      </section>

      {/* ============================= */}
      {/* 2. Structural Damage */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">الأضرار الإنشائية</h3>

        {/* Collapsed Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الطوابق المنهارة
          </label>
          <input
            type="number"
            {...register("tower.collapsedFloors", {
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>

        {/* Partially Collapsed Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الطوابق المتضررة جزئياً
          </label>
          <input
            type="number"
            {...register("tower.partialCollapses", {
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>

        {/* Critical Structural Damage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            عناصر إنشائية حرجة متضررة:
          </label>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("tower.criticalColumnDamage")}
            />
            <span>أعمدة حرجة</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("tower.criticalShearWallDamage")}
            />
            <span>جدران قص حرجة</span>
          </div>
        </div>

        {/* Projectile Penetrations */}
        <div>
          <label className="block text-sm font-medium mb-1">
            عدد الاختراقات بالقذائف
          </label>
          <input
            type="number"
            {...register("tower.projectilePenetrations", {
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>
      </section>

      {/* ============================= */}
      {/* 3. Services Damage */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">أضرار الخدمات</h3>

        <div className="flex items-center gap-3">
          <input type="checkbox" {...register("tower.elevatorsDown")} />
          <span>تعطل المصاعد</span>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" {...register("tower.fireSystemDamaged")} />
          <span>تضرر نظام الإطفاء</span>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" {...register("tower.mainElectricRoom")} />
          <span>تضرر غرفة الكهرباء</span>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" {...register("tower.roofTanksDamaged")} />
          <span>تضرر خزانات السطح</span>
        </div>
      </section>

      {/* ============================= */}
      {/* 4. Final Assessment */}
      {/* ============================= */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">التقييم النهائي</h3>

        {/* Unusable Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">
            الطوابق غير الصالحة للاستخدام
          </label>
          <input
            type="number"
            {...register("tower.unusableFloors", {
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>

        {/* Damage Percentages */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تفاصيل الضرر <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.damageType", {
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
            <option value="تضرر شبكة المياه والصرف">
              تضرر شبكة المياه والصرف
            </option>
          </select>

          {errors?.tower?.damageType && (
            <p className="text-red-600 text-sm">
              {errors.tower.damageType.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            نسبة الضرر الإنشائي (%)
          </label>
          <input
            type="number"
            {...register("tower.structuralDamagePercent", {
              min: 0,
              max: 100,
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            نسبة الضرر المعماري (%)
          </label>
          <input
            type="number"
            {...register("tower.architecturalDamagePercent", {
              min: 0,
              max: 100,
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            نسبة ضرر الخدمات (%)
          </label>
          <input
            type="number"
            {...register("tower.servicesDamagePercent", {
              min: 0,
              max: 100,
              valueAsNumber: true,
            })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            هل هو قابل للسكن حالياً؟
          </label>
          <select {...register("tower.isHabitable")} className="input-field">
            <option value="">لا يوجد</option>
            <option value="true">نعم</option>
            <option value="false">لا </option>
          </select>
          {errors?.tower?.isHabitable && (
            <p className="text-red-600 text-sm">
              {errors.tower.isHabitable.message}
            </p>
          )}
        </div>
        {/* Engineer Recommendation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            توصية المهندس <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tower.engineerRecommendation", {
              required: t("common.required"),
            })}
            className="input-field"
          >
            <option value="">اختر التوصية</option>
            <option value="repair">ترميم</option>
            <option value="strengthening">تدعيم</option>
            <option value="partial-demolition">هدم جزئي</option>
            <option value="full-demolition">هدم كامل</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default Tower;
