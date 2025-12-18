import { useForm } from "react-hook-form";
import { useLanguage } from "../../contexts/LanguageContext";
import FormInput from "../../components/FormInput";
import { validatePassword } from "../../utils/validatePassword";
import ButtonShared from "../../components/Shared/ButtonShared";

interface ResetPasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const newPassword = watch("newPassword");

  const onSubmit = (data: ResetPasswordForm) => {
    console.log("Reset Password Data:", data);

    /*
      هنا تربطها مع الـ API
      dispatch(changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }))
    */
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">
          إعادة تعيين كلمة المرور
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            id="currentPassword"
            type="password"
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            register={register}
            errors={errors}
            validation={{
              required: "كلمة المرور الحالية مطلوبة",
            }}
            isRequired={true}
            isEye={true}
          />

          {/* كلمة المرور الجديدة */}
          <FormInput
            id="newPassword"
            type="password"
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            register={register}
            errors={errors}
            validation={{
              validate: validatePassword(t),
            }}
            isRequired={true}
            isEye={true}
            isCopyIcon
          />

          {/* تأكيد كلمة المرور */}
          <FormInput
            id="confirmPassword"
            type="password"
            label="تأكيد كلمة المرور الجديدة"
            placeholder="أعد إدخال كلمة المرور الجديدة"
            register={register}
            errors={errors}
            validation={{
              required: "تأكيد كلمة المرور مطلوب",
              validate: (value: string) =>
                value === newPassword || "كلمتا المرور غير متطابقتين",
            }}
            isRequired={true}
            isEye={true}
            isCopyIcon
          />

          <ButtonShared
            type="submit"
            className="btn-primary w-full"
            label="حفظ التغييرات"
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
