import React from "react";
import {
  TextField,
  TextFieldProps,
  CircularProgress,
  Box,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name"> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isLoading?: boolean;
  helperText?: string;
  required?: boolean;
}

/**
 * Text input field with React Hook Form integration
 */
export const FormTextField = React.forwardRef<
  HTMLDivElement,
  FormTextFieldProps<any>
>(
  (
    {
      control,
      name,
      label,
      isLoading = false,
      type = "text",
      fullWidth = true,
      variant = "outlined",
      size = "small",
      required = false,
      helperText,
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
            label={label}
            type={type}
            fullWidth={fullWidth}
            variant={variant}
            size={size}
            required={required}
            error={!!error}
            helperText={error?.message || helperText}
            disabled={isLoading || rest.disabled}
            InputProps={{
              endAdornment: isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                  <CircularProgress color="inherit" size={20} />
                </Box>
              ) : null,
              ...rest.InputProps,
            }}
          />
        )}
      />
    );
  }
);

FormTextField.displayName = "FormTextField";

export default FormTextField;
