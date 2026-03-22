import React from "react";
import { Header } from "./NewLandingPage/Header";
import { HeroSlider } from "./NewLandingPage/HeroSlider";
// import { AboutSection } from "./NewLandingPage/AboutSection";
// import { DepartmentsSection } from "./NewLandingPage/DepartmentsSection";
// import { GallerySection } from "./NewLandingPage/GallerySection";
// import { MapSection } from "./NewLandingPage/MapSection";
// import { WhyUsSection } from "./NewLandingPage/WhyUsSection";
// import { ContactSection } from "./NewLandingPage/ContactSection";
// import { Footer } from "./NewLandingPage/Footer";

const LandingPage: React.FC = () => {
  return (


<div className="min-h-screen font-['Cairo',sans-serif]">
      <Header />
      <main className="pt-[95px] ">
        <HeroSlider />
        {/* <AboutSection />
        <DepartmentsSection />
        <GallerySection />
        <MapSection />
        <WhyUsSection />
        <ContactSection /> */}
      </main>
      {/* <Footer /> */}
    </div>

  );
};

export default LandingPage;
