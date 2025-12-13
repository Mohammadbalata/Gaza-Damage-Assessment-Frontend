import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { CheckCircle } from "lucide-react";
import { generatePassword } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import {
  checkPasswordRules,
  validatePassword,
} from "../utils/validatePassword";

import { FormDataCustom } from "./SignInPage";

import classNames from "classnames";
import { signUp } from "../redux/slices/authSlice";
import { ROUTES } from "../routes/Routes";
import PhoneNumberInput from "../components/PhoneNumberInput";
import ButtonShared from "../components/Shared/ButtonShared";

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
    dispatch(signUp({ nationalId: id, password: "", pathSignUp: "verify-id" }))
      .unwrap()
      .then((res) => {
        console.log(res.data.data.verification_status);
        if (res.data.data.verification_status !== "national_id_verified") {
          navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${id}`);
        }
      })
      .catch(() => {
        navigate(`/${ROUTES.SIGNUP}`);
      });
  }, [navigate]);

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
        })
      )
        .unwrap()
        .then((res) => {
          localStorage.setItem("token", res.token);
          navigate(`${ROUTES.PREVIOUS_LOCATION}`);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate(`/${ROUTES.SIGNUP}`);
    }
  };
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold mb-4">تم التحقق بنجاح!</h2>
        <p className="text-gray-600 mb-8">
          تم التحقق من هويتك بنجاح ، يرجى تعبئة بياناتك الشخصية
        </p>
        <div className=" flex flex-col justify-center items-center ">
          <div className="flex flex-col sm:flex-row justify-between w-4/5 gap-4 sm:gap-10 ">
            <div className="flex-col gap-5 flex">
              <FormInput
                id="firstName"
                label={"الاسم الأول"}
                placeholder={"أدخل الاسم الأول"}
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
                classNameParent="rounded-xl"
                isRequired={true}
                classNameLabel="text-right"
              />
              {/* {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                  )} */}
              <FormInput
                id="fatherName"
                label={"اسم الأب"}
                placeholder={"أدخل اسم الأب"}
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
                classNameLabel="text-right"
              />
              {/* {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
                )} */}
            </div>
            <div className="flex-col gap-5 flex">
              <FormInput
                id="grandfatherName"
                label={"اسم الجد"}
                placeholder={"أدخل اسم الجد"}
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
                classNameLabel="text-right"
              />
              {/* {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )} */}
              <FormInput
                id="familyName"
                label={"اسم العائلة"}
                placeholder={"أدخل اسم العائلة"}
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
                classNameLabel="text-right"
              />
              {/* {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )} */}
            </div>
          </div>
          <div className="w-4/5 mt-5">
            <FormInput
              id="email"
              label={"البريد الإلكتروني"}
              placeholder={"أدخل بريدك الإلكتروني"}
              type="email"
              register={register}
              errors={errors}
              validation={{
                required: t("common.required"),
                maxLength: { value: 100, message: "Maximum 100 characters" },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "البريد الإلكتروني غير صالح", // Invalid email message
                },
              }}
              isRequired={true}
              classNameLabel="text-right"
            />
          </div>
          <div className="w-4/5 mt-5 text-right">
            <div>
              <label
                htmlFor="phoneNumber"
                className={classNames(
                  "block text-sm font-medium text-gray-700 mb-2"
                )}
              >
                رقم الموبايل <span className="text-red-500">*</span>
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue="" // VERY IMPORTANT
                rules={{
                  required: "مطلوب",
                }}
                render={({ field , fieldState}) => (
                  <PhoneNumberInput
                    id="phoneNumber"
                    placeholder={"أدخل رقم الموبايل"}
                    {...field}
                    value={field.value || ""} // prevent undefined
                    onChange={(v: any) => field.onChange(v)}
                    error={!!fieldState.error} // ← تمرير error
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <div className="mt-5">
              <label
                htmlFor="whatsappNumber"
                className={classNames(
                  "block text-sm font-medium text-gray-700 mb-2"
                )}
              >
                رقم تواصل الواتساب <span className="text-red-500">*</span>
              </label>
              <Controller
                name="whatsappNumber"
                control={control}
                defaultValue="" // VERY IMPORTANT
                rules={{
                  required: "مطلوب",
                }}
                render={({ field, fieldState }) => (
                  <PhoneNumberInput
                    id="whatsappNumber"
                    placeholder={"أدخل رقم الواتساب "}
                    {...field}
                    value={field.value || ""} // prevent undefined
                    onChange={(v: any) => field.onChange(v)}
                    error={!!fieldState.error} // ← تمرير error
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mt-14 mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("success.password")}
          </label>

          <div className="flex flex-col items-center justify-center gap-2">
            <FormInput
              id="password"
              type="password"
              label={t("auth.password")}
              classNameParent="w-[95%] sm:w-[85%]"
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
                "justify-start  w-4/5 text-red-500 text-left text-sm",
                isTouchInput ? "flex" : "hidden"
              )}
            >
              <ul className="list-disc text-right">
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
            <ButtonShared
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
