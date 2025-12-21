import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { CheckCircle, Refresh } from "@mui/icons-material";
import { generatePassword } from "../utils/helpers";
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
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";

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
    setValue,
    control,
  } = useForm<FormDataCustom>();

  const [password, setPassword] = useState(generatePassword());
  const [isTouchInput, setIsTouchInput] = useState(false);
  const rules = checkPasswordRules(password);

  useEffect(() => {
    setValue("password", password);
  }, [password, setValue]);

  useEffect(() => {
    dispatch(
      signUp({ nationalId: id ?? "", password: "", pathSignUp: "verify-id" })
    )
      .unwrap()
      .then((res) => {
        console.log(res.data.data.verification_status);
        if (res.data.data.verification_status !== "NATIONAL_ID_VERIFIED") {
          navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${id}`);
        }
      })
      .catch(() => {
        navigate(`/${ROUTES.SIGNUP}`);
      });
  }, [navigate, dispatch, id]);

  const onSubmit = async (data: FormDataCustom) => {
    console.log(data);
    if (id) {
      await dispatch(
        signUp({
          nationalId: id,
          password: data.password,
          pathSignUp: "complete-signup",
          firstName: data.firstName,
          fatherName: data.fatherName,
          grandfatherName: data.grandfatherName,
          familyName: data.familyName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          familyMembersNumber: data.familyMembersNumber,
        })
      )
        .unwrap()
        .then((res) => {
          localStorage.setItem("token", res.token);
          navigate(`${ROUTES.CITIZEN_DASHBOARD}`);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate(`/${ROUTES.SIGNUP}`);
    }
  };

  const handleGeneratePassword = () => {
    const newPass = generatePassword();
    setPassword(newPass);
    setValue("password", newPass, { shouldValidate: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthComp>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            borderRadius: "50%",
            bgcolor: "success.light",
            color: "success.main",
            mb: 2,
            background: "rgba(46, 125, 50, 0.1)",
          }}
        >
          <CheckCircle sx={{ fontSize: 48, color: "success.main" }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("form.success")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("form.successDescription")}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            />
          </Box>

          {/* Email - Spans 2 columns on small screens if desired, or just full width row */}
          <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}>
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
            />
          </Box>
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
            />
          </Box>
          {/* Phone Numbers */}
          <Box my={1}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              {t("form.phoneNumber")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Box>
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
                  label={t("auth.password")}
                  placeholder={t("auth.passwordPlaceholder")}
                  register={register}
                  errors={errors}
                  validation={{ validate: validatePassword(t) }}
                  defaultValue={password}
                  isRequired={false}
                  isEye={true}
                  isCopyIcon={true}
                  {...{ setPassword }}
                  {...{ setIsTouchInput }}
                />
              </Box>

              {isTouchInput && (
                <List dense sx={{ mt: 1 }}>
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
                      <ListItem key={rule.key} disablePadding>
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
                <Button
                  size="small"
                  startIcon={<Refresh sx={{ mx: 1 }} />}
                  onClick={handleGeneratePassword}
                  sx={{ textTransform: "none" }}
                >
                  {t("auth.generatePassword")}
                </Button>
              </Stack>
            </Box>
          </Box>
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
