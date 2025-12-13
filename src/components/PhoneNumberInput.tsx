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
          sx={{
            width: 120,
            "& .MuiOutlinedInput-root": {
              height: "48px",
              borderRadius: "0.5rem",
              // الحالة العادية
              "& fieldset": {
                borderColor: "#d1d5db", // gray-300
              },
              // hover
              "&:hover fieldset": {
                borderColor: "#d1d5db",
              },
              // focus
              "&.Mui-focused fieldset": {
                borderColor: "#000", // أسود
                boxShadow: "none",
              },
            },
            // إزالة أي تأثير إضافي
            "& .MuiOutlinedInput-input": {
              outline: "none",
            },
          }}
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
        inputProps={{
          maxLength: 9,
          style: {
            paddingRight: "2.50rem",
            fontSize: "1.03rem",
            height: "2rem",
          },
        }}
        error={error} // ← إضافة error
        helperText={helperText} // ← إضافة helperText
        onChange={(e) => {
          let onlyDigits = e.target.value.replace(/\D/g, "");

          // إذا بدأ بصفر → احذف أول صفر
          if (onlyDigits.startsWith("0")) {
            onlyDigits = onlyDigits.slice(1);
          }

          onChange(selectedCountry.code + onlyDigits);
        }}
        placeholder={placeholder}
        // className="!h-8 text-[1.09rem] !pr-7"
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "48px",
            borderRadius: "0.5rem",
            // الحالة العادية
            "& fieldset": {
              borderColor: "#d1d5db", // gray-300
            },
            // hover
            "&:hover fieldset": {
              borderColor: "#d1d5db",
            },
            // focus
            "&.Mui-focused fieldset": {
              borderColor: "#000", // أسود
              boxShadow: "none",
            },
          },
          // إزالة أي تأثير إضافي
          "& .MuiOutlinedInput-input": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
}
