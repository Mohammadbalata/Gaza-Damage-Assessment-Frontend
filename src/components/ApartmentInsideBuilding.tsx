import { useLanguage } from "../contexts/LanguageContext";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";

interface ApartmentInsideBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
}
const ApartmentInsideBuilding = ({
  register,
  errors,
}: ApartmentInsideBuildingProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* رقم الطابق */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الطابق <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ApartmentInsideBuilding.floorNumber", {
            required: t("common.required"),
            min: { value: -5, message: "الحد الأدنى -5 (طوابق سفلية)" },
            max: { value: 200, message: "الحد الأقصى 200" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ApartmentInsideBuilding?.floorNumber && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.floorNumber.message}
          </p>
        )}
      </div>

      {/* رقم الشقة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الشقة / الموقع <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("ApartmentInsideBuilding.apartmentNumber", {
            required: t("common.required"),
            minLength: { value: 1, message: "رقم الشقة غير صالح" },
          })}
          className="input-field"
        />
        {errors?.ApartmentInsideBuilding?.apartmentNumber && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.apartmentNumber.message}
          </p>
        )}
      </div>

      {/* مساحة الشقة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مساحة الشقة (م²) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ApartmentInsideBuilding.apartmentArea", {
            required: t("common.required"),
            min: { value: 20, message: "الحد الأدنى 20 م²" },
            max: { value: 2000, message: "الحد الأقصى 2000 م²" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ApartmentInsideBuilding?.apartmentArea && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.apartmentArea.message}
          </p>
        )}
      </div>

      {/* عدد الغرف */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عدد الغرف والمنافع <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ApartmentInsideBuilding.roomsCount", {
            required: t("common.required"),
            min: { value: 1, message: "يجب أن يكون على الأقل غرفة واحدة" },
            max: { value: 50, message: "الحد الأقصى 50" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ApartmentInsideBuilding?.roomsCount && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.roomsCount.message}
          </p>
        )}
      </div>

      {/* تشققات الجدران */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تشققات الجدران <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.wallCracks", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="none">لا يوجد</option>
          <option value="structural">إنشائية</option>
          <option value="nonStructural">غير إنشائية</option>
        </select>
        {errors?.ApartmentInsideBuilding?.wallCracks && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.wallCracks.message}
          </p>
        )}
      </div>

      {/* الأبواب */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر الأبواب <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.doorsDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="none">لا يوجد</option>
          <option value="minor">تلف طفيف</option>
          <option value="moderate">تلف متوسط</option>
          <option value="severe">تلف شديد</option>
        </select>
        {errors?.ApartmentInsideBuilding?.doorsDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.doorsDamage.message}
          </p>
        )}
      </div>

      {/* النوافذ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر النوافذ والزجاج <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.windowsDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="none">لا يوجد</option>
          <option value="broken">محطم</option>
          <option value="cracked">متشقق</option>
        </select>
        {errors?.ApartmentInsideBuilding?.windowsDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.windowsDamage.message}
          </p>
        )}
      </div>

      {/* الأرضيات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر الأرضيات <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.floorDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="none">لا يوجد</option>
          <option value="ceramic">سيراميك</option>
          <option value="parquet">باركيه</option>
          <option value="sidewalk">رصيف</option>
        </select>
        {errors?.ApartmentInsideBuilding?.floorDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.floorDamage.message}
          </p>
        )}
      </div>

      {/* السقف */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر السقف <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.ceilingDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر النوع</option>
          <option value="none">لا يوجد</option>
          <option value="penetration">اختراق</option>
          <option value="cracks">تشققات</option>
          <option value="leak">تسريب</option>
        </select>
        {errors?.ApartmentInsideBuilding?.ceilingDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.ceilingDamage.message}
          </p>
        )}
      </div>

      {/* المطبخ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر المطبخ والخزائن <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.kitchenDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="none">لا يوجد</option>
          <option value="minor">تلف بسيط</option>
          <option value="moderate">تلف متوسط</option>
          <option value="severe">تلف شديد</option>
        </select>
        {errors?.ApartmentInsideBuilding?.kitchenDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.kitchenDamage.message}
          </p>
        )}
      </div>

      {/* الحمامات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر الحمامات وشبكات المياه <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.bathroomDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="none">لا يوجد</option>
          <option value="pipes">تضرر المواسير</option>
          <option value="fixtures">تضرر الأدوات الصحية</option>
          <option value="leaks">تسريب مياه</option>
        </select>
        {errors?.ApartmentInsideBuilding?.bathroomDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.bathroomDamage.message}
          </p>
        )}
      </div>

      {/* الكهرباء */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تضرر الكهرباء الداخلية <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.electricalDamage", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="none">لا يوجد</option>
          <option value="partial">تضرر جزئي</option>
          <option value="complete">تضرر كامل</option>
        </select>
        {errors?.ApartmentInsideBuilding?.electricalDamage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.electricalDamage.message}
          </p>
        )}
      </div>

      {/* ضرر المبنى الأم */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ضرر المبنى الأم (إن وجد)
        </label>
        <textarea
          {...register("ApartmentInsideBuilding.mainBuildingDamage")}
          className="input-field min-h-[100px] resize-none"
          placeholder="مثال: تشققات أعمدة، تضرر الواجهات..."
        ></textarea>
      </div>

      {/* نسبة الضرر */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة الضرر (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("ApartmentInsideBuilding.damagePercentage", {
            required: t("common.required"),
            min: { value: 0, message: "لا يمكن أن تكون أقل من 0" },
            max: { value: 100, message: "لا يمكن أن تتجاوز 100%" },
            valueAsNumber: true,
          })}
          className="input-field"
        />
        {errors?.ApartmentInsideBuilding?.damagePercentage && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.damagePercentage.message}
          </p>
        )}
      </div>

      {/* صلاحية السكن */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          صلاحية الشقة للسكن <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ApartmentInsideBuilding.habitability", {
            required: t("common.required"),
          })}
          className="input-field"
        >
          <option value="">اختر الحالة</option>
          <option value="habitable">صالحة للسكن</option>
          <option value="needs-repair">تحتاج إصلاح</option>
          <option value="uninhabitable">غير صالحة</option>
        </select>
        {errors?.ApartmentInsideBuilding?.habitability && (
          <p className="text-red-600 text-sm">
            {errors.ApartmentInsideBuilding.habitability.message}
          </p>
        )}
      </div>

      {/* ملاحظات إضافية */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات إضافية
        </label>
        <textarea
          {...register("ApartmentInsideBuilding.additionalNotes")}
          className="input-field min-h-[100px] resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default ApartmentInsideBuilding;
