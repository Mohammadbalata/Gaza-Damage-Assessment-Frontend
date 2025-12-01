import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setFamilyInfo } from "../redux/slices/familySlice";
interface FormData {
  addressBeforeWar: string;
  numberOfChildren: number;
  wifeName: string;
  wifeNationalId: string;
  phoneNumber: string;
}

const FamilyInfoPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const familyData = useAppSelector((state) => state.family);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      addressBeforeWar: familyData.addressBeforeWar || "",
      numberOfChildren: familyData.numberOfChildren || 0,
      wifeName: familyData.wifeName || "",
      wifeNationalId: familyData.wifeNationalId || "",
      phoneNumber: familyData.phoneNumber || "",
    },
  });

  const onSubmit = (formData: FormData) => {
    dispatch(setFamilyInfo(formData));
    navigate("/damage-assessment");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t("review.familyInfo")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="addressBeforeWar"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.addressBeforeWar")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="addressBeforeWar"
              {...register("addressBeforeWar", {
                required: t("common.required"),
                maxLength: { value: 500, message: "Maximum 500 characters" },
              })}
              className="input-field min-h-[96px] resize-none"
              rows={4}
            />
            {errors.addressBeforeWar && (
              <p className="mt-1 text-sm text-red-600">
                {errors.addressBeforeWar.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="numberOfChildren"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.numberOfChildren")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="numberOfChildren"
              type="number"
              {...register("numberOfChildren", {
                required: t("common.required"),
                min: { value: 0, message: "Must be 0 or greater" },
                max: { value: 20, message: "Maximum 20" },
                valueAsNumber: true,
              })}
              className="input-field"
            />
            {errors.numberOfChildren && (
              <p className="mt-1 text-sm text-red-600">
                {errors.numberOfChildren.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="wifeName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.wifeName")} <span className="text-red-500">*</span>
            </label>
            <input
              id="wifeName"
              type="text"
              {...register("wifeName", {
                required: t("common.required"),
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
              className="input-field"
            />
            {errors.wifeName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.wifeName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="wifeNationalId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.wifeNationalId")} <span className="text-red-500">*</span>
            </label>
            <input
              id="wifeNationalId"
              type="text"
              {...register("wifeNationalId", {
                required: t("common.required"),
                pattern: {
                  value: /^\d{9}$/,
                  message: t("auth.nationalIdError"),
                },
              })}
              className="input-field"
              maxLength={9}
            />
            {errors.wifeNationalId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.wifeNationalId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.phoneNumber")} <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber", {
                required: t("common.required"),
                pattern: {
                  value: /^\+970\d{9}$/,
                  message: "Format: +970XXXXXXXXX",
                },
              })}
              placeholder="+970XXXXXXXXX"
              className="input-field"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/personal-info")}
              className="btn-outline flex-1"
            >
              {t("common.back")}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {t("common.next")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FamilyInfoPage;
