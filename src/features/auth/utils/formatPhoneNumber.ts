
export const normalizePhone:any = (value: any) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length > 12) return digits;
  return digits

};
