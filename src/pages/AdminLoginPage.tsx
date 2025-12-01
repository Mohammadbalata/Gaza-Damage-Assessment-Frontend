import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { Shield } from "lucide-react";
import { useAuth } from "../contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/Routes";

interface FormData {
  email: string;
  password: string;
}

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const { loading, error, login } = useAuth();
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const success = await login(data);
    if (success) {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{t("auth.adminLogin")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.email")} <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: t("common.required"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="input-field"
              placeholder="admin@gaza.gov.ps"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.password")} <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: t("common.required"),
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
              className="input-field"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? t("common.loading") : t("auth.login")}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
