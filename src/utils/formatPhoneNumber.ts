// export const normalizePhone = (value: any) => {
//   if (!value) return "";

//   // 1) إزالة المسافات
//   let phone = value.replace(/\s+/g, "");

//   // 2) السماح فقط بالأرقام وعلامة +
//   phone = phone.replace(/[^\d+]/g, "");

//   // 3) إزالة جميع "+" الأخرى غير الأولى
//   phone = phone.replace(/\+(?=.*\+)/g, "");

//   // 4) لو بدأ الرقم بصفر → احذف الصفر
//   if (value.startsWith("0")) {
//     phone = phone.substring(1);
//   }

//   // 5) لو بدأ +970 أو +972 → اتركه كما هو
//   if (phone.startsWith("+970") || phone.startsWith("+972")) {
//     return phone;
//   }

//   // 6) لو بدأ 970 أو 972 بدون زائد + → أضف +
//   if (phone.startsWith("970")) {
//     return "+" + phone;
//   }

//   if (phone.startsWith("972")) {
//     return "+" + phone;
//   }

//   // 7) أي رقم آخر بدون مقدمة → اعطيه المقدمة +970
//   return "+970" + phone.replace(/^\+?/, "");
// };

export const normalizePhone:any = (value: any) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length > 12) return digits;
  return digits

};
