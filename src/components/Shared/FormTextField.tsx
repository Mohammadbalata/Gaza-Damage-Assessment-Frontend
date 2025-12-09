import { TextField, TextFieldProps, CircularProgress } from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name"> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isLoading?: boolean;
  helperText?: string;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  isLoading = false,
  type = "text",
  fullWidth = true,
  variant = "outlined",
  size = "small",
  ...rest
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          type={type}
          fullWidth={fullWidth}
          variant={variant}
          size={size}
          error={!!error}
          helperText={error?.message || rest.helperText}
          disabled={isLoading || rest.disabled}
          InputProps={{
            endAdornment: isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null,
            ...rest.InputProps,
          }}
        />
      )}
    />
  );
}

export default FormTextField;
