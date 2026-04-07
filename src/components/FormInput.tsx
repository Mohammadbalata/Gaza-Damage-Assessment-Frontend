import { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import { IFormInputProps } from "../interfaces/props/IFormInputProps";
import { useLanguage } from "../contexts/LanguageContext";

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  validation,
  maxLength,
  defaultValue,
  isRequired,
  isEye = true,
  isCopyIcon = false,
  classNameParent,
  setPassword,
  setIsTouchInput,
  isNationalId,
  fixedLabel = false,
  note,
}: IFormInputProps & { fixedLabel?: boolean }) {
  const { language, t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      navigator.clipboard.writeText(inputElement.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChangeInput = (e: any) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (isNationalId) {
      let value = e.target.value;

      // Replace Arabic numbers with English
      arabicNumbers.forEach((num, idx) => {
        value = value.replaceAll(num, idx.toString());
      });

      // Remove non-numeric characters
      value = value.replace(/[^0-9]/g, "");

      e.target.value = value;
    }

    if (type === "password") {
      if (setPassword) {
        setPassword(e.target.value);
      }
      if (setIsTouchInput) {
        setIsTouchInput(true);
      }
    }
  };

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  // Destructure register props to handle onChange composition and ref
  const { ref, onChange, ...restRegisterProps } = register(id, validation);

  // RTL/LTR placeholder alignment
  const isRTL = language === "ar";
  const textAlign = isRTL ? "right" : "left";

  // If using fixed label (label above input), render differently
  if (fixedLabel) {
    return (
      <Box className={classNameParent}>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography
            variant="body2"
            fontWeight="medium"
            gutterBottom
            sx={{
              mb: 0.5,
              textAlign: textAlign,
            }}
          >
            {label}
            {isRequired && (
              <span style={{ color: "red", marginInlineStart: "4px" }}>*</span>
            )}
          </Typography>
          {note && (
            <Typography
              variant="body2"
              fontWeight="medium"
              gutterBottom
              sx={{
                mb: 0.5,
                textAlign: textAlign,
              }}
            >
              {
                <span style={{ color: "red", marginInlineStart: "4px" }}>
                  ({note})
                </span>
              }
            </Typography>
          )}
        </Box>

        <TextField
          id={id}
          placeholder={placeholder}
          type={inputType}
          fullWidth
          variant="outlined"
          error={!!errors[id]}
          helperText={
            errors[id]?.message ||
            (copied ? t("common.copied") || "Copied to clipboard!" : "")
          }
          defaultValue={defaultValue}
          inputRef={ref}
          name={restRegisterProps.name}
          onBlur={restRegisterProps.onBlur}
          onChange={(e) => {
            handleChangeInput(e);
            onChange(e);
          }}
          inputProps={{
            maxLength: maxLength,
            style: {
              textAlign: textAlign,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {type === "password" && isEye && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
                {isCopyIcon && (
                  <IconButton
                    aria-label="copy text"
                    onClick={handleCopy}
                    edge="end"
                    color={copied ? "success" : "default"}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            "& .MuiOutlinedInput-input::placeholder": {
              textAlign: textAlign,
            },
          }}
        />
      </Box>
    );
  }

  // Default floating label behavior
  return (
    <TextField
      id={id}
      label={
        <span>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </span>
      }
      placeholder={placeholder}
      type={inputType}
      fullWidth
      variant="outlined"
      error={!!errors[id]}
      helperText={
        errors[id]?.message ||
        (copied ? t("common.copied") || "Copied to clipboard!" : "")
      }
      defaultValue={defaultValue}
      className={classNameParent}
      inputRef={ref}
      name={restRegisterProps.name}
      onBlur={restRegisterProps.onBlur}
      onChange={(e) => {
        handleChangeInput(e);
        onChange(e);
      }}
      inputProps={{
        maxLength: maxLength,
        style: {
          textAlign: textAlign,
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {type === "password" && isEye && (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )}
            {isCopyIcon && (
              <IconButton
                aria-label="copy text"
                onClick={handleCopy}
                edge="end"
                color={copied ? "success" : "default"}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
        "& .MuiOutlinedInput-input::placeholder": {
          textAlign: textAlign,
        },
      }}
    />
  );
}
