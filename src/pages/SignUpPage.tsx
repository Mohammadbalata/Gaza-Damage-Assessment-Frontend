// import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FormDataCustom } from "./SignInPage";
import FormInput from "../components/FormInput";
import Button from "../components/Shared/Button/Button";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signUp } from "../redux/slices/authSlice";
import AuthComp from "./AuthComp";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { ROUTES } from "../routes/Routes";
import classNames from "classnames";

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
    await dispatch(signUp({ nationalId: data.nationalId, password: "" }))
      .unwrap()
      .then(() => {
        navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${data.nationalId}`);
        console.log('success')
      }).catch((error) => {
        console.log(error)
      })
  };

  return (
    <AuthComp>
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* National ID Field */}
        <FormInput
          id="nationalId"
          type="text"
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

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="btn-outline flex-1"
            label={t("common.cancel")}
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
                t("common.next")
              )
            }
          />
        </div>
        <div className="flex justify-center">
          <span
            className={classNames(
              "text-[#938585]",
              language === "en" ? "mr-2" : "ml-2"
            )}
          >
            {t("common.signIn-qesution")}
          </span>
          <Button
            type="button"
            label={t("common.signIn")}
            className="text-blue-500 underline"
            onClick={() => navigate(`/${ROUTES.SIGNIN}`)}
          />
        </div>
      </form>
    </AuthComp>
  );
};

export default SignUpPage;
