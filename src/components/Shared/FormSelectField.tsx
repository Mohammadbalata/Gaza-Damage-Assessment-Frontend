import React from "react";
import { TextField, MenuItem, TextFieldProps } from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name" | "select"> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
}

/**
 * Select field with React Hook Form integration
 */
export const FormSelectField = React.forwardRef<
  HTMLDivElement,
  FormSelectFieldProps<any>
>(
  (
    {
      control,
      name,
      label,
      options,
      fullWidth = true,
      variant = "outlined",
      size = "small",
      disabled = false,
      required = false,
      ...rest
    },
    ref
  ) => {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <TextField
            ref={ref}
            {...field}
            {...rest}
            select
            label={label}
            fullWidth={fullWidth}
            variant={variant}
            size={size}
            required={required}
            disabled={disabled}
            error={!!error}
            helperText={error?.message || rest.helperText}
          >
            <MenuItem value="">
              <em>-- اختر واحدة --</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    );
  }
);

FormSelectField.displayName = "FormSelectField";

export default FormSelectField;
