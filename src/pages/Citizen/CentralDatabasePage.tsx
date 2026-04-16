import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  IconButton,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import {
  School as EducationIcon,
  LocalHospital as HealthIcon,
  VolunteerActivism as ReliefIcon,
  FamilyRestroom as SocialIcon,
  ArrowBack,
  NavigateNext,
  NavigateBefore,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { ROUTES } from "../../routes/Routes";
import LanguageToggle from "../../components/LanguageToggle";
import BackButton from "../../components/Shared/BackButton";
import EducationDataForm from "../../components/Form Applications/EducationDataForm";
import HealthDataForm from "../../components/Form Applications/HealthDataForm";
import ReliefDataForm from "../../components/Form Applications/ReliefDataForm";
import SocialStatusDataForm from "../../components/Form Applications/SocialStatusDataForm";

const CentralDatabasePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: "education",
      title: language === "ar" ? "التعليم" : "Education",
      description: language === "ar" ? "قاعدة بيانات الطلاب، المستويات التعليمية، والاحتياجات الأكاديمية" : "Students database, educational levels, and academic needs",
      icon: <EducationIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      component: <EducationDataForm onSuccess={() => setSelectedModule(null)} />,
    },
    {
      id: "health",
      title: language === "ar" ? "الصحة" : "Health",
      description: language === "ar" ? "المعلومات الطبية، الأمراض المزمنة، والاحتياجات الصحية" : "Medical information, chronic diseases, and health needs",
      icon: <HealthIcon sx={{ fontSize: 40 }} />,
      color: "#d32f2f",
      component: <HealthDataForm onSuccess={() => setSelectedModule(null)} />,
    },
    {
      id: "relief",
      title: language === "ar" ? "الإغاثة" : "Relief",
      description: language === "ar" ? "الاحتياجات الإغاثية، حالة السكن، والمساعدات" : "Relief needs, housing status, and aid",
      icon: <ReliefIcon sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      component: <ReliefDataForm onSuccess={() => setSelectedModule(null)} />,
    },
    {
      id: "social",
      title: language === "ar" ? "الحالة الاجتماعية" : "Social Status",
      description: language === "ar" ? "بيانات الأسرة، الحالة الاجتماعية، والدخل" : "Family data, social status, and income",
      icon: <SocialIcon sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      component: <SocialStatusDataForm onSuccess={() => setSelectedModule(null)} />,
    },
  ];

  const currentModule = modules.find(m => m.id === selectedModule);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header & Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          separator={language === "ar" ? <NavigateBefore fontSize="small" /> : <NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.CITIZEN_DASHBOARD);
            }}
          >
            {t("citizen.dashboard")}
          </Link>
          <Typography color="text.primary">{t("landing.cards.database")}</Typography>
        </Breadcrumbs>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2d5f3f" }}>
            {t("landing.cards.database")}
          </Typography>
          <BackButton to={ROUTES.CITIZEN_DASHBOARD} language={language} />
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {language === "ar" 
            ? "يرجى اختيار القسم لتحديث بياناتك والمساهمة في بناء قاعدة بيانات دقيقة للمدينة" 
            : "Please select a department to update your information and contribute to building an accurate database for the city"}
        </Typography>
      </Box>

      {/* Grid of Modules */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 2fr" },
          gap: 3,
        }}
      >
        {modules.map((module) => (
          <Card
            key={module.id}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
              border: `1px solid ${module.color}22`,
            }}
            onClick={() => setSelectedModule(module.id)}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: `${module.color}11`,
                    color: module.color,
                    display: "flex",
                  }}
                >
                  {module.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: module.color }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </Box>
                <IconButton 
                  sx={{ color: module.color }}
                >
                  <ArrowBack 
                    sx={{ transform: language === "ar" ? "none" : "rotate(180deg)" }} 
                  />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Module Form Dialog */}
      <Dialog 
        open={!!selectedModule} 
        onClose={() => setSelectedModule(null)}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {currentModule?.icon && React.cloneElement(currentModule.icon as React.ReactElement, { sx: { fontSize: 24, color: currentModule.color } })}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {currentModule?.title}
            </Typography>
          </Stack>
          <IconButton onClick={() => setSelectedModule(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {currentModule?.component}
        </DialogContent>
      </Dialog>

      <LanguageToggle />
    </Container>
  );
};

export default CentralDatabasePage;
