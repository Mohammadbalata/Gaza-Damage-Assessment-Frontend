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
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import SingleImageInput from "./ImagesInput/SingleImageInput";
import { useSnackbar } from "notistack";

interface IEducationForm {
  educationLevel: string;
  specialization: string;
  institutionName: string;
  graduationYear: number | "";
  certificateImage: File | null;
  additionalNotes: string;
}

const EducationDataForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<IEducationForm>({
    mode: "onChange",
    defaultValues: {
      educationLevel: "",
      specialization: "",
      institutionName: "",
      graduationYear: "",
      certificateImage: null,
      additionalNotes: "",
    },
  });

  const onSubmit = (data: IEducationForm) => {
    console.log("Submitting Education Data:", data);
    enqueueSnackbar(t("common.savedSuccessfully"), { variant: "success" });
    onSuccess?.();
  };

  const educationLevels = [
    { value: "illiterate", label: language === "ar" ? "أمي / لا يقرأ ولا يكتب" : "Illiterate" },
    { value: "primary", label: language === "ar" ? "ابتدائي" : "Primary" },
    { value: "preparatory", label: language === "ar" ? "إعدادي" : "Preparatory" },
    { value: "secondary", label: language === "ar" ? "ثانوي" : "Secondary" },
    { value: "diploma", label: language === "ar" ? "دبلوم" : "Diploma" },
    { value: "bachelor", label: language === "ar" ? "بكالوريوس" : "Bachelor's" },
    { value: "master", label: language === "ar" ? "ماجستير" : "Master's" },
    { value: "doctorate", label: language === "ar" ? "دكتوراه" : "Doctorate" },
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
          {/* المستوى التعليمي */}
          <Box>
            <TextField
              select
              fullWidth
              label={language === "ar" ? "المستوى التعليمي" : "Educational Level"}
              {...register("educationLevel", { required: t("common.required") })}
              error={!!errors.educationLevel}
              helperText={errors.educationLevel?.message}
            >
              <MenuItem value="" disabled>
                {language === "ar" ? "اختر المستوى التعليمي" : "Select Education Level"}
              </MenuItem>
              {educationLevels.map((lvl) => (
                <MenuItem key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* التخصص */}
          <Box>
            <TextField
              fullWidth
              label={language === "ar" ? "التخصص العلمي" : "Specialization"}
              {...register("specialization")}
              placeholder={language === "ar" ? "مثال: هندسة، طب، تجارة..." : "e.g., Engineering, Medicine..."}
            />
          </Box>

          {/* اسم المؤسسة التعليمية */}
          <Box>
            <TextField
              fullWidth
              label={language === "ar" ? "اسم المؤسسة (المدرسة/الجامعة)" : "Institution Name"}
              {...register("institutionName")}
            />
          </Box>

          {/* سنة التخرج */}
          <Box>
            <TextField
              fullWidth
              type="number"
              label={language === "ar" ? "سنة التخرج (المتوقعة/الفعلية)" : "Graduation Year"}
              {...register("graduationYear")}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {language === "ar" ? "المرفقات والشهادات" : "Attachments & Certificates"}
            </Typography>
          </Box>

          {/* صوره الشهادة */}
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 1" } }}>
            <SingleImageInput
              control={control}
              name="certificateImage"
              label={language === "ar" ? "صورة الشهادة العلمية" : "Certificate Image"}
            />
          </Box>

          {/* ملاحظات إضافية */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
              {...register("additionalNotes")}
              placeholder={language === "ar" ? "أي معلومات إضافية تود ذكرها..." : "Any additional information..."}
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
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
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

export default EducationDataForm;
