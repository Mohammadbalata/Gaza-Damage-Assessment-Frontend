// import { 
//   Wrench, 
//   Hammer, 
//   Drill, 
//   Zap, 
//   Cog, 
// } from 'lucide-react';
import { motion } from 'motion/react';
import { Box, Typography, Paper, IconButton } from "@mui/material";

import {
  Storage as DatabaseIcon,
  Groups as PeopleIcon,
  Warning as EmergencyIcon,
  Handshake as HandshakeIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useLanguage } from '../../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import DamageAssessmentSection from '../../../components/landing/DamageAssessmentSection';

// const departments = [
//   { icon: Wrench, name: 'معدات كهربائية', color: '#f5a623' },
//   { icon: Hammer, name: 'أدوات يدوية', color: '#f5a623' },
//   { icon: Drill, name: 'معدات لحام', color: '#f5a623' },
//   { icon: Zap, name: 'معدات كهرباء', color: '#f5a623' },
//   { icon: Cog, name: 'معدات ميكانيكية', color: '#f5a623' },
// ];

export function DepartmentsSection() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const cards = [
      {
        id: "central-database",
        titleKey: "landing.cards.database",
        icon: <DatabaseIcon sx={{ fontSize: 50, color: "white ", background:'' }} />,
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
          {/* {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer group last:col-span-2 lg:last:col-start-2 lg:last:col-span-2"
              >
                <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-center text-sm font-semibold">{dept.name}</p>
              </motion.div>
            );
          })} */}
          {cards.map((card) => (
          <Box key={card.id}>
            <Paper
              elevation={4}
              onClick={() => navigate(card.route)}
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
          </Box>
        ))}
        <div className="sm:col-span-2 lg:col-span-4">

        <DamageAssessmentSection />
        </div>
        </div>
      </div>
    </section>
  );
}
