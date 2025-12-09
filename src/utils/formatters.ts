export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ar-PS', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * تنسيق الوقت والتاريخ
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('ar-PS', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * تنسيق الأرقام
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ar-PS');
};

/**
 * تنسيق الهاتف
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+970${cleaned}`;
  }
  return cleaned;
};

/**
 * تقصير النص
 */
export const truncateText = (text: string, length: number = 50): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * تنسيق الحالة
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'قيد الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    verified: 'محقق منه',
    closed: 'مغلق',
    alive: 'حي',
    dead: 'متوفى',
    male: 'ذكر',
    female: 'أنثى',
  };
  return statusMap[status] || status;
};
