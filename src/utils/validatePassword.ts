export const validatePassword = (t: any) => (value: any) => {
  if (!value) return t("common.required"); // empty field
  if (value.length < 8) return t("auth.passwordTooShort");
  if (!/[A-Z]/.test(value)) return t("auth.passwordMissingUpper");
  if (!/[a-z]/.test(value)) return t("auth.passwordMissingLower");
  if (!/\d/.test(value)) return t("auth.passwordMissingNumber");
  if (!/[\W_]/.test(value)) return t("auth.passwordMissingSymbol");
  return true; // passes all checks
};
