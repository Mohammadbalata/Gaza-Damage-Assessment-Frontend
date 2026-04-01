import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
} from "@mui/material";

// =====================
// Types
// =====================
export type Status =
  | "UNDER_DISTRICT_SUPERVISOR_REVIEW"
  | "UNDER_GIS_REVIEW"
  | "UNDER_GENERAL_SUPERVISOR_REVIEW"
  | "UNDER_SYSTEM_ADMIN_REVIEW"
  | "APPROVED";

interface StepItem {
  id: number;
  key: Status;
  label: string;
}

// =====================
// Steps Mapping
// =====================
const steps: StepItem[] = [
  {
    id: 1,
    key: "UNDER_DISTRICT_SUPERVISOR_REVIEW",
    label: "تحت مراجعة مشرف المنطقة",
  },
  {
    id: 2,
    key: "UNDER_GIS_REVIEW",
    label: "تحت مراجعة نظم المعلومات الجغرافية",
  },
  {
    id: 3,
    key: "UNDER_GENERAL_SUPERVISOR_REVIEW",
    label: "تحت مراجعة المشرف العام",
  },
  {
    id: 4,
    key: "UNDER_SYSTEM_ADMIN_REVIEW",
    label: "تحت مراجعة مدير النظام",
  },
  { id: 5, key: "APPROVED", label: "تمت الموافقة" },
];


// =====================
// Component
// =====================
export default function StepperRTL({ statusReport }: { statusReport: string }) {
  const [status] = useState<string>(statusReport);
  const theme = useTheme();

  // map status → step index (0-indexed for MUI)
  const activeStep = useMemo(() => {
    const step = steps.find((s) => s.key === status);
    return step ? step.id - 1 : 0;
  }, [status]);



  return (
    <Box
      sx={{
        width: "100%",
        py: 2,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepConnector-line": {
            borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.800",
          },
          "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
            borderColor: "primary.main",
          },
          "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
            borderColor: "primary.main",
          },
        }}
      >
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                  fontWeight: 600,
                  mt: 1,
                  color: "text.secondary",
                  "&.Mui-active": {
                    color: "primary.main",
                  },
                  "&.Mui-completed": {
                    color: "text.primary",
                  },
                },
                "& .MuiStepIcon-root": {
                  fontSize: { xs: 20, sm: 24 },
                  "&.Mui-active": {
                    color: "primary.main",
                  },
                  "&.Mui-completed": {
                    color: "primary.main",
                  },
                },
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Debug Status - only visible in dev if needed */}
      {process.env.NODE_ENV === "development" && (
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 2, color: "text.disabled", opacity: 0.5 }}
        >
          الحالة الحالية: {status}
        </Typography>
      )}
    </Box>
  );
}
