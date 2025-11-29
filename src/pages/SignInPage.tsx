import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signIn } from "../redux/slices/authSlice";
import NationalIdPage from "./NationalIdPage";
import { useForm } from "react-hook-form";
import { ROUTES } from "../routes/Routes";
import FormInput from "../components/FormInput";
import classNames from "classnames";
// import { validatePassword } from "../utils/validatePassword";
import Button from "../components/Shared/Button/Button";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export interface FormDataCustom {
  nationalId: number;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataCustom>();
  const { password } = useAppSelector((state) => state.auth);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>();

  const onSubmit = (data: FormDataCustom) => {
    if (password !== data.password) {
      setPasswordErrorMessage("Incorrect username or password.");
    } else {
      dispatch(
        signIn({ nationalId: data.nationalId, password: data.password })
      );
      navigate(`/${ROUTES.SIGNUP}`);
    }
  };
  return (
    <NationalIdPage title="login">
      {passwordErrorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{passwordErrorMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          id="nationalId"
          label={t("auth.nationalId")}
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
        />
        <FormInput
          id="password"
          type="password"
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          register={register}
          validation={{
            required: t("common.required"),
          }}
          errors={errors}
        />
        <div className="flex gap-4">
          <Button
            type="button"
            className="btn-outline flex-1"
            label={t("common.cancel")}
            onClick={() => navigate("/")}
          />
          <Button
            type="submit"
            className="btn-primary flex-1"
            label={t("common.signIn")}
          />
        </div>
        <div className="flex justify-center">
          <span className="text-[#938585]">{t("common.or")}</span>
        </div>
        <div className="flex justify-center">
          <span
            className={classNames(
              "text-[#938585]",
              language === "en" ? "mr-2" : "ml-2"
            )}
          >
            {t("common.signUp-qesution")}
          </span>
          <Button
            type="button"
            label={t("common.signUp")}
            className="text-blue-500 underline"
            onClick={() => navigate(`/${ROUTES.SIGNUP}`)}
          />
        </div>
      </form>
    </NationalIdPage>
  );
};

export default LoginPage;
