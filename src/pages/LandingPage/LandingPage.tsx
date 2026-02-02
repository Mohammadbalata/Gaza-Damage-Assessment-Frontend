import React from "react";
import { Box } from "@mui/material";
import HeroSection from "../../components/landing/HeroSection";
import FeatureCards from "../../components/landing/FeatureCards";
import DamageAssessmentSection from "../../components/landing/DamageAssessmentSection";

const LandingPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HeroSection />
      <FeatureCards />
      <DamageAssessmentSection />
    </Box>
  );
};

export default LandingPage;
