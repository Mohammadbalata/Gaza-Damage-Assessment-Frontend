import {
  Box,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import { useMemo } from "react";
import { useAppSelector } from "../../hooks/redux";

// =====================
// Custom Connector
// =====================
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 12,
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
interface DamageAssessmentStepperProps {
  activeStep: number; // 0, 1, 2, 3
  step1Completed?: boolean;
  step2Completed?: boolean;
  step3Completed?: boolean;
}

export default function DamageAssessmentStepper({
  activeStep,
  step1Completed = false,
  step2Completed = false,
  step3Completed = false,
}: DamageAssessmentStepperProps) {
  const { currentLocation } = useAppSelector((state) => state.location);
  
  // Step 4 is complete if currentLocation has values or from storage
  const step4Completed = useMemo(() => {
    const hasLocation = currentLocation && (currentLocation.currentLatitude || currentLocation.currentLocationAddress);
    if (hasLocation) return true;
    
    // Fallback to storage
    const citizenInfo = JSON.parse(localStorage.getItem("citizenInfo") || "{}");
    return !!citizenInfo.current_location;
  }, [currentLocation]);

  const steps = [
    { label: "تحديد الموقع من خلال القوائم المرفقة أدناه", completed: step1Completed },
    { label: "تحديد موقع منشأتك المتضررة على الخريطة", completed: step2Completed },
    { label: "تعبئة نموذج الضرر الخاص بمنشأتك المتضررة", completed: step3Completed },
    { label: "تجديد موقعك سكنك الحالي", completed: step4Completed },
  ];

  return (
    <Box
      dir="rtl"
      sx={{
        width: "100%",
        py: 3,
        px: { xs: 1, sm: 2 },
        mb: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {steps.map((step, index) => (
          <Step key={index} completed={step.completed || index < activeStep}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.65rem", sm: "0.8rem" },
                  fontWeight: 600,
                  mt: 1.5,
                  color: "text.secondary",
                  "&.Mui-active": {
                    color: "success.main",
                    fontWeight: 700,
                  },
                  "&.Mui-completed": {
                    color: "success.main",
                  },
                },
                "& .MuiStepIcon-root": {
                  fontSize: { xs: 24, sm: 28 },
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
    </Box>
  );
}
