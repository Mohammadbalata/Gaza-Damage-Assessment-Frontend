import { TextField, MenuItem, Box } from "@mui/material";

const countries = [
  { code: "+970", label: "🇵🇸 فلسطين" },
  { code: "+972", label: "🇮🇱 إسرائيل" },
];

export default function PhoneNumberInput({
  id,
  placeholder,
  value = "",
  onChange,
  error = false,
  helperText = "",
}: any) {
  const val = typeof value === "string" ? value : "";

  // تحديد الدولة الحالية حسب الكود
  const selectedCountry =
    countries.find((c) => val.startsWith(c.code)) || countries[0];

  // استخراج الرقم بدون الكود
  const numberWithoutCode = val.replace(selectedCountry.code, "");

  return (
    <Box display="flex" gap={1} width="100%">
      {/* country selector */}
      {id !== "phoneNumber" && (
        <TextField
          select
          value={selectedCountry.code}
          onChange={(e) => {
            const newCode = e.target.value;
            onChange(newCode + numberWithoutCode);
          }}
          sx={{ width: 120 }}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              {country.code}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* phone number input */}
      <TextField
        fullWidth
        value={numberWithoutCode}
        inputProps={{ maxLength: 9 }}
        error={error}              // ← إضافة error
        helperText={helperText}    // ← إضافة helperText
        onChange={(e) => {
          let onlyDigits = e.target.value.replace(/\D/g, "");

          // إذا بدأ بصفر → احذف أول صفر
          if (onlyDigits.startsWith("0")) {
            onlyDigits = onlyDigits.slice(1);
          }

          onChange(selectedCountry.code + onlyDigits);
        }}
        placeholder={placeholder}
      />
    </Box>
  );
}
