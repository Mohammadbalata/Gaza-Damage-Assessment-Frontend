import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import { IFormInputProps } from "../interfaces/props/IFormInputProps";

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
}: IFormInputProps) {
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
      helperText={errors[id]?.message || (copied ? "Copied to clipboard!" : "")}
      defaultValue={defaultValue}
      className={classNameParent}
      inputRef={ref}
      name={restRegisterProps.name}
      onBlur={restRegisterProps.onBlur}
      onChange={(e) => {
        // Call our custom handler first
        handleChangeInput(e);
        // Then call react-hook-form's handler
        onChange(e);
      }}
      inputProps={{
        maxLength: maxLength,
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
      }}
    />
  );
}
