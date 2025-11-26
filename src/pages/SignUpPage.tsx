import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FormData } from "./SignInPage";
import FormInput from "../components/FormInput";
import Button from "../components/Shared/Button/Button";
import { useAppDispatch } from "../hooks/redux";
import { signUp } from "../redux/slices/authSlice";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    navigate("/verification-questions");
    dispatch(signUp({ nationalId: data.nationalId }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t("auth.nationalId")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            defaultValue = '123456789'
          />
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="btn-outline flex-1"
              label={t("common.cancel")}
            />
            <Button
              label={t("common.next")}
              type="submit"
              className="btn-primary flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
