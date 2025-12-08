import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setError, signIn } from "../redux/slices/authSlice";
// import NationalIdPage from "./NationalIdPage";
import { useForm } from "react-hook-form";
import { ROUTES } from "../routes/Routes";
import FormInput from "../components/FormInput";
import classNames from "classnames";
import Button from "../components/Shared/Button/Button";
import { AlertCircle } from "lucide-react";
import AuthComp from "./AuthComp";

export interface FormDataCustom {
  nationalId: string;
  password: string | any;
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
  const { error, loading } = useAppSelector((state) => state.auth);
  const onSubmit = (data: FormDataCustom) => {
    dispatch(signIn({ nationalId: data.nationalId, password: data.password }))
      .unwrap()
      .then((res) => {
        if (res.extraData) {
          navigate(ROUTES.REVIEW);
        } else {
          navigate(ROUTES.DAMAGE_ASSESSMENT_DIALOG);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data.nationalId);
    console.log(data.password);
  };

  return (
    <AuthComp title="Sign in">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          defaultValue={"410031934"}
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
          defaultValue={"123456"}
          id="password"
          type="password"
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          register={register}
          validation={{
            required: t("common.required"),
          }}
          errors={errors}
          setPassword={null}
        />
        <div className="flex gap-4">
          <Button
            type="button"
            className="btn-outline flex-1"
            label={t("common.cancel")}
            onClick={() => {
              dispatch(setError(""));
              navigate("/");
            }}
          />

          <Button
            type="submit"
            className="btn-primary flex-1"
            label={
              loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {t("common.loading")}
                </div>
              ) : (
                t("common.signIn")
              )
            }
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
            onClick={() => {
              dispatch(setError(""));
              navigate(`/${ROUTES.SIGNUP}`);
            }}
          />
        </div>
      </form>
    </AuthComp>
  );
};

export default LoginPage;
