export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("ar-PS", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Format date and time to local string (ar-PS)
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString("ar-PS", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Format number with locale
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString("ar-PS");
};

/**
 * Format phone number to +970 format
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `+970${cleaned}`;
  }
  return cleaned;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, length: number = 50): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Format status to Arabic text
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "قيد الانتظار",
    approved: "موافق عليه",
    rejected: "مرفوض",
    verified: "محقق منه",
    closed: "مغلق",
    alive: "حي",
    dead: "متوفى",
    male: "ذكر",
    female: "أنثى",
    submitted: "مُرسلة",
    underReview: "تحت المراجعة",
    destroyed: "مدمرة بالكامل",
    severe: "أضرار شديدة",
    moderate: "أضرار متوسطة",
    minor: "أضرار بسيطة",
    apartment: "شقة",
    house: "منزل",
    commercial: "تجاري",
    land: "أرض",
    before_war: "قبل الحرب",
    after_war: "بعد الحرب",
    temporary: "مؤقت",
    current: "حالي",
  };
  return statusMap[status] || status;
};

/**
 * Get status color for UI
 */
export const getStatusColor = (
  status: string
): "success" | "error" | "warning" | "info" | "default" => {
  const colorMap: Record<
    string,
    "success" | "error" | "warning" | "info" | "default"
  > = {
    approved: "success",
    verified: "success",
    alive: "success",
    rejected: "error",
    dead: "error",
    pending: "warning",
    closed: "info",
    submitted: "info",
    underReview: "warning",
  };
  return colorMap[status] || "default";
};
