import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { CheckCircle } from "lucide-react";
import { generatePassword } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import {
  checkPasswordRules,
  validatePassword,
} from "../utils/validatePassword";
import { signUp } from "../redux/slices/authSlice";
import Button from "../components/Shared/Button/Button";
import { FormDataCustom } from "./SignInPage";
import { ROUTES } from "../routes/Routes";
import classNames from "classnames";

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
  const [isTouchInput, setIsTouchInput] = useState(false);
  const rules = checkPasswordRules(password);

  // Sync initial generated password to form
  useEffect(() => {
    setValue("password", password);
    console.log("parent", password);
  }, [password, setValue]);
  const onSubmit = (data: FormDataCustom) => {
    dispatch(signUp({ nationalId, password: data.password }));
    navigate(`${ROUTES.PREVIOUS_LOCATION}`);
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

          <div className="flex flex-col items-center justify-center gap-2">
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
              isRequired={false}
              isEye={true}
              isCopyIcon={true}
              {...{ setPassword }}
              {...{ setIsTouchInput }}
            />

            <div
              className={classNames(
                "justify-start w-4/5 text-red-500 text-left text-sm",
                isTouchInput ? "flex" : "hidden"
              )}
            >
              <ul className="list-disc">
                <li
                  className={rules.tooShort ? "text-red-500" : "text-green-700"}
                >
                  {t("auth.passwordTooShort")}
                </li>
                <li
                  className={
                    rules.missingUpper ? "text-red-500" : "text-green-700"
                  }
                >
                  {t("auth.passwordMissingUpper")}
                </li>
                <li
                  className={
                    rules.missingLower ? "text-red-500" : "text-green-700"
                  }
                >
                  {t("auth.passwordMissingLower")}
                </li>
                <li
                  className={
                    rules.missingNumber ? "text-red-500" : "text-green-700"
                  }
                >
                  {t("auth.passwordMissingNumber")}
                </li>
                <li
                  className={
                    rules.missingSymbol ? "text-red-500" : "text-green-700"
                  }
                >
                  {t("auth.passwordMissingSymbol")}
                </li>
              </ul>
            </div>
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
          Continue
        </button>
      </div>
    </div>
  );
};

export default PasswordDisplayPage;
