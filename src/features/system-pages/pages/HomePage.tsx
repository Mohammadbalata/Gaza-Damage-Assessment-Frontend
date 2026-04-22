import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { Box, Container, Paper, Typography, IconButton } from "@mui/material";
import {
  Storage as DatabaseIcon,
  Groups as PeopleIcon,
  Warning as EmergencyIcon,
  Handshake as HandshakeIcon,
  ArrowForward,
} from "@mui/icons-material";
import { ROUTES } from "../../../app/router/Routes";
import { motion } from "motion/react";
import { Header } from "../components/LandingPage/Header";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import DamageAssessmentCard from "../components/LandingPage/DamageAssessmentCard";
import { getToken } from "../../../shared/utils/storage";

// import { useAppSelector } from "../hooks/redux";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    const hasSeenHomeTour = localStorage.getItem("hasSeenHomeTour");

    if (!hasSeenHomeTour) {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        popoverClass: "driver-popover-custom",
        nextBtnText: language === "ar" ? "التالي" : "Next",
        prevBtnText: language === "ar" ? "السابق" : "Prev",
        doneBtnText: language === "ar" ? "تم" : "Done",
        allowKeyboardControl: false,
        onNextClick: () => {
          localStorage.setItem("activeTourStep", "2");
          navigate(ROUTES.CITIZEN_DASHBOARD);
          driverObj.destroy();
        },
        steps: [
          {
            element: "#damage-assessment-btn",
            popover: {
              title: t("landing.damageAssessment.title"),
              description: t("landing.damageAssessment.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#damage-assessment-btn",
            popover: {
              title: "Redirecting...",
              description: "Moving to Dashboard",
            },
          },
        ],
      });

      // Start the driver after a short delay to ensure elements are rendered
      const timer = setTimeout(() => {
        driverObj.drive();
        localStorage.setItem("hasSeenHomeTour", "true");

        // Force destroy when the highlighted element is clicked
        const btn = document.querySelector("#damage-assessment-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            driverObj.destroy();
          });
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
        driverObj.destroy();
      };
    }
  }, [t, language]);
  // const authState: any = useAppSelector((state) => state.auth);
  // const citizenInfo = authState.citizenInfo;
  // const citizenName = citizenInfo
  //   ? `${citizenInfo?.full_name}`.split(" ")[0]
  //   : citizenInfo.national_id;

  // const avatarUrl = citizenInfo?.avatar_url || null;

  const cards = [
    {
      id: "central-database",
      titleKey: "landing.cards.database",
      icon: (
        <DatabaseIcon sx={{ fontSize: 50, color: "white ", background: "" }} />
      ),
      bgColor: "#2d5f3f ", // Green
      route: "/central-database",
    },
    {
      id: "public-services",
      titleKey: "landing.cards.services",
      icon: <PeopleIcon sx={{ fontSize: 50, color: "white" }} />,
      bgColor: "#d32f2f", // Red
      route: ROUTES.Service_Center,
    },
    {
      id: "emergency",
      titleKey: "landing.cards.emergency",
      icon: <EmergencyIcon sx={{ fontSize: 50, color: "white" }} />,
      bgColor: "#424242", // Dark Gray
      route: "/emergency-management",
    },
    {
      id: "support",
      titleKey: "landing.cards.support",
      icon: <HandshakeIcon sx={{ fontSize: 50, color: "#333" }} />,
      bgColor: "#e0e0e0", // Light Gray
      textColor: "#333",
      iconColor: "#333",
      route: "/support-network",
    },
  ];

  const handleCardClick = (route: string) => {
    const token = getToken();

    if (!token) {
      navigate(ROUTES.SIGNIN);
    } else {
      navigate(route);
    }
  };

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <section
          id="departments"
          className="pt-20 pb-10  text-[#1e3a5f] scroll-mt-24 overflow-hidden lg:h-[80vh] flex items-center justify-center"
        >
          <div className="container mx-auto px-4 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 4 * 0.1 }}
              className="sm:col-span-2 lg:col-span-4 mt-5"
            >
              <DamageAssessmentCard />
            </motion.div>

            <div className="grid grid-cols-[300px] sm:grid-cols-[250px_250px] md:grid-cols-[300px_300px] justify-center   lg:grid-cols-4  gap-6 lg:gap-y-14  ">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={4}
                    onClick={() => handleCardClick(card.route)}
                    sx={{
                      bgcolor: card.bgColor,
                      color: card.textColor || "white",
                      p: 3,
                      height: 220,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "center",
                      borderRadius: 4,
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {card.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mt: 2, lineHeight: 1.2 }}
                    >
                      {t(card.titleKey)}
                    </Typography>

                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: card.iconColor || "white",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      }}
                    >
                      <ArrowForward
                        sx={{
                          transform:
                            language === "ar" ? "rotate(180deg)" : "none",
                        }}
                      />
                    </IconButton>
                  </Paper>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 4,
            opacity: 0.7,
          }}
        >
          {language === "ar"
            ? `© ${new Date().getFullYear()}  منصة سوا بنعمرها  - جميع الحقوق محفوظة`
            : `© ${new Date().getFullYear()} Sawa Build Gaza System - All Rights Reserved`}
        </Typography>
      </Container>
    </>
  );
};

export default HomePage;
