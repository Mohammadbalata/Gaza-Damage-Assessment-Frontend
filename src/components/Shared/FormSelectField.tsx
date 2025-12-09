import { TextField, MenuItem, TextFieldProps } from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface SelectOption {
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
}

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  fullWidth = true,
  variant = "outlined",
  size = "small",
  disabled = false,
  ...rest
}: FormSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          select
          label={label}
          fullWidth={fullWidth}
          variant={variant}
          size={size}
          disabled={disabled}
          error={!!error}
          helperText={error?.message || rest.helperText}
        >
          <MenuItem value="">
            <em>-- ختر واحدة --</em>
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

export default FormSelectField;
