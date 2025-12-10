import * as yup from "yup";

// Basic validation schemas
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

// Login schema
export const loginSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

// Admin User schema
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

// Citizen schema
export const citizenSchema = yup.object().shape({
  national_id: yup
    .string()
    .min(9, "الرقم الوطني يجب أن يكون 9 أرقام على الأقل")
    .required("الرقم الوطني مطلوب"),

  first_name: yup
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب ألا يتجاوز 100 حرف"),
  father_name: yup
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب ألا يتجاوز 100 حرف"),
  grandfather_name: yup
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب ألا يتجاوز 100 حرف"),
  family_name: yup
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب ألا يتجاوز 100 حرف"),
  phone_number: yup.string().required("رقم الهاتف مطلوب"),
});

// Application schema
export const applicationSchema = yup.object({
  citizenId: yup
    .number()
    .required("رقم المواطن مطلوب")
    .positive("يجب أن يكون رقم المواطن موجباً")
    .integer("يجب أن يكون رقم المواطن رقماً صحيحاً"),

  status: yup
    .string()
    .required("الحالة مطلوبة")
    .oneOf(
      ["pending", "verified", "approved", "rejected", "closed"],
      "حالة غير صحيحة"
    ),

  notes: yup
    .string()
    .optional()
    .max(1000, "يجب أن تكون الملاحظات أقل من 1000 حرف"),
});

// Location schema
export const locationSchema = yup.object({
  citizenId: yup
    .number()
    .required("رقم المواطن مطلوب")
    .positive("يجب أن يكون رقم المواطن موجباً")
    .integer("يجب أن يكون رقم المواطن رقماً صحيحاً"),

  type: yup
    .string()
    .required("النوع مطلوب")
    .oneOf(
      ["before_war", "after_war", "temporary", "current"],
      "نوع موقع غير صحيح"
    ),

  governorate: yup
    .string()
    .optional()
    .max(100, "يجب أن تكون المحافظة أقل من 100 حرف"),

  town: yup.string().optional().max(100, "يجب أن تكون البلدة أقل من 100 حرف"),

  street: yup.string().optional().max(200, "يجب أن يكون الشارع أقل من 200 حرف"),

  block_number: yup
    .string()
    .optional()
    .max(50, "يجب أن يكون رقم البلوك أقل من 50 حرف"),

  house_number: yup
    .string()
    .optional()
    .max(50, "يجب أن يكون رقم المنزل أقل من 50 حرف"),

  latitude: yup
    .number()
    .optional()
    .min(-90, "يجب أن يكون خط العرض بين -90 و 90")
    .max(90, "يجب أن يكون خط العرض بين -90 و 90"),

  longitude: yup
    .number()
    .optional()
    .min(-180, "يجب أن يكون خط الطول بين -180 و 180")
    .max(180, "يجب أن يكون خط الطول بين -180 و 180"),

  notes: yup
    .string()
    .optional()
    .max(1000, "يجب أن تكون الملاحظات أقل من 1000 حرف"),
});

export const userSchema = yup.object({
  name: yup
    .string()
    .required("الاسم مطلوب")
    .min(2, "يجب أن يكون الاسم على الأقل حرفين")
    .max(100, "يجب أن يكون الاسم أقل من 100 حرف"),

  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(255, "يجب أن يكون البريد الإلكتروني أقل من 255 حرف"),

  password: yup.string().when("$isEditing", {
    is: false,
    then: (schema) =>
      schema
        .required("كلمة المرور مطلوبة")
        .min(6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل")
        .max(100, "يجب أن تكون كلمة المرور أقل من 100 حرف"),
    otherwise: (schema) =>
      schema
        .optional()
        .min(6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل")
        .max(100, "يجب أن تكون كلمة المرور أقل من 100 حرف"),
  }),

  role: yup
    .string()
    .required("الدور مطلوب")
    .oneOf(["admin", "supervisor"], "دور غير صحيح"),
});



// export const citizenSchema = yup.object({
//   national_id: yup
//     .string()
//     .required("الرقم الوطني مطلوب")
//     .min(9, "يجب أن يكون الرقم الوطني 9 أرقام على الأقل")
//     .max(20, "يجب أن يكون الرقم الوطني أقل من 20 رقم"),

//   first_name: yup
//     .string()
//     .required("الاسم الأول مطلوب")
//     .min(2, "يجب أن يكون الاسم الأول حرفين على الأقل")
//     .max(100, "يجب أن يكون الاسم الأول أقل من 100 حرف"),

//   father_name: yup
//     .string()
//     .required("اسم الأب مطلوب")
//     .min(2, "يجب أن يكون اسم الأب حرفين على الأقل")
//     .max(100, "يجب أن يكون اسم الأب أقل من 100 حرف"),

//   grandfather_name: yup
//     .string()
//     .required("اسم الجد مطلوب")
//     .min(2, "يجب أن يكون اسم الجد حرفين على الأقل")
//     .max(100, "يجب أن يكون اسم الجد أقل من 100 حرف"),

//   family_name: yup
//     .string()
//     .required("اسم العائلة مطلوب")
//     .min(2, "يجب أن يكون اسم العائلة حرفين على الأقل")
//     .max(100, "يجب أن يكون اسم العائلة أقل من 100 حرف"),

//   phone_number: yup
//     .string()
//     .required("رقم الهاتف مطلوب")
//     .min(9, "يجب أن يكون رقم الهاتف 9 أرقام على الأقل")
//     .max(15, "يجب أن يكون رقم الهاتف أقل من 15 رقم"),
// });
