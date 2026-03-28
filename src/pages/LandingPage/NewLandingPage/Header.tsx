import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/Routes";
import { enqueueSnackbar } from "notistack";
import { useLanguage } from "../../../contexts/LanguageContext";

export function Header() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenInfo");
    localStorage.removeItem("citizen_user");

    // Navigate to sign in page
    navigate(`/`);

    // Show success notification
    enqueueSnackbar(t("common.logout") + " ✓", { variant: "success" });
  };
  return (
    <header className="fixed top-0 w-full bg-[#ffffff] h-24 shadow-lg z-50 bg-header">
      <div className="mx-auto max-w-[1300px] px-4 lg:px-2 ">
        <div className=" flex items-center justify-between py-[16px] gap-8 h-[90px]">
          <img
            src="https://res.cloudinary.com/dopcli6un/image/upload/v1774209423/logo-width_vrpocf.png"
            className=" logo w-80 h-20"
            alt="this is logo"
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-black font-medium">
            <button
              onClick={() => {
                if (!token) {
                  scrollToSection("hero");
                } else {
                  navigate(ROUTES.LAYOUT);
                }
              }}
              className="hover:text-green-600 transition-colors"
            >
              الرئيسية
            </button>

            {!token && (
              <>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-green-600 transition-colors"
                >
                  عن المنصة
                </button>
                <button
                  onClick={() => scrollToSection("departments")}
                  className="hover:text-green-600 transition-colors"
                >
                  أقسام المنصة
                </button>
                <button
                  onClick={() => scrollToSection("partners")}
                  className="hover:text-green-600 transition-colors"
                >
                  شركاء النجاح
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-green-600 transition-colors"
                >
                  اتصل بنا
                </button>
              </>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 ml-4 w-1/4 xl:w-auto">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="
                flex items-center justify-center gap-2 w-full
                px-4 py-3 rounded-xl font-semibold text-sm
                bg-red-50 text-red-600 border border-red-200
                hover:bg-red-600 hover:text-white
                transition-all duration-200
              "
                >
                  <LogOut size={16} />
                  {t("common.logout")}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
                    className="px-6 py-2 rounded-xl border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                  >
                    تسجيل الدخول
                  </button>

                  <button
                    onClick={() => navigate(ROUTES.SIGNIN)}
                    className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-teal-700 to-green-500 hover:opacity-90 transition shadow-md"
                  >
                    دخول المواطن
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-black hover:bg-white/10 rounded-lg transition"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden bg-[#ffffff] text-black rounded-xl mt-2 py-4 shadow-lg">
            <button
              onClick={() => {
                if (!token) {
                  scrollToSection("hero");
                } else {
                  navigate(ROUTES.LAYOUT);
                }
              }}
              className="block w-full text-right px-6 py-3 hover:text-green-600"
            >
              الرئيسية
            </button>

            {!token && (
              <>
                <button
                  onClick={() => scrollToSection("about")}
                  className="block w-full text-right px-6 py-3 hover:text-green-600"
                >
                  عن المنصة
                </button>

                <button
                  onClick={() => scrollToSection("departments")}
                  className="block w-full text-right px-6 py-3 hover:text-green-600"
                >
                  أقسام المنصة
                </button>

                <button
                  onClick={() => scrollToSection("partners")}
                  className="block w-full text-right px-6 py-3 hover:text-green-600"
                >
                  شركاء النجاح
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="block w-full text-right px-6 py-3 hover:text-green-600"
                >
                  اتصل بنا
                </button>
              </>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="
                flex items-center justify-center gap-2 w-full
                px-4 py-3 rounded-xl font-semibold text-sm
                bg-red-50 text-red-600 border border-red-200
                hover:bg-red-600 hover:text-white
                transition-all duration-200
              "
              >
                <LogOut size={16} />
                {t("common.logout")}
              </button>
            ) : (
              <div className="border-t border-black/20 mt-3 pt-3 space-y-2 px-4">
                <button
                  onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
                  className="w-full px-6 py-2 rounded-xl border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                >
                  تسجيل الدخول
                </button>

                <button
                  onClick={() => navigate(ROUTES.SIGNIN)}
                  className="w-full px-6 py-2 rounded-xl text-white bg-gradient-to-r from-teal-700 to-green-500 hover:opacity-90 transition shadow-md"
                >
                  دخول المواطن
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
