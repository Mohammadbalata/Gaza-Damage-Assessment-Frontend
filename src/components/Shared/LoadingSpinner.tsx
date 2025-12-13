import React from "react";
import { CircularProgress, Box, BoxProps, Typography } from "@mui/material";

interface LoadingSpinnerProps extends BoxProps {
  size?: number;
  message?: string;
}

/**
 * Loading spinner component with optional message
 */
export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(({ size = 40, message, ...rest }, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={2}
      {...rest}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
