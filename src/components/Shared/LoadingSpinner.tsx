import { CircularProgress, Box, BoxProps } from "@mui/material";

interface LoadingSpinnerProps extends BoxProps {
  size?: number;
  message?: string;
}

export function LoadingSpinner({
  size = 40,
  message,
  ...rest
}: LoadingSpinnerProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={2}
      {...rest}
    >
      <CircularProgress size={size} />
      {message && <p>{message}</p>}
    </Box>
  );
}

export default LoadingSpinner;
