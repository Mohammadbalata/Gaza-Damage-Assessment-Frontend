import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FormDataCustom } from "./SignInPage";
import FormInput from "../components/FormInput";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setError, signUp } from "../redux/slices/authSlice";
import AuthComp from "./AuthComp";
import { useForm } from "react-hook-form";
import { ROUTES } from "../routes/Routes";
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();

  const { error, loading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataCustom>();

  const onSubmit = async (data: FormDataCustom) => {
    await dispatch(
      signUp({
        nationalId: data.nationalId,
        password: "",
        pathSignUp: "verify-id",
      })
    )
      .unwrap()
      .then(() => {
        navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${data.nationalId}`);
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AuthComp>
      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          {error}
        </Alert>
      )}
      {/* Instructions */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "primary.light",
          border: "1px solid",
          borderColor: "primary.main",
          mb: 4,
        }}
      >
        <Typography variant="body2" color="white">
          {language === "ar"
            ? "أدخل رقمك الوطني للتحقق من هويتك والبدء في عملية التسجيل"
            : "Enter your National ID to verify your identity and start the registration process"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* National ID Field */}
          <Box>
            <Typography
              variant="body2"
              color="primary.light"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              {t("auth.nationalId")}
            </Typography>
            <FormInput
              id="nationalId"
              type="text"
              placeholder={t("auth.nationalIdPlaceholder")}
              register={register}
              errors={errors}
              maxLength={9}
              validation={{
                required: t("common.required"),
                pattern: {
                  value: /^\d{9}$/,
                  message: t("auth.nationalIdError"),
                },
              }}
              isNationalId={true}
            />
          </Box>

          {/* Action Buttons */}
          <Stack
            direction="column"
            spacing={2}
            sx={{ mt: 1 }}
            useFlexGap={true}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress sx={{ mx: 1 }} size={20} color="inherit" />
                ) : (
                  <ArrowForward
                    sx={{
                      transform: language === "ar" ? "rotate(180deg)" : "none",
                      mr: language === "ar" ? 1 : 0,
                    }}
                  />
                )
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              {loading ? "" : t("common.next")}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate("/")}
              startIcon={
                <ArrowBack
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    ml: language === "ar" ? 1 : 0,
                  }}
                />
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              {t("notFound.backToHome")}
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t("common.or")}
            </Typography>
          </Divider>

          {/* Sign In Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              sx={{
                mr: language === "en" ? 1 : 0,
                ml: language === "ar" ? 1 : 0,
              }}
            >
              {t("common.signIn-qesution")}
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                dispatch(setError(""));
                navigate(`/${ROUTES.SIGNIN}`);
              }}
              sx={{
                fontWeight: 600,
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              {t("common.signIn")}
            </Button>
          </Box>
        </Stack>
      </form>
    </AuthComp>
  );
};

export default SignUpPage;
