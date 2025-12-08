import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { useLanguage } from "../../contexts/LanguageContext";

interface ResidentialBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
}

const ResidentialBuilding = ({
  register,
  errors,
}: ResidentialBuildingProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* عدد الطوابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عدد الطوابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.floorsCount", {
            required: t("common.required"),
            min: { value: 1, message: "يجب أن يكون على الأقل طابق واحد" },
            max: { value: 200, message: "الحد الأقصى 200" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ResidentialBuilding?.floorsCount && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.floorsCount.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة البناية السكنية (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.propertyArea", {
            required: t("common.required"),
            min: { value: 20, message: "الحد الأدنى 20 م²" },
            max: { value: 2000, message: "الحد الأقصى 2000 م²" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ResidentialBuilding?.propertyArea && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.propertyArea.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">نوع العقار</label>
        <select
          {...register("ResidentialBuilding.habitability")}
          className="input-field"
        >
          <option value="">لا يوجد</option>
          <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
        </select>
        {errors?.ResidentialBuilding?.habitability && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.habitability.message}
          </p>
        )}
      </div>
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
          className="input-field"
        />
        {errors?.ResidentialBuilding?.apartmentsPerFloor && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.apartmentsPerFloor.message}
          </p>
        )}
      </div>

      {/* نوع الاستخدام */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع الاستخدام <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.usageType", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="residential">سكني</option>
          <option value="residential-commercial">تجاري سكني</option>
          <option value="administrative">إداري</option>
        </select>
        {errors?.ResidentialBuilding?.usageType && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.usageType.message}
          </p>
        )}
      </div>

      {/* نوع الهيكل */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع الهيكل <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.structureType", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="concrete">هيكل خرسانة</option>
          <option value="steel">هيكل معدني</option>
        </select>
        {errors?.ResidentialBuilding?.structureType && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.structureType.message}
          </p>
        )}
      </div>

      {/* ====== مستوى الضرر ====== */}

      {/* أعمدة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          حالة الأعمدة <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.columnsCondition", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="good">سليمة</option>
          <option value="cracked">متشققة</option>
          <option value="collapsed">منهارة</option>
          <option value="needs-support">بحاجة تدعيم</option>
        </select>
        {errors?.ResidentialBuilding?.columnsCondition && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.columnsCondition.message}
          </p>
        )}
      </div>

      {/* كمرات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          حالة الكمرات <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.beamsCondition", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="severe">متضررة</option>
          <option value="moderate">متوسطة</option>
          <option value="minor">طفيفة</option>
        </select>
        {errors?.ResidentialBuilding?.beamsCondition && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.beamsCondition.message}
          </p>
        )}
      </div>

      {/* جدران خارجية */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الجدران الخارجية <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.externalWalls", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="good">سليمة</option>
          <option value="cracked">متشققة</option>
          <option value="damaged">متضررة</option>
        </select>
        {errors?.ResidentialBuilding?.externalWalls && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.externalWalls.message}
          </p>
        )}
      </div>

      {/* سقف */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر السقف <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.ceilingDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="penetration">اختراق</option>
          <option value="heavyDamage">تهتك</option>
          <option value="cracks">تشققات</option>
        </select>
        {errors?.ResidentialBuilding?.ceilingDamage && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.ceilingDamage.message}
          </p>
        )}
      </div>

      {/* واجهات المبنى */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          واجهات المبنى <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.buildingFacade", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="good">سليمة</option>
          <option value="damaged">متضررة</option>
          <option value="broken">محطمة</option>
        </select>
        {errors?.ResidentialBuilding?.buildingFacade && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.buildingFacade.message}
          </p>
        )}
      </div>

      {/* مداخل وأدراج */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مداخل وأدراج البناية <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.entrancesStairs", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="good">سليمة</option>
          <option value="damaged">متضررة</option>
          <option value="collapsed">منهارة</option>
        </select>
        {errors?.ResidentialBuilding?.entrancesStairs && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.entrancesStairs.message}
          </p>
        )}
      </div>

      {/* المصاعد */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المصاعد <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.elevators", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="working">تعمل</option>
          <option value="stuck">تعطل</option>
          <option value="damaged">تلف</option>
        </select>
        {errors?.ResidentialBuilding?.elevators && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.elevators.message}
          </p>
        )}
      </div>

      {/* الكهرباء العامة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          شبكة الكهرباء العامة <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.electricalNetwork", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="good">سليمة</option>
          <option value="partial">متضررة جزئياً</option>
          <option value="complete">متضررة كلياً</option>
        </select>
        {errors?.ResidentialBuilding?.electricalNetwork && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.electricalNetwork.message}
          </p>
        )}
      </div>

      {/* خزانات المياه */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          خزانات المياه على السطح <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.waterTanks", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="good">سليمة</option>
          <option value="damaged">متضررة</option>
          <option value="fallen">ساقطة</option>
        </select>
        {errors?.ResidentialBuilding?.waterTanks && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.waterTanks.message}
          </p>
        )}
      </div>

      {/* شبكة الصرف */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          شبكة الصرف <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.sewageNetwork", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر</option>
          <option value="good">سليمة</option>
          <option value="damaged">متضررة</option>
          <option value="blocked">مسدودة</option>
        </select>
        {errors?.ResidentialBuilding?.sewageNetwork && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.sewageNetwork.message}
          </p>
        )}
      </div>

      {/* أنظمة الحريق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          أنظمة الحريق (إن وجدت)
        </label>
        <select
          {...register("ResidentialBuilding.fireSystems")}
          className="input-field"
        >
          <option value="">غير موجود</option>
          <option value="working">تعمل</option>
          <option value="damaged">متضررة</option>
        </select>
      </div>

      {/* تقييم */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الطوابق الأكثر ضررًا
        </label>
        <input
          type="text"
          {...register("ResidentialBuilding.mostDamagedFloors")}
          className="input-field"
          placeholder="مثال: الطابق 3 و 4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تفاصيل الضرر <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.damageType", {
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

        {errors?.ResidentialBuilding?.damageType && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.damageType.message}
          </p>
        )}
      </div>
      {/* نسبة الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة الضرر الإجمالي (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ResidentialBuilding.damagePercentage", {
            required: t("common.required"),
            min: { value: 0, message: "لا يمكن أن تكون أقل من 0%" },
            max: { value: 100, message: "لا يمكن أن تتجاوز 100%" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ResidentialBuilding?.damagePercentage && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.damagePercentage.message}
          </p>
        )}
      </div>

      {/* إمكانية الاستخدام */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          إمكانية الاستخدام <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ResidentialBuilding.usageFeasibility", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر</option>
          <option value="usable">يمكن الاستخدام</option>
          <option value="needs-repair">بحاجة إصلاح</option>
          <option value="evacuation">يحتاج إخلاء</option>
        </select>
        {errors?.ResidentialBuilding?.usageFeasibility && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.usageFeasibility.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          هل هو قابل للسكن حالياً؟
        </label>
        <select
          {...register("ResidentialBuilding.isHabitable")}
          className="input-field"
        >
          <option value="">لا يوجد</option>
          <option value="true">نعم</option>
          <option value="false">لا </option>
        </select>
        {errors?.ResidentialBuilding?.isHabitable && (
          <p className="text-red-600 text-sm">
            {errors.ResidentialBuilding.isHabitable.message}
          </p>
        )}
      </div>
      {/* ملاحظات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات إضافية
        </label>
        <textarea
          {...register("ResidentialBuilding.additionalNotes")}
          className="input-field min-h-[100px] resize-none"
          placeholder="اكتب أي تفاصيل إضافية..."
        ></textarea>
      </div>
    </div>
  );
};

export default ResidentialBuilding;
