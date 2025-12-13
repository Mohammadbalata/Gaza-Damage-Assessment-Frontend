import { useForm } from "react-hook-form";
import { useLanguage } from "../../contexts/LanguageContext";
import { Shield } from "lucide-react";
import { useAuth } from "../../contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Routes";

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

// import React from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   CircularProgress,
//   Container,
//   Avatar,
// } from "@mui/material";
// import { Shield } from "lucide-react";
// import FormTextField from "../../components/Shared/FormTextField";
// import ErrorAlert from "../../components/Shared/ErrorAlert";
// import { loginSchema } from "../../services/validation";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { ROUTES } from "../../routes/Routes";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// export function AdminLoginPage() {
//   const navigate = useNavigate();
//   const { t } = useLanguage();
//   const { login, loading, error } = useAuth();

//   const {
//     control,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = useForm<LoginFormData>({
//     resolver: yupResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     const success = await login(data);
//     if (success) {
//       navigate(ROUTES.ADMIN_DASHBOARD);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           display: "flex",
//           minHeight: "100vh",
//           alignItems: "center",
//           justifyContent: "center",
//           py: 4,
//         }}
//       >
//         <Card sx={{ width: "100%", p: 4 }}>
//           {/* Header */}
//           <Box sx={{ textAlign: "center", mb: 4 }}>
//             <Avatar
//               sx={{
//                 mx: "auto",
//                 mb: 2,
//                 bgcolor: "primary.main",
//                 width: 56,
//                 height: 56,
//               }}
//             >
//               <Shield size={32} />
//             </Avatar>
//             <Typography variant="h4" component="h1" gutterBottom>
//               {t("auth.adminLogin")}
//             </Typography>
//             <Typography color="textSecondary" variant="body2">
//               {t("auth.adminLoginDescription") || "يرجى تسجيل الدخول للمتابعة"}
//             </Typography>
//           </Box>

//           {/* Error Alert */}
//           {error && (
//             <ErrorAlert
//               message={error}
//               severity="error"
//               sx={{ mb: 3 }}
//               onClose={() => {}}
//             />
//           )}

//           {/* Form */}
//           <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//             <Box sx={{ mb: 3 }}>
//               <FormTextField
//                 control={control}
//                 name="email"
//                 label={t("auth.email")}
//                 type="email"
//                 placeholder="admin@example.com"
//                 isLoading={isSubmitting}
//               />
//             </Box>

//             <Box sx={{ mb: 4 }}>
//               <FormTextField
//                 control={control}
//                 name="password"
//                 label={t("auth.password")}
//                 type="password"
//                 isLoading={isSubmitting}
//               />
//             </Box>

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               size="large"
//               disabled={loading || isSubmitting}
//               sx={{ py: 1.5 }}
//             >
//               {loading || isSubmitting ? (
//                 <>
//                   <CircularProgress size={20} sx={{ mr: 1 }} />
//                   {t("common.loading")}
//                 </>
//               ) : (
//                 t("auth.login")
//               )}
//             </Button>
//           </Box>
//         </Card>
//       </Box>
//     </Container>
//   );
// }

// export default AdminLoginPage;
