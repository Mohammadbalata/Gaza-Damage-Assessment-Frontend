import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/redux";
import { Controller, useForm } from "react-hook-form";

import {
  checkPasswordRules,
  validatePassword,
} from "../utils/validatePassword";

import { FormDataCustom } from "./SignInPage";




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

import { useSnackbar } from "notistack";

import LanguageToggle from "../../../shared/ui/LanguageToggle";

import { ROUTES } from "../../../app/router/Routes";
import { signUp } from "../../../app/store/slices/authSlice";
import { API } from "../../../shared/constants/ApiRoutes";
import { axiosClient } from "../../../shared/api/baseUrl";
import SingleImageInput from "../../damage-assessment/components/ImagesInput/SingleImageInput";
import FormInput from "../../../shared/ui/FormInput";
import OtpDialog from "../../../shared/components/dialogs/OtpDialog";
import PhoneNumberInput from "../../../shared/ui/PhoneNumberInput";


const PasswordDisplayPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
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
    getValues,
  } = useForm<FormDataCustom>();

  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isTouchInput, setIsTouchInput] = useState(false);
  const [isGoTOHomePage, setIsGoToHomePage] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const rules = checkPasswordRules(password);
  const { enqueueSnackbar } = useSnackbar();

  const citizenName = JSON.parse(localStorage.getItem("citizenName") || "{}");
  const fullName = [
    citizenName?.first_name,
    citizenName?.father_name,
    citizenName?.grandfather_name,
    citizenName?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

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
    const formData = new FormData();

    formData.append("national_id", id ?? "");
    formData.append("password", data.password);
    // formData.append("first_name", citizenName?.firstName);
    // formData.append("father_name", citizenName?.fatherName);
    // formData.append("grandfather_name", citizenName?.grandfatherName);
    // formData.append("family_name", citizenName?.familyName);
    formData.append("email", data.email);
    formData.append("phone_number", data.phoneNumber);
    formData.append("whatsapp_number", data.whatsappNumber);
    formData.append("family_members_number", data.familyMembersNumber);

    if (data.alternatePhoneNumber) {
      formData.append("alternate_phone_number", data.alternatePhoneNumber);
    }

    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    if (!isGoTOHomePage) {
      setOpenCodeDialog(true);
      // const phoneNumber = getValues("phoneNumber");
      // sendOtp("phoneNumber", phoneNumber || "");
      // console.log("phoneNumber", phoneNumber);
    }
    if (isGoTOHomePage) {
      try {
        const res = await dispatch(
          signUp({
            pathSignUp: API.citizen.auth.completeSignup,
            formData,
          }),
        ).unwrap();
        if (res) {
          console.log("resssss", res);
          enqueueSnackbar(res.data.message, {
            variant: "success",
          });
          navigate(ROUTES.HOME);
          localStorage.setItem("token", res.token);
        }
      } catch (error: any) {
        console.log("error", error);
        if (typeof error === "string") {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }
        if (typeof error === "object") {
          Object.entries(error).forEach(([key, value]: any) => {
            console.log("key", key, value);
            enqueueSnackbar(`${value}`, {
              variant: "error",
            });
          });
        }
      }
    }
  };

  const sendOtp = async (type: string, target: string) => {
    try {
      const res = await axiosClient.post("/verification/send", {
        national_id: id,
        type: type, // email , sms , and later whatsapp
        target: target,
      });
      if (res) {
        console.log("ress", res);
        enqueueSnackbar(res.data.message || "OTP sent successfully", {
          variant: "success",
        });
        setIsSent(true);
      }
    } catch (error: any) {
      console.error("error....", error);
      // setOpenCodeDialog(false);
      if (typeof error.response.data.message === "string") {
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      }
      if (typeof error === "object") {
        Object.entries(error.response.data.errors).forEach(
          ([key, value]: any) => {
            console.log(key);
            enqueueSnackbar(`${value}`, {
              variant: "error",
            });
          },
        );
      }
    }
  };

  const handleVerifyCode = async (
    type: string,
    code: string,
    target: string,
  ) => {
    try {
      const res = await axiosClient.post("/verification/verify", {
        national_id: id,
        type: type, // email , sms , and later whatsapp
        target: target,
        code: code,
      });

      if (res) {
        console.log("responeFromVerify", res);
        enqueueSnackbar(res.data.message, {
          variant: "success",
        });
        setIsGoToHomePage(true);
        setOpenCodeDialog(false);
      }
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(error.response.data.message, {
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
            gridTemplateColumns: { xs: "1fr", sm: "1fr" },
            gap: 2,
          }}
        >
          {/* Name Fields Row 1 */}
          <Box
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#e0e0e0 !important",
              },

              "& .MuiOutlinedInput-input": {
                backgroundColor: "#e0e0e0 !important",
              },
            }}
          >
            <FormInput
              id="fullName"
              label={t("form.fullName")}
              register={register}
              errors={errors}
              fixedLabel
              defaultValue={fullName}
              readOnly
            />
          </Box>
          {/* <Box>
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
          </Box> */}
          {/* <Box>
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
          </Box> */}

          {/* Name Fields Row 2 */}
          {/* <Box>
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
          </Box> */}
          {/* <Box>
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
          </Box> */}

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
                // note={
                //   language === "ar"
                //     ? "يرجى إدخال بريد إلكتروني فعال، سيتم إرسال رمز التحقق إليه"
                //     : "Please enter a valid email address. A verification code will be sent to it."
                // }
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

            {/* <Button
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
            </Button> */}
          </Box>

          <OtpDialog
            open={openCodeDialog}
            onClose={() => setOpenCodeDialog(false)}
            onResend={(type, value) => sendOtp(type, value)}
            onVerify={(type, code, target) =>
              handleVerifyCode(type, code, target)
            }
            phoneNumber={getValues("phoneNumber") || ""}
            email={getValues("email") || ""}
            whatsappNumber={getValues("whatsappNumber") || ""}
            isSent={isSent}
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
              {t("form.phoneNumber")}
              <span style={{ color: "red" }}>
                {" "}
                (
                {language === "ar"
                  ? "يرجى إدخال رقم الهاتف الصحيح، سيتم إرسال رمز التحقق إليه"
                  : "Please enter a valid phoneNumber. A verification code will be sent to it."}
                ){" "}
              </span>
              <span style={{ color: "red" }}>*</span>
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
            {/* <Button
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
            </Button> */}
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
      <LanguageToggle />
    </AuthComp>
  );
};

export default PasswordDisplayPage;