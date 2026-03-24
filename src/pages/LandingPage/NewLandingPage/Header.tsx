import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/Routes";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-[#ffffff] h-24 shadow-lg z-50 bg-header">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-2 ">
        {/* Main navigation */}
        {/* <div className="flex items-center justify-between h-[80px]">
          {/* Logo 
          <img
            src={logo}
            className="w-36 sm:w-44 lg:w-52 h-auto object-contain"
            alt="logo"
          /> */}
        <div className="flex items-center justify-between py-[16px] gap-8 h-[90px]">
          <img
            src="https://res.cloudinary.com/dopcli6un/image/upload/v1774209423/logo-width_vrpocf.png"
            className=" logo w-80 h-20"
            alt="this is logo"
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-black font-medium">
            <button
              onClick={() => scrollToSection("hero")}
              className="hover:text-green-600 transition-colors"
            >
              الرئيسية
            </button>

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
              خريطة الإعمار
            </button>

            <button
              onClick={() => scrollToSection("gallery")}
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

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 ml-4 w-1/4 xl:w-auto">
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
              onClick={() => scrollToSection("hero")}
              className="block w-full text-right px-6 py-3 hover:text-green-600"
            >
              الرئيسية
            </button>

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
              خريطة الإعمار
            </button>

            <button
              onClick={() => scrollToSection("gallery")}
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
          </nav>
        )}
      </div>
    </header>
  );
}
