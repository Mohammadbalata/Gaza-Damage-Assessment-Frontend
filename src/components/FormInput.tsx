// components/FormInput.jsx
import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react"; // or any icon library
import classNames from "classnames";
import { useLanguage } from "../contexts/LanguageContext";
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
  classNameLabel,
}: IFormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const setClassName = () => {
    if (language === "ar") {
      if (isCopyIcon) {
        return "left-8";
      } else {
        return "left-4";
      }
    } else {
      if (isCopyIcon) {
        return "right-8";
      } else {
        return "right-4";
      }
    }
  };
  const handleChangeInput = (e: any) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (isNationalId) {
      let value = e.target.value;

      // استبدال الأرقام العربية بالإنجليزية
      arabicNumbers.forEach((num, idx) => {
        value = value.replaceAll(num, idx.toString());
      });

      // منع أي شيء غير أرقام إنجليزية فقط
      value = value.replace(/[^0-9]/g, "");

      e.target.value = value;
    }
    if (type === "password") {
      if (setPassword !== null) {
        setPassword(e.target.value);
        setIsTouchInput(true);
      }
    }
  };

  return (
    <div className={classNames("relative", classNameParent)}>
      {isRequired && (
        <label
          htmlFor={id}
          className={classNames("block text-sm font-medium text-gray-700 mb-2" , classNameLabel)}
        >
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      <input
        id={id}
        type={inputType}
        {...register(id, validation)}
        placeholder={placeholder}
        className={`input-field pr-10 !rounded-lg `} // padding for the eye icon
        maxLength={maxLength}
        {...{ defaultValue }}
        onChange={handleChangeInput}
        required={isRequired}
      />
      <div
        className={classNames(
          "absolute",
          language === "ar" ? "left-2" : "right-2"
        )}
      >
        {type === "password" && isEye === true && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={classNames(
              "absolute bottom-2 transform -translate-y-1/2 text-gray-500",
              setClassName()
            )}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {isCopyIcon && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy"
            className={classNames(
              "absolute bottom-[0.65rem] transform -translate-y-1/2 text-gray-600 hover:text-primary text-4",
              language == "ar" ? "left-2" : "right-2"
            )}
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>

      {errors[id] && (
        <p className="mt-1 text-sm text-left text-red-600">
          {errors[id].message}
        </p>
      )}
      {copied && (
        <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
      )}
    </div>
  );
}
