import { useAuth } from "../../app/providers/AdminAuthContext";
import { useLanguage } from "../../app/providers/LanguageContext";
import { LogOut } from "lucide-react";
import Logo from "../../public/logo.jpg";

const Header = () => {
  const { t } = useLanguage();
  const { logout, isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" />
          <div>
            <h1 className="text-xl font-bold tracking-wide">
              {t("app.title")}
            </h1>
            <p className="text-sm text-primary-light">{t("app.subtitle")}</p>
          </div>
        </div>
        {(isAuthenticated || token) && (
          <button
            onClick={logout}
            className="flex justify-center items-center bg-white text-primary font-semibold px-5 py-2 rounded-lg shadow hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mx-2" />
            {t("common.logout") || "Logout"}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
