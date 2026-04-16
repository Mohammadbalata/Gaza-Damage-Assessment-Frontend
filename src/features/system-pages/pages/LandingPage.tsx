import React from "react";
import { Header } from "../components/LandingPage/Header";
import { HeroSlider } from "../components/LandingPage/HeroSlider";
import { DepartmentsSection } from "../components/LandingPage/DepartmentsSection";
import { AboutSection } from "../components/LandingPage/AboutSection";
import { PartnersSection } from "../components/LandingPage/PartnersSection";
import { ContactSection } from "../components/LandingPage/ContactSection";
import { Footer } from "../components/LandingPage/Footer";


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen font-['Cairo',sans-serif]">
      <Header/>
      <main className="pt-[95px] ">
        <HeroSlider/>
        <DepartmentsSection />
        <AboutSection />
        <PartnersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
