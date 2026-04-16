import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSnackbar } from "notistack";

interface IHealthForm {
  bloodType: string;
  hasChronicDisease: boolean;
  chronicDiseaseDetails: string;
  hasDisability: boolean;
  disabilityDetails: string;
  hasHealthInsurance: boolean;
  insuranceProvider: string;
  regularMedicines: string;
}

const HealthDataForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<IHealthForm>({
    mode: "onChange",
    defaultValues: {
      bloodType: "",
      hasChronicDisease: false,
      chronicDiseaseDetails: "",
      hasDisability: false,
      disabilityDetails: "",
      hasHealthInsurance: false,
      insuranceProvider: "",
      regularMedicines: "",
    },
  });

  const hasChronicDisease = watch("hasChronicDisease");
  const hasDisability = watch("hasDisability");
  const hasHealthInsurance = watch("hasHealthInsurance");

  const onSubmit = (data: IHealthForm) => {
    console.log("Submitting Health Data:", data);
    enqueueSnackbar(t("common.savedSuccessfully"), { variant: "success" });
    onSuccess?.();
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <Paper elevation={0} sx={{ p: 0 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* فصيلة الدم */}
          <Box>
            <TextField
              select
              fullWidth
              label={language === "ar" ? "فصيلة الدم" : "Blood Type"}
              {...register("bloodType")}
            >
              <MenuItem value="" disabled>
                {language === "ar" ? "اختر فصيلة الدم" : "Select Blood Type"}
              </MenuItem>
              {bloodTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Divider />
          </Box>

          {/* أمراض مزمنة */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FormControlLabel
                control={
                  <Controller
                    name="hasChronicDisease"
                    control={control}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} />
                    )}
                  />
                }
                label={language === "ar" ? "هل تعاني من أمراض مزمنة؟" : "Do you have chronic diseases?"}
              />
            </Stack>
            {hasChronicDisease && (
              <TextField
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
                label={language === "ar" ? "تفاصيل الأمراض المزمنة" : "Chronic Disease Details"}
                {...register("chronicDiseaseDetails", { required: hasChronicDisease })}
                error={!!errors.chronicDiseaseDetails}
              />
            )}
          </Box>

          {/* إعاقة */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FormControlLabel
                control={
                  <Controller
                    name="hasDisability"
                    control={control}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} />
                    )}
                  />
                }
                label={language === "ar" ? "هل توجد إعاقة؟" : "Any physical disability?"}
              />
            </Stack>
            {hasDisability && (
              <TextField
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
                label={language === "ar" ? "نوع وتفاصيل الإعاقة" : "Disability Type & Details"}
                {...register("disabilityDetails", { required: hasDisability })}
                error={!!errors.disabilityDetails}
              />
            )}
          </Box>

          {/* تأمين صحي */}
          <Box>
            <FormControlLabel
              control={
                <Controller
                  name="hasHealthInsurance"
                  control={control}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} />
                  )}
                />
              }
              label={language === "ar" ? "هل لديك تأمين صحي؟" : "Do you have health insurance?"}
            />
          </Box>

          {hasHealthInsurance && (
            <Box>
              <TextField
                fullWidth
                label={language === "ar" ? "جهة التأمين" : "Insurance Provider"}
                {...register("insuranceProvider", { required: hasHealthInsurance })}
                error={!!errors.insuranceProvider}
              />
            </Box>
          )}

          {/* أدوية منتظمة */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label={language === "ar" ? "أدوية تتناولها بشكل منتظم" : "Regularly taken medicines"}
              {...register("regularMedicines")}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={!isValid}
                sx={{
                  px: 6,
                  borderRadius: 2,
                  bgcolor: "#d32f2f",
                  "&:hover": { bgcolor: "#b71c1c" },
                }}
              >
                {t("common.save")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </form>
      </form>
    </Paper>
  );
};

export default HealthDataForm;
