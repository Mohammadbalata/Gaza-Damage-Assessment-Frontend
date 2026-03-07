import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  ArrowBack,
} from "@mui/icons-material";
import { axiosClient } from "../api/baseUrl";
import { useNavigate } from "react-router-dom";

interface FormData {
  trackingNumber: string;
}

interface StatusHistory {
  status: string;
  timestamp: string;
}

/**
 * Track Status Page
 * صفحة تتبع حالة الطلب
 */
const TrackStatusPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(`/track/${data.trackingNumber}`);

      if (res) {
        const app = res.data.damage_report;
        console.log(app);
        setApplication({
          trackingNumber: app.report_code,
          status: app.status.toLowerCase(),
          submittedAt: app.created_at,
          lastUpdate: app.updated_at,
          statusHistory: [
            { status: app.status.toLowerCase(), timestamp: app.created_at },
            { status: app.status.toLowerCase(), timestamp: app.updated_at },
          ],
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch application");
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "info";
      case "pending":
        return "default";
      case "underReview":
        return "warning";
      case "verified":
        return "success";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <ClockIcon sx={{ fontSize: 20 }} />;
      case "pending":
        return <ClockIcon sx={{ fontSize: 20 }} />;
      case "underReview":
        return <SearchIcon sx={{ fontSize: 20 }} />;
      case "verified":
        return <VerifiedIcon sx={{ fontSize: 20 }} />;
      case "approved":
        return <CheckIcon sx={{ fontSize: 20 }} />;
      case "rejected":
        return <CancelIcon sx={{ fontSize: 20 }} />;
      default:
        return <ClockIcon sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: language === "ar" ? "auto" : -40,
            left: language === "ar" ? -40 : "auto",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            right: language === "ar" ? -30 : "auto",
            left: language === "ar" ? "auto" : -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
            }}
          >
            <SearchIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, mr: 1 }}>
              {t("auth.trackStatus")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mr: 1 }}>
              {language === "ar"
                ? "أدخل رقم التتبع للاستعلام عن حالة طلبك"
                : "Enter your tracking number to check your application status"}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Search Form */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Tracking Number Input */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {t("success.trackingNumber")} *
              </Typography>
              <TextField
                fullWidth
                placeholder="GAZA-2024-ABC123"
                {...register("trackingNumber", {
                  required: t("common.required"),
                  pattern: {
                    value: /^GAZA-\d{4}-[A-Za-z0-9]{6}$/,
                    message:
                      language === "ar"
                        ? "صيغة رقم التتبع غير صحيحة (GAZA-YYYY-XXXXXX)"
                        : "Invalid tracking number format (GAZA-YYYY-XXXXXX)",
                  },
                })}
                error={!!errors.trackingNumber}
                helperText={errors.trackingNumber?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: "1.1rem",
                    fontFamily: "monospace",
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress sx={{ mx: 1 }} size={20} color="inherit" />
                ) : (
                  <SearchIcon sx={{ mx: 1 }} />
                )
              }
              sx={{
                color: "white",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
                },
              }}
            >
              {loading ? "" : t("auth.trackStatus")}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              color="success"
              size="large"
              onClick={() => {
                navigate("/");
              }}
              startIcon={
                <ArrowBack
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    ml: language === "ar" ? 1 : 0,
                  }}
                />
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              {t("notFound.backToHome")}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Application Status Results */}
      {application && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* Status Header */}
          <Box
            sx={{
              p: 3,
              bgcolor: "grey.50",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              useFlexGap={true}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {language === "ar" ? "حالة الطلب" : "Application Status"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === "ar" ? "رقم التتبع: " : "Tracking Number: "}
                  <Typography
                    component="span"
                    sx={{ fontFamily: "monospace", fontWeight: 700 }}
                  >
                    {application.trackingNumber}
                  </Typography>
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(application.status)}
                label={t(`status.${application.status}`)}
                color={getStatusColor(application.status) as any}
                sx={{ fontWeight: 600, px: 1 }}
              />
            </Stack>
          </Box>

          {/* Last Update Info */}
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack useFlexGap={true} direction="row" spacing={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {language === "ar" ? "تاريخ التقديم" : "Submitted Date"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(application.submittedAt).toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {language === "ar" ? "آخر تحديث" : "Last Updated"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(application.lastUpdate).toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Status Timeline */}
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              {language === "ar" ? "سجل الحالة" : "Status Timeline"}
            </Typography>
            <Stepper
              orientation="vertical"
              activeStep={application.statusHistory?.length - 1}
            >
              {application.statusHistory?.map(
                (history: StatusHistory, index: number) => (
                  <Step key={index} completed>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor:
                              index === application.statusHistory.length - 1
                                ? `${getStatusColor(history.status)}.main`
                                : "grey.300",
                            color: "white",
                            ml: 1,
                          }}
                        >
                          {getStatusIcon(history.status)}
                        </Box>
                      )}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        useFlexGap={true}
                      >
                        <Typography sx={{ fontWeight: 500 }}>
                          {t(`status.${history.status}`)}
                        </Typography>
                        {index === application.statusHistory.length - 1 && (
                          <Chip
                            label={language === "ar" ? "الحالي" : "Current"}
                            size="small"
                            color="success"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        )}
                      </Stack>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(history.timestamp).toLocaleString(
                          language === "ar" ? "ar-EG" : "en-US"
                        )}
                      </Typography>
                    </StepContent>
                  </Step>
                )
              )}
            </Stepper>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default TrackStatusPage;
