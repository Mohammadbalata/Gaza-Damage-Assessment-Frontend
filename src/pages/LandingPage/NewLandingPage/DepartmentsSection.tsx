import { motion } from "motion/react";
import { Box, Typography, Paper, IconButton } from "@mui/material";

import {
  Storage as DatabaseIcon,
  Groups as PeopleIcon,
  Warning as EmergencyIcon,
  Handshake as HandshakeIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import DamageAssessmentSection from "../../../components/landing/DamageAssessmentSection";
import { ROUTES } from "../../../routes/Routes";

export function DepartmentsSection() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
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
      route: "/public-services",
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
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(ROUTES.SIGNIN);
    } else {
      navigate(route);
    }
  };
  return (
    <section id="departments" className="py-20 bg-[#d7d8e2]  text-[#1e3a5f]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4"> الوصول السريع للخدمات</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            يضم المركز 5 أقسام متخصصة .. كل قسم مستقل ومتخصص في مجال عمل محدد
          </p>
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
                      transform: language === "ar" ? "rotate(180deg)" : "none",
                    }}
                  />
                </IconButton>
              </Paper>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 4 * 0.1 }}
            className="sm:col-span-2 lg:col-span-4"
          >
            <DamageAssessmentSection />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
