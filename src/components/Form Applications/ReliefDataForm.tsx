import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSnackbar } from "notistack";

interface IReliefForm {
  residencyStatus: string;
  familyCount: number | "";
  hasBreadwinner: string;
  specialNeeds: string[];
  priorityNeeds: string[];
  additionalDetails: string;
}

const ReliefDataForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<IReliefForm>({
    mode: "onChange",
    defaultValues: {
      residencyStatus: "",
      familyCount: "",
      hasBreadwinner: "",
      specialNeeds: [],
      priorityNeeds: [],
      additionalDetails: "",
    },
  });

  const selectedSpecialNeeds = watch("specialNeeds");
  const selectedPriorityNeeds = watch("priorityNeeds");

  const onSubmit = (data: IReliefForm) => {
    console.log("Submitting Relief Data:", data);
    enqueueSnackbar(t("common.savedSuccessfully"), { variant: "success" });
    onSuccess?.();
  };

  const residencyOptions = [
    { value: "owner", label: language === "ar" ? "مالك" : "Owner" },
    { value: "renter", label: language === "ar" ? "مستأجر" : "Renter" },
    { value: "displaced_relatives", label: language === "ar" ? "نازح عند أقارب" : "Displaced (Relatives)" },
    { value: "displaced_tent", label: language === "ar" ? "نازح في خيمة" : "Displaced (Tent)" },
    { value: "displaced_center", label: language === "ar" ? "مركز إيواء" : "Shelter Center" },
  ];

  const specialNeedsOptions = [
    { value: "elderly", label: language === "ar" ? "كبار سن (60+)" : "Elderly (60+)" },
    { value: "infants", label: language === "ar" ? "أطفال رضع" : "Infants" },
    { value: "pregnant", label: language === "ar" ? "نساء حامل/مرضع" : "Pregnant/Lactating" },
    { value: "disabled", label: language === "ar" ? "احتياجات خاصة" : "Special Needs" },
  ];

  const priorityNeedsOptions = [
    { value: "food", label: language === "ar" ? "طرود غذائية" : "Food Parcels" },
    { value: "water", label: language === "ar" ? "مياه صالحة للشرب" : "Clean Water" },
    { value: "hygiene", label: language === "ar" ? "أدوات نظافة" : "Hygiene Kits" },
    { value: "medicine", label: language === "ar" ? "أدوية وعلاجات" : "Medicine" },
    { value: "winter", label: language === "ar" ? "ملابس وأغطية شتوية" : "Winter Clothes/Blankets" },
    { value: "cash", label: language === "ar" ? "مساعدات نقدية" : "Cash Assistance" },
  ];

  const handleCheckboxChange = (name: "specialNeeds" | "priorityNeeds", value: string) => {
    const current = watch(name);
    if (current.includes(value)) {
      setValue(name, current.filter(v => v !== value));
    } else {
      setValue(name, [...current, value]);
    }
  };

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
          {/* حالة السكن */}
          <Box>
            <TextField
              select
              fullWidth
              label={language === "ar" ? "حالة السكن الحالية" : "Current Residency Status"}
              {...register("residencyStatus", { required: t("common.required") })}
              error={!!errors.residencyStatus}
            >
              <MenuItem value="" disabled>
                {language === "ar" ? "اختر حالة السكن" : "Select Residency Status"}
              </MenuItem>
              {residencyOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* عدد أفراد الأسرة */}
          <Box>
            <TextField
              fullWidth
              type="number"
              label={language === "ar" ? "عدد أفراد الأسرة المقيمين" : "Number of Family Members"}
              {...register("familyCount", { required: t("common.required"), min: 1 })}
              error={!!errors.familyCount}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Divider />
          </Box>

          {/* فئات خاصة */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {language === "ar" ? "هل توجد فئات خاصة في الأسرة؟" : "Any special categories in the family?"}
            </Typography>
            <FormGroup row>
              {specialNeedsOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  control={
                    <Checkbox
                      checked={selectedSpecialNeeds.includes(opt.value)}
                      onChange={() => handleCheckboxChange("specialNeeds", opt.value)}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </FormGroup>
          </Box>

          {/* الاحتياجات الأولوية */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {language === "ar" ? "الاحتياجات ذات الأولوية القصوى" : "Top Priority Needs"}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 1,
              }}
            >
              {priorityNeedsOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  control={
                    <Checkbox
                      checked={selectedPriorityNeeds.includes(opt.value)}
                      onChange={() => handleCheckboxChange("priorityNeeds", opt.value)}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </Box>
          </Box>

          {/* ملاحظات إضافية */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={language === "ar" ? "تفاصيل إضافية عن الوضع المعيشي" : "Additional Shelter/Living Details"}
              {...register("additionalDetails")}
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
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
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

export default ReliefDataForm;
