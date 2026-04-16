import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useLanguage } from "../../../../app/providers/LanguageContext";
import { useSnackbar } from "notistack";

interface ISocialStatusForm {
  maritalStatus: string;
  numberOfDependents: number;
  employmentStatus: string;
  monthlyIncome: string;
  housingType: string;
  additionalNotes: string;
}

const SocialStatusDataForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ISocialStatusForm>({
    mode: "onChange",
    defaultValues: {
      maritalStatus: "",
      numberOfDependents: 0,
      employmentStatus: "",
      monthlyIncome: "",
      housingType: "",
      additionalNotes: "",
    },
  });

  const onSubmit = (data: ISocialStatusForm) => {
    console.log("Submitting Social Status Data:", data);
    enqueueSnackbar(t("common.savedSuccessfully"), { variant: "success" });
    onSuccess?.();
  };

  const maritalStatuses = [
    { value: "single", label: language === "ar" ? "أعزب/عزباء" : "Single" },
    { value: "married", label: language === "ar" ? "متزوج/ة" : "Married" },
    { value: "divorced", label: language === "ar" ? "مطلق/ة" : "Divorced" },
    { value: "widowed", label: language === "ar" ? "أرمل/ة" : "Widowed" },
  ];

  const employmentStatuses = [
    { value: "employed", label: language === "ar" ? "موظف" : "Employed" },
    {
      value: "unemployed",
      label: language === "ar" ? "عاطل عن العمل" : "Unemployed",
    },
    { value: "student", label: language === "ar" ? "طالب" : "Student" },
    { value: "retired", label: language === "ar" ? "تقاعد" : "Retired" },
    { value: "freelancer", label: language === "ar" ? "عمل حر" : "Freelancer" },
  ];

  const housingTypes = [
    { value: "owned", label: language === "ar" ? "ملك" : "Owned" },
    { value: "rented", label: language === "ar" ? "إيجار" : "Rented" },
    { value: "hosted", label: language === "ar" ? "مستضاف" : "Hosted" },
    {
      value: "shelter",
      label: language === "ar" ? "مركز إيواء" : "Shelter Center",
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 0 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* الحالة الاجتماعية */}
          <Box>
            <TextField
              select
              fullWidth
              label={language === "ar" ? "الحالة الاجتماعية" : "Marital Status"}
              {...register("maritalStatus", { required: t("common.required") })}
              error={!!errors.maritalStatus}
            >
              <MenuItem value="" disabled>
                {language === "ar" ? "اختر الحالة" : "Select Status"}
              </MenuItem>
              {maritalStatuses.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* عدد المعالين */}
          <Box>
            <TextField
              fullWidth
              type="number"
              label={
                language === "ar" ? "عدد المعالين" : "Number of Dependents"
              }
              {...register("numberOfDependents", {
                required: t("common.required"),
                min: 0,
              })}
              error={!!errors.numberOfDependents}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Divider />
          </Box>

          {/* الحالة العملية */}
          <Box>
            <TextField
              select
              fullWidth
              label={language === "ar" ? "الحالة العملية" : "Employment Status"}
              {...register("employmentStatus", {
                required: t("common.required"),
              })}
              error={!!errors.employmentStatus}
            >
              <MenuItem value="" disabled>
                {language === "ar"
                  ? "اختر الحالة العملية"
                  : "Select Employment Status"}
              </MenuItem>
              {employmentStatuses.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* الدخل الشهري التقريبي */}
          <Box>
            <TextField
              fullWidth
              label={
                language === "ar"
                  ? "الدخل الشهري التقريبي ($)"
                  : "Approx. Monthly Income ($)"
              }
              {...register("monthlyIncome")}
            />
          </Box>

          {/* نوع السكن */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              select
              fullWidth
              label={language === "ar" ? "نوع السكن" : "Housing Type"}
              {...register("housingType", { required: t("common.required") })}
              error={!!errors.housingType}
            >
              <MenuItem value="" disabled>
                {language === "ar" ? "اختر نوع السكن" : "Select Housing Type"}
              </MenuItem>
              {housingTypes.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* ملاحظات إضافية */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
              {...register("additionalNotes")}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={!isValid}
                sx={{
                  px: 6,
                  borderRadius: 2,
                  bgcolor: "#f57c00",
                  "&:hover": { bgcolor: "#e65100" },
                }}
              >
                {t("common.save")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default SocialStatusDataForm;
