import ChatBot from "@/components/Chatbot";
import Header from "@/components/Header";
import AllServiceSection from "@/components/home/AllServiceSection";
import ClinicSection from "@/components/home/ClinicSection";
import  DoctorSection  from "@/components/home/DoctorSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import HealthHandbookSection from "@/components/home/HealthHandbookSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import  SpecialtySection  from "@/components/home/SpecialtySection";
import { StatsSection } from "@/components/home/StatsSection";


const HomePage = () => (
  <>
    <Header />
    <main className="min-h-screen bg-white">
      <HeroSection />
      <AllServiceSection/>
      <SpecialtySection />
      <ClinicSection/>
      <DoctorSection />
      <HealthHandbookSection />
      <ChatBot/>
      <FeaturesSection />
      <ServicesSection />
      <StatsSection />

      {/* Custom CSS for hiding scrollbars */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  </>
);

export default HomePage;