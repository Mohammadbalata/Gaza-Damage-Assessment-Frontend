import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/Routes";
import { enqueueSnackbar } from "notistack";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../../hooks/redux";
import { Person as PersonIcon } from "@mui/icons-material";
import classNames from "classnames";
export function Header() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const windowPathname = window.location.pathname;

  const authState: any = useAppSelector((state) => state.auth);
  const citizenInfo = authState.citizenInfo;
  const citizenName = citizenInfo
    ? `${citizenInfo?.full_name}`.split(" ")[0]
    : citizenInfo.national_id;

  const avatarUrl = citizenInfo?.avatar_url || null;
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
        <div
          className={classNames(
            " flex items-center justify-between py-[16px] gap-8 h-[90px] ",
            { "xl:last:ml-20 xl:first:pl-12": token },
          )}
        >
          <img
            src="https://res.cloudinary.com/dopcli6un/image/upload/v1774209423/logo-width_vrpocf.png"
            className=" logo w-80 h-20"
            alt="this is logo"
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-8 text-black font-medium">
            {token && windowPathname !== "/" ? (
              <button
                onClick={() => {
                  if (!token) {
                    scrollToSection("hero");
                  } else {
                    navigate(ROUTES.LAYOUT);
                  }
                }}
                className="hover:text-green-600 transition-colors "
              >
                الرئيسية
              </button>
            ) : (
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="hover:text-green-600 transition-colors  "
              >
                لوحة التحكم
              </button>
            )}
            {windowPathname !== "/home" && (
              <>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-green-600 transition-colors  "
                >
                  عن المنصة
                </button>
                <button
                  onClick={() => scrollToSection("departments")}
                  className="hover:text-green-600 transition-colors "
                >
                  أقسام المنصة
                </button>
                <button
                  onClick={() => scrollToSection("partners")}
                  className="hover:text-green-600 transition-colors "
                >
                  الشركاء
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-green-600 transition-colors"
                >
                  اتصل بنا
                </button>
              </>
            )}
            {/* Background Pattern */}
            {/* <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: language === "ar" ? "auto" : -50,
                    left: language === "ar" ? -50 : "auto",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                /> */}
            {/* <Box
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    right: language === "ar" ? -30 : "auto",
                    left: language === "ar" ? "auto" : -30,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                  }}
                /> */}

            {/* Auth Buttons */}

            <div
              className={classNames(
                "flex items-center gap-2  ml-4 w-1/4 xl:w-auto",
                {
                  "flex-col": token,
                },
              )}
            >
              {token && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background: "inherit",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Stack
                      direction="row"
                      spacing={3}
                      alignItems="center"
                      useFlexGap={true}
                    >
                      <Avatar
                        src={avatarUrl || undefined}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "rgba(255,255,255,0.2)",
                          border: "2px solid rgba(255,255,255,0.3)",
                          "& img": {
                            objectFit: "cover",
                          },
                        }}
                      >
                        {/* Fallback when no avatar */}
                        <PersonIcon sx={{ fontSize: 36 }} />
                      </Avatar>
                      <Box sx={{ display: "flex", gap: 1, color: "black" }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {t("citizen.welcome")}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {citizenName}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              )}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="
                flex items-center justify-center gap-5 
                w-[170px] h-8  rounded-xl font-semibold text-sm
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
                    تسجيل دخول المسؤول
                  </button>

                  <button
                    onClick={() => navigate(ROUTES.SIGNIN)}
                    className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-teal-700 to-green-500 hover:opacity-90 transition shadow-md"
                  >
                    تسجيل دخول المواطن
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
            {token && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: "inherit",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background Pattern */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: language === "ar" ? "auto" : -50,
                    left: language === "ar" ? -50 : "auto",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    right: language === "ar" ? -30 : "auto",
                    left: language === "ar" ? "auto" : -30,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={2}
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    useFlexGap={true}
                  >
                    <Avatar
                      src={avatarUrl || undefined}
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "rgba(255,255,255,0.2)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        "& img": {
                          objectFit: "cover",
                        },
                      }}
                    >
                      {/* Fallback when no avatar */}
                      <PersonIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Box sx={{ display: "flex", gap: 1, color: "black" }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {t("citizen.welcome")}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {citizenName}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            )}
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
                  تسجيل دخول المسؤول
                </button>

                <button
                  onClick={() => navigate(ROUTES.SIGNIN)}
                  className="w-full px-6 py-2 rounded-xl text-white bg-gradient-to-r from-teal-700 to-green-500 hover:opacity-90 transition shadow-md"
                >
                  تسجيل دخول المواطن
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
