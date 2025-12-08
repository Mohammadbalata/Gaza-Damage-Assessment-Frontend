// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../contexts/LanguageContext";
// import { useAppDispatch, useAppSelector } from "../hooks/redux";
// import { setPersonalInfo } from "../redux/slices/personalSlice";

// interface FormData {
//   fullName: string;
//   motherName: string;
//   dateOfBirth: string;
// }

// const PersonalInfoPage = () => {
//   const navigate = useNavigate();
//   const { t } = useLanguage();
//   const personalInfo = useAppSelector((state) => state.personal);
//   const dispatch = useAppDispatch();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       fullName: personalInfo.fullName || "",
//       motherName: personalInfo.motherName || "",
//       dateOfBirth: personalInfo.dateOfBirth || "",
//     },
//   });

//   const onSubmit = (formData: FormData) => {
//     dispatch(setPersonalInfo(formData));
//     navigate("/family-info");
//   };

//   const validateAge = (date: string) => {
//     const birthDate = new Date(date);
//     const today = new Date();
//     const age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       return age - 1 >= 18;
//     }
//     return age >= 18;
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="card">
//         <h2 className="text-2xl font-bold mb-6">{t("review.identityInfo")}</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <label
//               htmlFor="fullName"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               {t("form.fullName")} <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="fullName"
//               type="text"
//               {...register("fullName", {
//                 required: t("common.required"),
//                 maxLength: { value: 100, message: "Maximum 100 characters" },
//                 pattern: {
//                   value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
//                   message: "Only letters and spaces allowed",
//                 },
//               })}
//               className="input-field"
//             />
//             {errors.fullName && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.fullName.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="motherName"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               {t("form.motherName")} <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="motherName"
//               type="text"
//               {...register("motherName", {
//                 required: t("common.required"),
//                 maxLength: { value: 100, message: "Maximum 100 characters" },
//                 pattern: {
//                   value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
//                   message: "Only letters and spaces allowed",
//                 },
//               })}
//               className="input-field"
//             />
//             {errors.motherName && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.motherName.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="dateOfBirth"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               {t("form.dateOfBirth")} <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="dateOfBirth"
//               type="date"
//               {...register("dateOfBirth", {
//                 required: t("common.required"),
//                 validate: (value) =>
//                   validateAge(value) || "Must be 18 years or older",
//               })}
//               className="input-field"
//             />
//             {errors.dateOfBirth && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.dateOfBirth.message}
//               </p>
//             )}
//           </div>

//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={() => navigate("/national-id")}
//               className="btn-outline flex-1"
//             >
//               {t("common.back")}
//             </button>
//             <button type="submit" className="btn-primary flex-1">
//               {t("common.next")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoPage;
