import * as yup from "yup";

// مخططات التحقق الأساسية
export const emailSchema = yup
  .string()
  .email("بريد إلكتروني غير صالح")
  .required("البريد الإلكتروني مطلوب");

export const passwordSchema = yup
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .required("كلمة المرور مطلوبة");

export const nameSchema = yup
  .string()
  .min(2, "الاسم يجب أن يكون على الأقل حرفين")
  .max(100, "الاسم يجب ألا يتجاوز 100 حرف")
  .required("الاسم مطلوب");

export const nationalIdSchema = yup
  .string()
  .min(9, "الرقم الوطني يجب أن يكون 9 أرقام على الأقل")
  .required("الرقم الوطني مطلوب");

export const coordinateSchema = yup
  .number()
  .typeError("يجب أن تكون قيمة رقمية")
  .required("الإحداثي مطلوب");

// مخطط تسجيل الدخول
export const loginSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

// مخطط المستخدم الإداري
export const adminUserSchema = yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  role: yup
    .string()
    .oneOf(["admin", "supervisor"], "دور غير صالح")
    .required("الدور مطلوب"),
  password: yup.string().when("isEditing", {
    is: false,
    then: (schema) => schema.required("كلمة المرور مطلوبة"),
    otherwise: (schema) => schema.min(8, "كلمة المرور على الأقل 8 أحرف"),
  }),
});

// مخطط المواطن
export const citizenSchema = yup.object().shape({
  national_id: nationalIdSchema,
  first_name: yup
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب ألا يتجاوز 100 حرف"),
  gender: yup.string().oneOf(["male", "female"], "جنس غير صالح"),
  status: yup
    .string()
    .oneOf(["alive", "dead"], "حالة غير صالحة")
    .required("الحالة مطلوبة"),
});

// مخطط الطلب
export const applicationSchema = yup.object().shape({
  citizenId: yup
    .number()
    .typeError("يجب أن يكون رقم المواطن رقماً")
    .required("رقم المواطن مطلوب"),
  locationId: yup.number().typeError("يجب أن يكون رقم الموقع رقماً"),
  status: yup
    .string()
    .oneOf(
      ["pending", "verified", "approved", "rejected", "closed"],
      "حالة غير صالحة"
    )
    .required("الحالة مطلوبة"),
  notes: yup.string().max(500, "الملاحظات يجب ألا تتجاوز 500 حرف"),
});

// مخطط الموقع
export const locationSchema = yup.object().shape({
  citizenId: yup
    .number()
    .typeError("يجب أن يكون رقم المواطن رقماً")
    .required("رقم المواطن مطلوب"),
  type: yup
    .string()
    .oneOf(["before_war", "after_war", "temporary", "current"], "نوع غير صالح")
    .required("النوع مطلوب"),
  governorate: yup.string().max(100, "المحافظة يجب ألا تتجاوز 100 حرف"),
  town: yup.string().max(100, "المدينة يجب ألا تتجاوز 100 حرف"),
  street: yup.string().max(100, "الشارع يجب ألا تتجاوز 100 حرف"),
  block_number: yup.string().max(20, "رقم البلوك يجب ألا يتجاوز 20 حرف"),
  house_number: yup.string().max(20, "رقم البيت يجب ألا يتجاوز 20 حرف"),
  latitude: yup
    .number()
    .typeError("يجب أن تكون العرض قيمة رقمية")
    .min(-90, "العرض يجب أن يكون بين -90 و 90")
    .max(90, "العرض يجب أن يكون بين -90 و 90"),
  longitude: yup
    .number()
    .typeError("يجب أن تكون الطول قيمة رقمية")
    .min(-180, "الطول يجب أن يكون بين -180 و 180")
    .max(180, "الطول يجب أن يكون بين -180 و 180"),
  notes: yup.string().max(500, "الملاحظات يجب ألا تتجاوز 500 حرف"),
});
