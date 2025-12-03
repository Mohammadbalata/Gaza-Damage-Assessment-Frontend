export const translations: Record<"en" | "ar", Record<string, string>> = {
  en: {
    // Common
    "app.title": "Gaza Damage Assessment System",
    "app.subtitle": "Ministry of Public Works and Housing",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.back": "Back",
    "common.next": "Next",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.required": "Required",
    "common.optional": "Optional",
    "common.select": "Select Files",
    "common.signIn": "Sign in",
    "common.signUp": "Create Account",
    "common.signUp-qesution": "Don't have an account?",
    "common.signIn-qesution": "Do you have an account?",
    "common.or": "OR",

    // Auth
    "auth.nationalId": "National ID",
    "auth.nationalIdPlaceholder": "Enter 9-digit national ID",
    "auth.nationalIdError": "National ID must be exactly 9 digits",
    "auth.login": "Login",
    "auth.adminLogin": "Admin Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.passwordPlaceholder": "Enter Your Password",
    "auth.passwordError": "Password is Not Vaild ",
    "auth.passwordTooShort": "Your Password must be at least 8 characters",
    "auth.passwordMissingUpper":
      "Your Password must include at least one uppercase letter (A-Z).",
    "auth.passwordMissingLower":
      "Your Password must include at least one uppercase letter (a-z).",
    "auth.passwordMissingNumber":
      "Your Password must include at least one number (0-9).",
    "auth.passwordMissingSymbol":
      "Your Password must include at least one special symbol.",
    "auth.verify": "Verify",
    "auth.trackStatus": "Track Application Status",
    "auth.generatePassword": "Generate Password",
    "auth.verifyQuesTitle": "Identity Verification",
    "auth.verifyQuesBody":
      "Please answer the following questions to verify your identity. These questions are based on your civil registry information.",

    // Personal Info
    "form.fullName": "Full Name",
    "form.motherName": "Mother's Name",
    "form.dateOfBirth": "Date of Birth",
    "form.addressBeforeWar": "Address Before War",
    "form.numberOfChildren": "Number of Children",
    "form.wifeName": "Wife's Name",
    "form.wifeNationalId": "Wife's National ID",
    "form.phoneNumber": "Phone Number",

    // Damage Assessment
    "form.damageLevel": "Damage Level",
    "form.propertyType": "Property Type",
    "form.propertySize": "Property Size (sq meters)",
    "form.numberOfRooms": "Number of Rooms",
    "form.isInhabitable": "Is Currently Inhabitable?",
    "form.yes": "Yes",
    "form.no": "No",
    "form.additionalNotes": "Additional Notes",

    // Documents
    "form.uploadDocuments": "Upload Documents",
    "form.dragDrop": "Click to upload or drag and drop",
    "form.maxFiles": "Maximum 10 files, 5MB each",
    "form.removeFile": "Remove",

    // Map
    "map.selectLocation": "Select Property Location",
    "map.clickToPlace": "Click on the map to place marker",
    "map.coordinates": "Coordinates",
    "map.address": "Address",
    "map.reset": "Reset Location",
    "map.confirm": "Confirm Location",

    // Review
    "review.title": "Review Your Application",
    "review.identityInfo": "Identity Information",
    "review.familyInfo": "Family Information",
    "review.damageInfo": "Damage Assessment",
    "review.location": "Location",
    "review.documents": "Uploaded Documents",
    "review.submit": "Submit Application",

    // Success
    "success.title": "Application Submitted Successfully!",
    "success.trackingNumber": "Tracking Number",
    "success.password": "Your Password",
    "success.savePassword": "Please save this password securely",
    "success.downloadReceipt": "Download PDF Receipt",
    "success.trackStatus": "Track Application Status",

    // Status
    "status.submitted": "Submitted",
    "status.underReview": "Under Review",
    "status.verified": "Verified",
    "status.approved": "Approved",
    "status.rejected": "Rejected",

    // Admin
    "admin.dashboard": "Dashboard",
    "admin.applications": "Applications",
    "admin.statistics": "Statistics",
    "admin.totalApplications": "Total Applications",
    "admin.pendingReview": "Pending Review",
    "admin.approved": "Approved",
    "admin.rejected": "Rejected",
    "admin.viewDetails": "View Details",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.rejectionReason": "Rejection Reason",
    "admin.notes": "Admin Notes",

    // Verification
    "verification.title": "Identity Verification",
    "verification.description":
      "Please answer the following questions to verify your identity",
    "verification.success": "Verification Successful!",
    "verification.failed": "Verification failed. Please check your answers.",

    // Locations
    "location.previous": "Previous Location (Before War)",
    "location.current": "Current Location",
    "location.selectPrevious": "Select Your Previous Location (Before War)",
    "location.selectCurrent": "Select Your Current Location",
  },
  ar: {
    // Common
    "app.title": "نظام تقييم الأضرار في غزة",
    "app.subtitle": "وزارة الأشغال العامة والإسكان",
    "common.submit": "إرسال",
    "common.cancel": "إلغاء",
    "common.back": "رجوع",
    "common.next": "التالي",
    "common.save": "حفظ",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.export": "تصدير",
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.required": "مطلوب",
    "common.optional": "اختياري",
    "common.select": "اختيار الملفات",
    "common.signIn": "تسجيل الدخول",
    "common.signUp": "انشاء حساب",
    "common.signUp-qesution": "ليس لديك حساب؟",
    "common.signIn-qesution": "هل لديك حساب بالفعل؟",
    "common.or": "أو",

    // Auth
    "auth.nationalId": "رقم الهوية الوطنية",
    "auth.nationalIdPlaceholder": "أدخل رقم الهوية المكون من 9 أرقام",
    "auth.nationalIdError": "يجب أن يكون رقم الهوية 9 أرقام بالضبط",
    "auth.login": "تسجيل الدخول",
    "auth.adminLogin": "تسجيل دخول المسؤول",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.passwordPlaceholder": "أدخل كلمة المرور الخاصة بك",
    "auth.passwordError": "كلمة المرور خاطئة ",
    "auth.passwordTooShort": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    "auth.passwordMissingUpper":
      "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل",
    "auth.passwordMissingLower":
      "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل",
    "auth.passwordMissingNumber":
      "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
    "auth.passwordMissingSymbol":
      "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل",
    "auth.verify": "التحقق",
    "auth.trackStatus": "تتبع حالة الطلب",
    "auth.generatePassword": "إنشاء كلمة مرور",
    "auth.verifyQuesTitle": "التحقق من الهوية",
    "auth.verifyQuesBody":'يرجى الإجابة على الأسئلة التالية للتحقق من هويتك. هذه الأسئلة مبنية على معلومات سجلك المدني.',
    "auth.verifySuccess" : '',
    // Personal Info
    "form.fullName": "الاسم الكامل",
    "form.motherName": "اسم الأم",
    "form.dateOfBirth": "تاريخ الميلاد",
    "form.addressBeforeWar": "العنوان قبل الحرب",
    "form.numberOfChildren": "عدد الأطفال",
    "form.wifeName": "اسم الزوجة",
    "form.wifeNationalId": "رقم هوية الزوجة",
    "form.phoneNumber": "رقم الهاتف",

    // Damage Assessment
    "form.damageLevel": "مستوى الضرر",
    "form.propertyType": "نوع العقار",
    "form.propertySize": "مساحة العقار (متر مربع)",
    "form.numberOfRooms": "عدد الغرف",
    "form.isInhabitable": "هل هو قابل للسكن حالياً؟",
    "form.yes": "نعم",
    "form.no": "لا",
    "form.additionalNotes": "ملاحظات إضافية",

    // Documents
    "form.uploadDocuments": "رفع المستندات",
    "form.dragDrop": "انقر للرفع أو اسحب وأفلت",
    "form.maxFiles": "حد أقصى 10 ملفات، 5 ميجابايت لكل ملف",
    "form.removeFile": "إزالة",

    // Map
    "map.selectLocation": "اختر موقع العقار",
    "map.clickToPlace": "انقر على الخريطة لوضع العلامة",
    "map.coordinates": "الإحداثيات",
    "map.address": "العنوان",
    "map.reset": "إعادة تعيين الموقع",
    "map.confirm": "تأكيد الموقع",

    // Review
    "review.title": "مراجعة طلبك",
    "review.identityInfo": "معلومات الهوية",
    "review.familyInfo": "معلومات العائلة",
    "review.damageInfo": "تقييم الأضرار",
    "review.location": "الموقع",
    "review.documents": "المستندات المرفوعة",
    "review.submit": "إرسال الطلب",

    // Success
    "success.title": "تم إرسال الطلب بنجاح!",
    "success.trackingNumber": "رقم التتبع",
    "success.password": "كلمة المرور الخاصة بك",
    "success.savePassword": "يرجى حفظ كلمة المرور هذه بشكل آمن",
    "success.downloadReceipt": "تحميل إيصال PDF",
    "success.trackStatus": "تتبع حالة الطلب",

    // Status
    "status.submitted": "تم الإرسال",
    "status.underReview": "قيد المراجعة",
    "status.verified": "تم التحقق",
    "status.approved": "تم الموافقة",
    "status.rejected": "تم الرفض",

    // Admin
    "admin.dashboard": "لوحة التحكم",
    "admin.applications": "الطلبات",
    "admin.statistics": "الإحصائيات",
    "admin.totalApplications": "إجمالي الطلبات",
    "admin.pendingReview": "قيد المراجعة",
    "admin.approved": "تم الموافقة",
    "admin.rejected": "تم الرفض",
    "admin.viewDetails": "عرض التفاصيل",
    "admin.approve": "موافقة",
    "admin.reject": "رفض",
    "admin.rejectionReason": "سبب الرفض",
    "admin.notes": "ملاحظات المسؤول",

    // Verification
    "verification.title": "التحقق من الهوية",
    "verification.description":
      "يرجى الإجابة على الأسئلة التالية للتحقق من هويتك",
    "verification.success": "تم التحقق بنجاح!",
    "verification.failed": "فشل التحقق. يرجى التحقق من إجاباتك.",

    // Locations
    "location.previous": "الموقع السابق (قبل الحرب)",
    "location.current": "الموقع الحالي",
    "location.selectPrevious": "اختر موقعك السابق (قبل الحرب)",
    "location.selectCurrent": "اختر موقعك الحالي",
  },
};
