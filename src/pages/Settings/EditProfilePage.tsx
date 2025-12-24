import { useForm } from "react-hook-form";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  TextField,
  Fade,
  MenuItem,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { Person, ArrowBack, Save as SaveIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Routes";
import { useSnackbar } from "notistack";
import { axiosClient } from "../../api/baseUrl";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { string } from "yup";
import { setCitizenInfo } from "../../redux/slices/authSlice";

interface EditProfileForm {
  first_name: string;
  father_name: string;
  grandfather_name: string;
  family_name: string;
  mother_name: string;
  family_members_number: number;
  whatsapp_number: string;
  place_of_birth: string;
  country: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
}

const EditProfilePage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const citizenInfo = useAppSelector((state) => state.auth.citizenInfo);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>({
    defaultValues: {
      first_name: citizenInfo?.first_name,
      father_name: citizenInfo?.father_name,
      grandfather_name: citizenInfo?.grandfather_name,
      family_name: citizenInfo?.family_name,
      mother_name: citizenInfo?.mother_name,
      family_members_number: citizenInfo?.family_members_number,
      whatsapp_number: citizenInfo?.whatsapp_number,
      place_of_birth: citizenInfo?.place_of_birth,
      country: citizenInfo?.country,
      date_of_birth: citizenInfo?.date_of_birth
        ? new Date(citizenInfo.date_of_birth).toISOString().split("T")[0]
        : "",
      gender: citizenInfo?.gender,
      marital_status: citizenInfo?.marital_status,
    },
  });
  const selectedGender = watch("gender");
  const selectedMaritalStatus = watch("marital_status");

  const onSubmit = async (data: EditProfileForm) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const res = await axiosClient.put("/citizen/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res) {
        setIsLoading(false);
        enqueueSnackbar(t("common.savedSuccessfully"), { variant: "success" });
        localStorage.setItem("citizenInfo", JSON.stringify(res.data.data));
        dispatch(
          setCitizenInfo(
            JSON.parse(localStorage.getItem("citizenInfo") || "{}")
          )
        );
      }
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(
        err?.response?.data?.message || t("common.errorOccurred"),
        { variant: "error" }
      );
    }
  };

  return (
    <Fade in timeout={500}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #68aae4 0%, #6971c9 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px -10px rgba(237, 108, 2, 0.4)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: language === "ar" ? "auto" : -50,
              left: language === "ar" ? -50 : "auto",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Box>

            <Box
              sx={{
                textAlign: {
                  xs: "center",
                  md: language === "ar" ? "right" : "left",
                },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {t("citizen.editProfile")}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t("citizen.editProfileDesc")}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Form Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              <TextField
                label={t("form.firstName")}
                fullWidth
                {...register("first_name", {
                  required: t("validation.required"),
                })}
                error={!!errors.first_name}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.first_name && (
                <FormHelperText error>
                  {errors.first_name.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.fatherName")}
                fullWidth
                {...register("father_name", {
                  required: t("validation.required"),
                })}
                error={!!errors.father_name}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.father_name && (
                <FormHelperText error>
                  {errors.father_name.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.grandfatherName")}
                fullWidth
                {...register("grandfather_name", {
                  required: t("validation.required"),
                })}
                error={!!errors.grandfather_name}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.grandfather_name && (
                <FormHelperText error>
                  {errors.grandfather_name.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.familyName")}
                fullWidth
                {...register("family_name", {
                  required: t("validation.required"),
                })}
                error={!!errors.family_name}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.family_name && (
                <FormHelperText error>
                  {errors.family_name.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.motherName")}
                fullWidth
                {...register("mother_name", {
                  required: t("validation.required"),
                })}
                error={!!errors.mother_name}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.mother_name && (
                <FormHelperText error>
                  {errors.mother_name.message}
                </FormHelperText>
              )}

              <TextField
                type="number"
                label={t("form.familyMembersNumber")}
                fullWidth
                {...register("family_members_number", {
                  required: t("validation.required"),
                  min: { value: 1, message: t("validation.minOne") },
                })}
                error={!!errors.family_members_number}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.family_members_number && (
                <FormHelperText error>
                  {errors.family_members_number.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.whatsappNumber")}
                fullWidth
                {...register("whatsapp_number", {
                  required: t("validation.required"),
                })}
                error={!!errors.whatsapp_number}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.whatsapp_number && (
                <FormHelperText error>
                  {errors.whatsapp_number.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.placeOfBirth")}
                fullWidth
                {...register("place_of_birth", {
                  required: t("validation.required"),
                })}
                error={!!errors.place_of_birth}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.place_of_birth && (
                <FormHelperText error>
                  {errors.place_of_birth.message}
                </FormHelperText>
              )}

              <TextField
                label={t("form.country")}
                fullWidth
                {...register("country", {
                  required: t("validation.required"),
                })}
                error={!!errors.country}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.country && (
                <FormHelperText error>{errors.country.message}</FormHelperText>
              )}

              <TextField
                type="date"
                label={t("form.dateOfBirth")}
                fullWidth
                {...register("date_of_birth", {
                  required: t("validation.required"),
                })}
                error={!!errors.date_of_birth}
                InputProps={{ sx: { height: 56 } }}
              />
              {errors.date_of_birth && (
                <FormHelperText error>
                  {errors.date_of_birth.message}
                </FormHelperText>
              )}

              <TextField
                select
                label={t("form.gender")}
                fullWidth
                {...register("gender")}
                InputProps={{
                  sx: {
                    height: 56,
                  },
                }}
                value={selectedGender}
                error={!!errors.gender}
              >
                <MenuItem value="MALE">{t("common.male")}</MenuItem>
                <MenuItem value="FEMALE">{t("common.female")}</MenuItem>
                <MenuItem value="OTHER">{t("common.other")}</MenuItem>
              </TextField>

              {errors.gender && (
                <FormHelperText error>{errors.gender.message}</FormHelperText>
              )}

              <TextField
                select
                label={t("form.maritalStatus")}
                fullWidth
                {...register("marital_status")}
                InputProps={{
                  sx: {
                    height: 56,
                  },
                }}
                value={selectedMaritalStatus}
                error={!!errors.marital_status}
              >
                <MenuItem value="SINGLE">{t("common.single")}</MenuItem>
                <MenuItem value="MARRIED">{t("common.married")}</MenuItem>
                <MenuItem value="DIVORCED">{t("common.divorced")}</MenuItem>
                <MenuItem value="WIDOWED">{t("common.widowed")}</MenuItem>
              </TextField>
              {errors.marital_status && (
                <FormHelperText error>
                  {errors.marital_status.message}
                </FormHelperText>
              )}
              {/* Actions */}
              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={2}
                pt={2}
                useFlexGap={true}
              >
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={
                    language === "ar" ? (
                      <ArrowBack sx={{ mx: 1, transform: "rotate(180deg)" }} />
                    ) : (
                      <ArrowBack sx={{ mx: 1 }} />
                    )
                  }
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  sx={{ py: 1.5 }}
                >
                  {t("common.back")}
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="info" // Matching the dashboard card color
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress
                        sx={{ mx: 1 }}
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <SaveIcon sx={{ mx: 1 }} />
                    )
                  }
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(2, 115, 237, 0.3)",
                  }}
                >
                  {isLoading ? t("common.loading") : t("common.save")}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default EditProfilePage;
