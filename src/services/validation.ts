import * as yup from "yup";
import {
  AccountStatus,
  AccountType,
  ApplicationStatus,
  LocationType,
  UserRole,
} from "../types/entities";

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
    .oneOf([UserRole.ADMIN, UserRole.SUPERVISOR], "دور غير صالح")
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
      [
        ApplicationStatus.APPROVED,
        ApplicationStatus.PENDING,
        ApplicationStatus.CLOSED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.VERIFIED,
      ],
      "حالة غير صحيحة"
    ),

  notes: yup
    .string()
    .optional()
    .max(1000, "يجب أن تكون الملاحظات أقل من 1000 حرف"),
});

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
      [
        LocationType.AFTER_WAR,
        LocationType.TEMPORARY,
        LocationType.BEFORE_WAR,
        LocationType.CURRENT,
      ],
      "نوع موقع غير صحيح"
    ),

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

  roleId: yup.number().required("رقم الدور مطلوب"),
});

export const bankAccountSchema = yup.object({
  bankId: yup.string().required("البنك مطلوب"),
  accountHolderName: yup
    .string()
    .required("اسم صاحب الحساب مطلوب")
    .min(2, "يجب أن يكون الاسم حرفين على الأقل"),
  accountNumber: yup
    .string()
    .required("رقم الحساب مطلوب")
    .min(5, "رقم الحساب غير صحيح"),
  iban: yup.string().optional(),
  accountType: yup
    .string()
    .required("نوع الحساب مطلوب")
    .oneOf(
      [AccountType.CURRENT, AccountType.SAVINGS, AccountType.WALLET],
      "نوع حساب غير صحيح"
    ),
  currency: yup.string().required("العملة مطلوبة"),
  isPrimary: yup.boolean().optional(),
  status: yup
    .string()
    .optional()
    .oneOf(
      [AccountStatus.ACTIVE, AccountStatus.CLOSED, AccountStatus.SUSPENDED],
      "حالة غير صحيحة"
    ),
});
