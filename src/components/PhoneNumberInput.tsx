import { TextField, MenuItem, Box } from "@mui/material";
import { Countries as countries } from "../constants/Countries";

export default function PhoneNumberInput({
  id,
  placeholder,
  value = "",
  onChange,
  error = false,
  helperText = "",
}: any) {
  const val = typeof value === "string" ? value : "";

  const selectedCountry =
    countries.find((c) => val.startsWith(c.phone)) || countries[0];

  // استخراج الرقم بدون الكود
  const numberWithoutCode = val.replace(selectedCountry.phone, "");

  return (
    <Box display="flex" gap={1} width="100%">
      {/* country selector */}
      {id !== "phoneNumber" && (
        <TextField
          select
          value={selectedCountry.phone}
          onChange={(e) => {
            console.log(e.target.value);
            const newCode = e.target.value;
            onChange(newCode + numberWithoutCode);
          }}
          sx={{
            width: 140,
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
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {countries.map((country) => (
            <MenuItem
              key={country.code + country.label}
              value={country.phone}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                loading="lazy"
                srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                alt=""
              />
              <span style={{ color: "gray" }}>+ {country.phone}</span>
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

          onChange(selectedCountry.phone + onlyDigits);
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
