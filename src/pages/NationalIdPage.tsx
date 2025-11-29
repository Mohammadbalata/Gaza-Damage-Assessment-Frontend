import { useLanguage } from "../contexts/LanguageContext";

const NationalIdPage = ({ title, children }: any) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">
          {title ? t("common.signIn") : t("auth.nationalId")}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default NationalIdPage;
