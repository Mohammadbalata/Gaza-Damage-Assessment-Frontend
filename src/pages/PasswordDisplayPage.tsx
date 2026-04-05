import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import {
  checkPasswordRules,
  validatePassword,
} from "../utils/validatePassword";

import { FormDataCustom } from "./SignInPage";


import { signUp } from "../redux/slices/authSlice";
import { ROUTES } from "../routes/Routes";
import PhoneNumberInput from "../components/PhoneNumberInput";
import AuthComp from "./AuthComp";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Link,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { API } from "../constants/ApiRoutes";
import SingleImageInput from "../components/Form Applications/ImagesInput/SingleImageInput";
import { useSnackbar } from "notistack";
import OtpDialog from "../components/OtpDialog";
// import { useSnackbar } from "notistack";

const PasswordDisplayPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setError,
    getValues,
  } = useForm<FormDataCustom>();

  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isTouchInput, setIsTouchInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const rules = checkPasswordRules(password);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(
      signUp({
        national_id: id ?? "",
        password: "",
        pathSignUp: `${API.citizen.auth.verifyId}`,
      }),
    )
      .unwrap()
      .then((res) => {
        console.log(res.data.verification_status);
        if (res.data.verification_status !== "NATIONAL_ID_VERIFIED") {
          navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${id}`);
        }
      })
      .catch(() => {
        navigate(`${ROUTES.SIGNIN}`);
      });
  }, [navigate, dispatch, id]);

  const onSubmit = async (data: any) => {
    console.log(data);
    const formData = new FormData();
    formData.append("national_id", id ?? "");
    formData.append("password", data.password);
    formData.append("first_name", data.firstName);
    formData.append("father_name", data.fatherName);
    formData.append("grandfather_name", data.grandfatherName);
    formData.append("family_name", data.familyName);
    formData.append("email", data.email);
    formData.append("phone_number", data.phoneNumber);
    formData.append("alternate_phone_number", data.alternatePhoneNumber);
    formData.append("whatsapp_number", data.whatsappNumber);
    formData.append("family_members_number", data.familyMembersNumber);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    formData.append("pathSignUp", `${API.citizen.auth.completeSignup}`);
    console.log(formData);
    if (id) {
      await dispatch(
        signUp({
          pathSignUp: `${API.citizen.auth.completeSignup}`,
          formData,
        }),
      )
        .unwrap()
        .then((res) => {
          localStorage.setItem("token", res.token);
          navigate(`${ROUTES.HOME}`);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          const errorMessage = error || "";
          if (errorMessage.includes("Email already registered")) {
            setError("email", {
              type: "manual",
              message: t("auth.emailAlreadyRegistered"),
            });
          } else if (errorMessage.includes("Phone number already registered")) {
            setError("phoneNumber", {
              type: "manual",
              message: t("auth.phoneAlreadyRegistered"),
            });
          } else {
            // Default to showing on password field or using existing logic
            setError("password", {
              type: "manual",
              message: errorMessage,
            });
          }
        });
    } else {
      navigate(`${ROUTES.SIGNIN}`);
    }
  };
  const fieldNames: Record<string, string> = {
    firstName: t("form.firstName"),
    fatherName: t("form.fatherName"),
    grandfatherName: t("form.grandfatherName"),
    familyName: t("form.familyName"),
    email: t("form.email"),
    phoneNumber: t("form.phoneNumber"),
    whatsappNumber: t("form.whatsappNumber"),
    familyMembersNumber: t("form.familyMembersNumber"),
    agreeToTerms: t("form.agreeToTermsDescription"),
    password: t("auth.password"),
  };

  const onError = (errors: any) => {
    console.log("errors", errors);

    Object.entries(errors).forEach(([field, error]: any) => {
      const fieldLabel = fieldNames[field] || field;

      enqueueSnackbar(`${fieldLabel} ${error.message}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    });
  };

  const sendOtp = async (value: string) => {
    try {
      const body = value;
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log("body sent to /api/send-otp:", value);
        throw new Error("فشل إرسال الرمز");
      }
      const data = await response.json();
      console.log("رمز جديد أرسل:", data);
      enqueueSnackbar("تم إرسال رمز جديد بنجاح", { variant: "success" });
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || "حدث خطأ أثناء إرسال الرمز", {
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthComp
      title={t("form.personalInfo")}
      subtitle={t("form.personalInfoDesc")}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {/* Optional Avatar Upload Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "grey.50",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="medium"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {t("imageUpload.avatarOptional")}
          </Typography>
          <SingleImageInput control={control} name="avatar" isOptional={true} />
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* Name Fields Row 1 */}
          <Box>
            <FormInput
              id="firstName"
              label={t("form.firstName")}
              placeholder={t("form.firstNamePlaceholder")}
              register={register}
              errors={errors}
              validation={{
                required: t("common.required"),
                maxLength: { value: 100, message: "Maximum 100 characters" },
                pattern: {
                  value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                  message: "Only letters and spaces allowed",
                },
              }}
              isRequired={true}
              fixedLabel={true}
            />
          </Box>
          <Box>
            <FormInput
              id="fatherName"
              label={t("form.fatherName")}
              placeholder={t("form.fatherNamePlaceholder")}
              register={register}
              errors={errors}
              validation={{
                required: t("common.required"),
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                  message: "Only letters and spaces allowed",
                },
              }}
              isRequired={true}
              fixedLabel={true}
            />
          </Box>

          {/* Name Fields Row 2 */}
          <Box>
            <FormInput
              id="grandfatherName"
              label={t("form.grandfatherName")}
              placeholder={t("form.grandfatherNamePlaceholder")}
              register={register}
              errors={errors}
              validation={{
                required: t("common.required"),
                maxLength: { value: 100, message: "Maximum 100 characters" },
                pattern: {
                  value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                  message: "Only letters and spaces allowed",
                },
              }}
              isRequired={true}
              fixedLabel={true}
            />
          </Box>
          <Box>
            <FormInput
              id="familyName"
              label={t("form.familyName")}
              placeholder={t("form.familyNamePlaceholder")}
              register={register}
              errors={errors}
              validation={{
                required: t("common.required"),
                maxLength: { value: 100, message: "Maximum 100 characters" },
                pattern: {
                  value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                  message: "Only letters and spaces allowed",
                },
              }}
              isRequired={true}
              fixedLabel={true}
            />
          </Box>

          {/* Email - Spans 2 columns on small screens if desired, or just full width row */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", sm: "1 / -1" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              alignItems: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Box sx={{ flex: 2, width: "100%" }}>
              <FormInput
                id="email"
                label={t("form.email")}
                placeholder={t("form.emailPlaceholder")}
                type="email"
                register={register}
                errors={errors}
                validation={{
                  required: t("common.required"),
                  maxLength: { value: 100, message: "Maximum 100 characters" },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: t("form.invalidEmail"),
                  },
                }}
                isRequired={true}
                fixedLabel={true}
                sx={{ width: "100%" }}
              />
            </Box>

            <Button
              onClick={() => {
                const emailValue = getValues("email");
                sendOtp(emailValue || "");
                setOpenCodeDialog(true);
                setOtpValue(emailValue || "");
              }}
              variant="text"
              sx={{
                height: 40,
                width: { xs: "100%", sm: "auto" },
                textDecoration: "underline",
              }}
            >
              {t("form.verificationCode")}
            </Button>
          </Box>

          <OtpDialog
            open={openCodeDialog}
            onClose={() => setOpenCodeDialog(false)}
            onResend={(value) => sendOtp(value)}
            otpValue={otpValue}
          />
        </Box>
        <Box>
          <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" }, my: 1 }}>
            <FormInput
              id="familyMembersNumber"
              label={t("form.familyMembersNumber")}
              placeholder={t("form.familyMembersNumberPlaceholder")}
              register={register}
              errors={errors}
              validation={{
                required: t("common.required"),
                maxLength: { value: 100, message: "Maximum 100 characters" },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only numbers allowed",
                },
              }}
              isRequired={true}
              isNationalId={true}
              fixedLabel={true}
            />
          </Box>
          {/* Phone Numbers */}
          <Box my={1}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              {t("form.phoneNumber")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1 / -1", sm: "1 / -1" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              alignItems: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{
                required: t("common.required"),
              }}
              render={({ field, fieldState }) => (
                <PhoneNumberInput
                  id="phoneNumber"
                  placeholder={t("form.phoneNumberPlaceholder")}
                  {...field}
                  value={field.value || ""}
                  onChange={(v: any) => field.onChange(v)}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ width: "100%" }}
                />
              )}
            />
            <Button
              onClick={() => {
                const phoneValue = getValues("phoneNumber");
                sendOtp(phoneValue || ""); // نرسل النوع phone
                setOpenCodeDialog(true);
                setOtpValue(phoneValue || ""); // نستخدم setEmail لإعادة إرسال الكود إلى رقم الهاتف
              }}
              variant="text"
              sx={{
                height: 40,
                width: { xs: "100%", sm: "30%" },
                textDecoration: "underline",
              }}
            >
              {t("form.verificationCode")}
            </Button>
          </Box>

          {/* alternatePhoneNumber   */}
          <Box my={1}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              {t("form.alternatePhoneNumber")}
            </Typography>
          </Box>
          <Controller
            name="alternatePhoneNumber"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <PhoneNumberInput
                id="phoneNumber"
                placeholder={t("form.alternatePhoneNumberPlaceholder")}
                {...field}
                value={field.value || ""}
                onChange={(v: any) => field.onChange(v)}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Box my={1}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              {t("form.whatsappNumber")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Box>
          <Controller
            name="whatsappNumber"
            control={control}
            defaultValue=""
            rules={{
              required: t("common.required"),
            }}
            render={({ field, fieldState }) => (
              <PhoneNumberInput
                id="whatsappNumber"
                placeholder={t("form.whatsappNumberPlaceholder")}
                {...field}
                value={field.value || ""}
                onChange={(v: any) => field.onChange(v)}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Password Section */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Box
              sx={{
                bgcolor: "grey.50",
                p: 3,
                borderRadius: 2,
                mt: 2,
                border: "1px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {t("success.password")}
              </Typography>

              <Box sx={{ position: "relative" }}>
                <FormInput
                  id="password"
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  register={register}
                  errors={errors}
                  validation={{ validate: validatePassword(t) }}
                  isRequired={false}
                  isEye={true}
                  isCopyIcon={true}
                  {...{ setPassword }}
                  {...{ setIsTouchInput }}
                  fixedLabel={true}
                />
              </Box>

              {isTouchInput && (
                <List dense sx={{ mt: 1, textAlign: "right" }}>
                  {[
                    { key: "tooShort", label: t("auth.passwordTooShort") },
                    {
                      key: "missingUpper",
                      label: t("auth.passwordMissingUpper"),
                    },
                    {
                      key: "missingLower",
                      label: t("auth.passwordMissingLower"),
                    },
                    {
                      key: "missingNumber",
                      label: t("auth.passwordMissingNumber"),
                    },
                    {
                      key: "missingSymbol",
                      label: t("auth.passwordMissingSymbol"),
                    },
                  ].map((rule) => {
                    const isMet = !rules[rule.key as keyof typeof rules];
                    return (
                      <ListItem
                        key={rule.key}
                        disablePadding
                        className="text-right"
                      >
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {isMet ? (
                            <Check fontSize="small" color="success" />
                          ) : (
                            <Close fontSize="small" color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={rule.label}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: isMet ? "success.main" : "error.main",
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="caption" color="error">
                  {t("success.savePassword")}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Controller
            name="agreeToTerms"
            control={control}
            defaultValue={false}
            rules={{ required: t("common.required") }}
            render={({ field, fieldState }) => (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("form.agreeToTerms")}{" "}
                      <Link
                        href="#"
                        underline="always"
                        sx={{ fontWeight: "medium", color: "primary.main" }}
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle privacy policy click if needed
                        }}
                      >
                        {t("form.termsAndPrivacy")}
                      </Link>
                    </Typography>
                  }
                />
                {fieldState.error && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 4, py: 1.5, fontWeight: "bold" }}
        >
          {t("common.continue")}
        </Button>
      </form>
    </AuthComp>
  );
};

export default PasswordDisplayPage;
