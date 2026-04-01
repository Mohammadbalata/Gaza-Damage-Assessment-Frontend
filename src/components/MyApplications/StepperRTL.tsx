import { useMemo, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
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

/**
 * Custom Connector for RTL Support
 */
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 12, // (XS: 10, SM: 12 approx)
    // In RTL alternativeLabel:
    // right -50% points to the PREVIOUS step (which is to the right in RTL)
    // left 50% points to the CURRENT step center
    // We adjust by +12px or -12px depending on icon size
    right: "calc(-50% + 12px)",
    left: "calc(50% + 12px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? "#333" : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    transition: "border-color 0.3s ease",
  },
}));



// =====================
// Component
// =====================
export default function StepperRTL({ statusReport }: { statusReport: string }) {
  const [status] = useState<string>(statusReport);

  // map status → step index (0-indexed for MUI)
  const activeStep = useMemo(() => {
    const step = steps.find((s) => s.key === status);
    return step ? step.id - 1 : 0;
  }, [status]);

//   const statusTranslation = (statusReport: string) => {
//   switch (statusReport) {
//     case "UNDER_DISTRICT_SUPERVISOR_REVIEW":
//       return "تحت مراجعة مشرف المنطقة";
//     case "UNDER_GIS_REVIEW":
//       return "تحت مراجعة نظم المعلومات الجغرافية";
//     case "UNDER_GENERAL_SUPERVISOR_REVIEW":
//       return "تحت مراجعة المشرف العام";
//     case "UNDER_SYSTEM_ADMIN_REVIEW":
//       return "تحت مراجعة مدير النظام";
//     case "APPROVED":
//       return "تمت الموافقة";
//     default:
//       return "";
//   } 
// }
  return (
    <Box
      dir="rtl"
      sx={{
        width: "100%",
        py: 2,
        px: { xs: 0.5, sm: 1 },
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                  fontWeight: 600,
                  mt: 1.5,
                  color: "text.secondary",
                  "&.Mui-active": {
                    color: "success.main",
                    fontWeight: 700,
                  },
                  "&.Mui-completed": {
                    color: "text.primary",
                  },
                },
                "& .MuiStepIcon-root": {
                  fontSize: { xs: 20, sm: 24 },
                  zIndex: 1,
                  "&.Mui-active": {
                    color: "success.main",
                    boxShadow: "0 0 0 4px rgba(76, 175, 80, 0.1)",
                    borderRadius: "50%",
                  },
                  "&.Mui-completed": {
                    color: "success.main",
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

        {/* <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 3, color: "#2b1d1d",  }}
        >
          {statusTranslation(statusReport)}
        </Typography> */}

    </Box>
  );
}
