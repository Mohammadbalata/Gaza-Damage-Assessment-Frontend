import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { useLanguage } from "../../contexts/LanguageContext";
interface IndependentBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
}
const IndependentBuilding = ({
  register,
  errors,
}: IndependentBuildingProps) => {
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
          {...register("IndependentBuilding.numberOfFloors", {
            required: t("common.required"),
            min: { value: 1, message: "الحد الأدنى طابق واحد" },
            max: { value: 200, message: "الحد الأقصى 200 طابق" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.IndependentBuilding?.numberOfFloors && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.numberOfFloors.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة المبنى (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("IndependentBuilding.propertyArea", {
            required: t("common.required"),
            min: { value: 20, message: "الحد الأدنى 20 م²" },
            max: { value: 2000, message: "الحد الأقصى 2000 م²" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.IndependentBuilding?.propertyArea && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.propertyArea.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">نوع العقار</label>
        <select
          {...register("IndependentBuilding.habitability")}
          className="input-field"
        >
          <option value="">لا يوجد</option>
          <option value="ملك">ملك</option>
            <option value="ايجار">ايجار </option>
        </select>
        {errors?.IndependentBuilding?.habitability && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.habitability.message}
          </p>
        )}
      </div>

      {/* مساحة كل طابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة كل طابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("IndependentBuilding.floorArea", {
            required: t("common.required"),
            min: { value: 10, message: "الحد الأدنى 10 متر مربع" },
            max: { value: 10000, message: "الحد الأقصى 10000 متر مربع" },
            valueAsNumber: true,
          })}
          className="input-field"
        />

        {errors?.IndependentBuilding?.floorArea && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.floorArea.message}
          </p>
        )}
      </div>

      {/* نوع السقف */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع السقف <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.roofType", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="concrete">بلاطة خرسانية</option>
          <option value="arch">عقد</option>
          <option value="zinc">زينكو</option>
          <option value="turbo">تيربو</option>
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
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="block">بلوك</option>
          <option value="stone">حجر</option>
          <option value="brick">طوب</option>
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
          {...register("IndependentBuilding.buildingAge", {
            required: t("common.required"),
            min: { value: 1, message: "الحد الأدنى سنة واحدة" },
            max: { value: 200, message: "الحد الأقصى 200 سنة" },
            valueAsNumber: true,
          })}
          className="input-field"
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

        {errors?.IndependentBuilding?.damageType && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.damageType.message}
          </p>
        )}
      </div>

      {/* نسبة الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة الضرر (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("IndependentBuilding.damagePercentage", {
            required: t("common.required"),
            min: { value: 0, message: "لا يمكن أن تكون أقل من 0" },
            max: { value: 100, message: "لا يمكن أن تتجاوز 100%" },
            valueAsNumber: true,
          })}
          className="input-field"
        />

        {errors?.IndependentBuilding?.damagePercentage && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.damagePercentage.message}
          </p>
        )}
      </div>

      {/* قابلية السكن */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          قابلية السكن <span className="text-red-500">*</span>
        </label>
        <select
          {...register("IndependentBuilding.habitability", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="habitable">صالح للسكن</option>
          <option value="needs-reinforcement">يحتاج تدعيم</option>
          <option value="uninhabitable">غير صالح</option>
        </select>

        {errors?.IndependentBuilding?.habitability && (
          <p className="text-red-600 text-sm">
            {errors.IndependentBuilding.habitability.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          هل هو قابل للسكن حالياً؟
        </label>
        <select
          {...register("IndependentBuilding.isHabitable")}
          className="input-field"
        >
          <option value="">لا يوجد</option>
          <option value="true">نعم</option>
          <option value="false">لا </option>
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
          className="input-field min-h-[100px] resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default IndependentBuilding;
