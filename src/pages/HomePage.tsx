import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Login as LoginIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  ArrowForward,
  HowToReg as SignUpIcon,
} from "@mui/icons-material";
import { Building2 } from "lucide-react";
import { ROUTES } from "../routes/Routes";

/**
 * Home Page - Main entry point
 * الصفحة الرئيسية - نقطة الدخول الرئيسية
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const actionCards = [
    {
      key: "signIn",
      title: t("common.signIn"),
      description:
        language === "ar"
          ? "قم بتسجيل دخولك في موقع حصر الأضرار الذاتي باستخدام رقمك الوطني"
          : "Sign in to the self-damage assessment portal using your National ID",
      icon: <LoginIcon sx={{ fontSize: 32 }} />,
      color: "primary" as const,
      route: ROUTES.SIGNIN,
      buttonText: t("common.signIn"),
    },
    {
      key: "signUp",
      title: t("auth.signUp"),
      description:
        language === "ar"
          ? "قم بتسجيل حساب جديد في موقع حصر الأضرار الذاتي باستخدام رقمك الوطني"
          : "Sign up to the self-damage assessment portal using your National ID",
      icon: <SignUpIcon sx={{ fontSize: 32 }} />,
      color: "primary" as const,
      route: ROUTES.SIGNUP,
      buttonText: t("auth.signUp"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: language === "ar" ? "auto" : -60,
            left: language === "ar" ? -60 : "auto",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            right: language === "ar" ? -40 : "auto",
            left: language === "ar" ? "auto" : -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        <Stack
          spacing={2}
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          {/* Logo */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.15)",
              display: "inline-flex",
              mb: 1,
            }}
          >
            <Building2 size={48} />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {t("app.title")}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            {language === "ar"
              ? "منصة إلكترونية موحدة لتسجيل وتتبع طلبات حصر الأضرار"
              : "A unified electronic platform for registering and tracking damage assessment requests"}
          </Typography>
        </Stack>
      </Paper>

      {/* Action Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        {actionCards.map((card) => (
          <Card
            key={card.key}
            onClick={() => navigate(card.route)}
            sx={{
              cursor: "pointer",
              height: "100%",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid",
              borderColor: "divider",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                transform: "translateY(-4px)",
                "& .card-arrow": {
                  transform:
                    language === "en" ? "translateX(4px)" : "translateX(-4px)",
                },
              },
            }}
          >
            {/* Decorative corner */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: language === "ar" ? "auto" : 0,
                left: language === "ar" ? 0 : "auto",
                width: 100,
                height: 100,
                background:
                  card.color === "primary"
                    ? "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, transparent 100%)"
                    : "linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, transparent 100%)",
                borderRadius: language === "ar" ? "0 0 100% 0" : "0 0 0 100%",
              }}
            />

            <CardContent sx={{ p: 3, position: "relative" }}>
              <Stack spacing={2}>
                {/* Icon */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      card.color === "primary"
                        ? "rgba(25, 118, 210, 0.1)"
                        : "rgba(46, 125, 50, 0.1)",
                    color:
                      card.color === "primary"
                        ? "primary.main"
                        : "success.main",
                    display: "inline-flex",
                    width: "fit-content",
                  }}
                >
                  {card.icon}
                </Box>

                {/* Title */}
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {card.description}
                </Typography>

                {/* Button */}
                <Button
                  variant="contained"
                  color={card.color}
                  size="large"
                  fullWidth
                  endIcon={
                    <ArrowForward
                      className="card-arrow"
                      sx={{
                        color: "white",
                        mr: 1,
                        transition: "transform 0.2s ease",
                        transform:
                          language === "ar" ? "rotate(180deg)" : "none",
                      }}
                    />
                  }
                  sx={{
                    color: "white",
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow:
                      card.color === "primary"
                        ? "0 4px 12px rgba(25, 118, 210, 0.25)"
                        : "0 4px 12px rgba(46, 125, 50, 0.25)",
                    "&:hover": {
                      boxShadow:
                        card.color === "primary"
                          ? "0 6px 16px rgba(25, 118, 210, 0.35)"
                          : "0 6px 16px rgba(46, 125, 50, 0.35)",
                    },
                  }}
                >
                  {card.buttonText}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* Track Application Status */}
      <Card
        onClick={() => navigate("/track-status")}
        sx={{
          mb: 4,
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "success.50",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(51, 185, 58, 0.15)",
            transform: "translateY(-2px)",
            bgcolor: "success.100",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "success.100",
                  color: "success.700",
                  display: "flex",
                }}
              >
                <SearchIcon sx={{ fontSize: 28, color: "#388E3C" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#127a17ff" }}
                >
                  {t("auth.trackStatus")}
                </Typography>
                <Typography variant="body2" color="#559658ff">
                  {language === "ar"
                    ? "تتبع حالة طلبك المقدم باستخدام رقم التتبع الخاص بك"
                    : "Track your submitted application status using your tracking number"}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              color="success"
              endIcon={
                <ArrowForward
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    mr: 1,
                  }}
                />
              }
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  bgcolor: "success.200",
                },
              }}
            >
              {t("auth.trackStatus")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Admin Access Card */}
      <Card
        onClick={() => navigate("/admin/login")}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
            transform: "translateY(-2px)",
            bgcolor: "grey.100",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "grey.200",
                  color: "grey.700",
                  display: "flex",
                }}
              >
                <AdminIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "grey.800", mr: 1 }}
                >
                  {t("auth.adminLogin")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  {language === "ar"
                    ? "الوصول إلى لوحة المعلومات الإدارية للمسؤولين"
                    : "Access the admin dashboard for government officials"}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              color="inherit"
              endIcon={
                <ArrowForward
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    mr: 1,
                  }}
                />
              }
              sx={{
                borderRadius: 2,
                borderColor: "grey.400",
                color: "grey.700",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  borderColor: "grey.600",
                  bgcolor: "grey.200",
                },
              }}
            >
              {t("auth.adminLogin")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

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
          ? `© ${new Date().getFullYear()} بلدية خان يونس - جميع الحقوق محفوظة`
          : `© ${new Date().getFullYear()} Khan Younis Municipality - All Rights Reserved`}
      </Typography>
    </Container>
  );
};

export default HomePage;
