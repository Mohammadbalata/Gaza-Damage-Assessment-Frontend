import { useLanguage } from "../contexts/LanguageContext";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-50"
      aria-label="Toggle language"
    >
      <Languages className="w-6 h-6" />
      <span className="sr-only">
        {language === "en" ? "العربية" : "English"}
      </span>
    </button>
  );
};

export default LanguageToggle;
