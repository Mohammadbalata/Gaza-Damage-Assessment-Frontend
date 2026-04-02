import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosClient } from "../../../api/baseUrl";
import { ROUTES } from "../../../routes/Routes";
import { setTrackingNumber } from "../../../redux/slices/authSlice";
import { useAppDispatch } from "../../../hooks/redux";
import { useLanguage } from "../../../contexts/LanguageContext";
import { CheckCircle, Home, Users } from "lucide-react";
import classNames from "classnames";

const slides = [
  {
    id: 3,
    title: "خبرة وموثوقية",
    subtitle: "نخدمكم منذ أكثر من 10 سنوات في قلب جدة الصناعية",
    image:
      "https://res.cloudinary.com/dopcli6un/image/upload/v1774704209/WhatsApp_Image_2026-03-28_at_16.17.11_hmudmu.jpg",
  },
];

export function HeroSlider() {
  const [currentSlide] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { language } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosClient.get(`/track/${data.trackingNumber}`);

      if (res) {
        const app = res.data.damage_report;
        dispatch(setTrackingNumber(app.report_code));
        localStorage.setItem("trackingNumber", app.report_code);
        console.log(app);
        navigate(`${ROUTES.TRACK_STATUS}?track=${app.report_code}`); // Navigate to the tracking status page with the tracking number as a query parameter
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(
          language === "ar"
            ? "رقم التتبع غير موجود. يرجى التحقق من الرقم والمحاولة مرة أخرى."
            : "Tracking number not found. Please check the number and try again.",
        );
      } else if (err.response?.status === 400) {
        setError(
          language === "ar"
            ? "صيغة رقم التتبع غير صحيحة"
            : "Invalid tracking number format",
        );
      } else if (
        err.code === "ECONNABORTED" ||
        err.message === "Network Error"
      ) {
        setError(
          language === "ar"
            ? "خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت."
            : "Connection error. Please check your internet connection.",
        );
      } else {
        setError(
          language === "ar"
            ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً."
            : "An unexpected error occurred. Please try again later.",
        );
      }

      console.error(
        "Tracking error:",
        err.response?.data?.message || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[600px] md:h-[700px] overflow-hidden scroll-mt-24"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 xl:bg-origin-content background-hero bg-center w-full"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <motion.div
            initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
             className={classNames(" absolute flex items-center w-full justify-around  mt-8 z-10 flex-wrap gap-3 ",{
              'hidden': token
            })}>
                  <button
                    onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
                    className="px-6 py-2 rounded-xl border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition hidden sm:flex"
                  >
                    تسجيل دخول المسؤول
                  </button>

                  <button
                    onClick={() => navigate(ROUTES.SIGNIN)}
                    className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-teal-700 to-green-500 hover:opacity-90 transition shadow-md"
                  >
                    تسجيل دخول المواطن
                  </button>
                </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
          </div>

          <div className="absolute w-full bottom-[5%] flex flex-col items-center px-4">
            {/* رسالة الخطأ */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 w-full max-w-2xl"
                >
                  <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">{error}</span>
                      <button
                        onClick={() => setError("")}
                        className="mr-auto text-red-700 hover:text-red-900"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-2xl mx-auto "
            >
              <div className="flex flex-col gap-2 mx-5">
                <div className="flex items-center bg-white rounded-full shadow-xl overflow-hidden border border-gray-200">
                  {/* Search Icon */}
                  <div className="px-4 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Input */}
                  <input
                    {...register("trackingNumber", {
                      required:
                        language === "ar"
                          ? "رقم التتبع او الخدمة مطلوب"
                          : "Tracking number is required",
                      pattern: {
                        value: /^GAZA-\d{4}-[A-Za-z0-9]{6}$/,
                        message:
                          language === "ar"
                            ? "صيغة رقم التتبع غير صحيحة (GAZA-YYYY-XXXXXX)"
                            : "Invalid tracking number format (GAZA-YYYY-XXXXXX)",
                      },
                    })}
                    type="text"
                    placeholder={
                      language === "ar"
                        ? "ابحث عن رقم خدمة أو رقم معاملة ..."
                        : "Enter tracking number..."
                    }
                    className={`w-1 flex-1  md:py-4 py-2 text-gray-700 outline-none text-right placeholder-gray-400 ${
                      errors.trackingNumber ? "border-red-500" : ""
                    } `}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-700 hover:bg-green-800 text-white p-4   font-medium transition-colors disabled:bg-green-400 disabled:cursor-not-allowed min-w-[50px] md:min-w-[100px] flex items-center justify-center"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : language === "ar" ? (
                      "ابحث"
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>

                {/* رسالة خطأ التحقق */}
                {errors.trackingNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mr-4 bg-white/90 px-3 py-1 rounded-full inline-block w-fit"
                  >
                    {errors.trackingNumber.message as string}
                  </motion.p>
                )}
              </div>
              
              <div
                id="system-details"
                className="flex flex-nowrap items-center md:justify-center gap-4 mt-6 mx-6 bg-gray-200 rounded-xl overflow-x-auto whitespace-nowrap thin-scrollbar justify-center "
              >
                <div className="flex-shrink-0 flex items-center gap-3 py-3 px-5">
                  <Home className="w-5 h-5 " />

                  <span className="text-sm font-bold text-gray-700">
                    0 منزل مرمم
                  </span>
                </div>

                <div className="flex-shrink-0 w-[2px] h-6 bg-gray-400 " />

                <div className="flex-shrink-0 flex items-center gap-3 py-3 px-5">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-bold text-gray-700">
                    0 مستفيد
                  </span>
                </div>

                <div className="flex-shrink-0 w-[2px] h-6 bg-gray-400 " />

                <div className="flex-shrink-0 flex items-center gap-3 py-3 px-5">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-gray-700">
                    0% نسبة الرضا
                  </span>
                </div>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-[#f5a623] w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div> */}
    </section>
  );
}
