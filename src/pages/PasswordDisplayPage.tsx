import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { CheckCircle } from "lucide-react";
import { generatePassword } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import { validatePassword } from "../utils/validatePassword";
import { signUp } from "../redux/slices/authSlice";
import Button from "../components/Shared/Button/Button";
import { FormDataCustom } from "./SignInPage";

const PasswordDisplayPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { nationalId } = useAppSelector((state) => state.auth);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormDataCustom>();

  const [password, setPassword] = useState(generatePassword());

  // Sync initial generated password to form
  useEffect(() => {
    setValue("password", password);
    console.log('parent',password)

  }, [password, setValue]);

  const onSubmit = (data: FormDataCustom) => {
    dispatch(signUp({ nationalId, password: data.password }));
    navigate("/damage-assessment-dialog");
  };

  const handleGeneratePassword = () => {
    const newPass = generatePassword();
    setPassword(newPass);
    setValue("password", newPass, { shouldValidate: true });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Verification Successful!</h2>
        <p className="text-gray-600 mb-8">
          Your identity has been verified. Please save your password securely.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("success.password")}
          </label>

          <div className="flex items-center justify-center gap-2">
            <FormInput
              id="password"
              type="password"
              label={t("auth.password")}
              classNameParent="w-4/5"
              placeholder={t("auth.passwordPlaceholder")}
              register={register}
              errors={errors}
              validation={{ validate: validatePassword(t) }}
              defaultValue={password}
              isrequierd={false}
              isEye={true}
              isCopyIcon={true}
              {...{setPassword}}
              isShowPassword={true}
            />
          </div>

          <p className="text-sm text-red-600 mt-4 mb-7">
            {t("success.savePassword")}
          </p>

          <div className="flex justify-end">
            <Button
              className="underline !text-blue-700 flex-4 text-md"
              label={t("auth.generatePassword")}
              onClick={handleGeneratePassword}
            />
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="btn-primary w-full"
        >
          Continue to Damage Assessment
        </button>
      </div>
    </div>
  );
};

export default PasswordDisplayPage;
