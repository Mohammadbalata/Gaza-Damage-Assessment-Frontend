import { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/entities";

export class ApiErrorHandler {
  static handle(error: unknown): string {
    if (error instanceof AxiosError) {
      const response = error.response?.data as ApiErrorResponse;

      // معالجة رسائل الخطأ من الخادم
      if (response?.message) {
        return response.message;
      }

      if (response?.error) {
        return response.error;
      }

      // معالجة أخطاء التحقق من الحقول
      if (response?.errors && typeof response.errors === "object") {
        const firstError = Object.values(response.errors)[0];
        if (Array.isArray(firstError)) {
          return firstError[0];
        }
      }

      // معالجة أكواد الحالة HTTP
      switch (error.response?.status) {
        case 400:
          return "طلب غير صالح";
        case 401:
          return "بيانات اعتماد غير صحيحة";
        case 403:
          return "ليس لديك إذن للوصول";
        case 404:
          return "المورد غير موجود";
        case 409:
          return "تعارض في البيانات";
        case 500:
          return "خطأ في الخادم";
        case 503:
          return "الخدمة غير متاحة";
        default:
          return error.message || "حدث خطأ غير متوقع";
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "حدث خطأ غير متوقع";
  }

  static getFieldErrors(error: unknown): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    if (error instanceof AxiosError) {
      const response = error.response?.data as ApiErrorResponse;

      if (response?.errors && typeof response.errors === "object") {
        Object.entries(response.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            fieldErrors[field] = messages[0];
          }
        });
      }
    }

    return fieldErrors;
  }
}

export default ApiErrorHandler;
