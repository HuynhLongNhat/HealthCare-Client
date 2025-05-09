import { Search, Calendar, Phone, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HeroSection = () => (
  <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 z-0"></div>
    
    {/* Wave pattern overlay */}
    <div className="absolute inset-0 opacity-10 z-0">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,0 L100,0 L100,5 C60,20 40,20 0,5 L0,0 Z" fill="#ffffff"></path>
        <path d="M0,20 L100,20 L100,25 C60,40 40,40 0,25 L0,20 Z" fill="#ffffff"></path>
        <path d="M0,40 L100,40 L100,45 C60,60 40,60 0,45 L0,40 Z" fill="#ffffff"></path>
        <path d="M0,60 L100,60 L100,65 C60,80 40,80 0,65 L0,60 Z" fill="#ffffff"></path>
        <path d="M0,80 L100,80 L100,85 C60,100 40,100 0,85 L0,80 Z" fill="#ffffff"></path>
      </svg>
    </div>

    {/* Floating icons */}
    <div className="absolute top-1/4 left-10 animate-float-slow hidden lg:block z-0">
      <Heart className="text-white/20" size={48} />
    </div>
    <div className="absolute bottom-1/4 right-10 animate-float hidden lg:block z-0">
      <Calendar className="text-white/20" size={64} />
    </div>
    <div className="absolute top-3/4 left-1/4 animate-float-reverse hidden lg:block z-0">
      <Phone className="text-white/20" size={32} />
    </div>
    <div className="absolute top-1/3 right-1/4 animate-float-slow hidden lg:block z-0">
      <Users className="text-white/20" size={40} />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Nền tảng y tế <span className="text-blue-300">chăm sóc sức khỏe</span> toàn diện
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
          Đặt lịch khám bệnh, tư vấn sức khỏe trực tuyến với bác sĩ chuyên khoa uy tín
        </p>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white flex flex-col items-center transition-transform hover:transform hover:scale-105">
            <Calendar size={28} className="mb-2" />
            <p className="font-medium">Đặt lịch khám</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white flex flex-col items-center transition-transform hover:transform hover:scale-105">
            <Users size={28} className="mb-2" />
            <p className="font-medium">Bác sĩ chuyên khoa</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white flex flex-col items-center transition-transform hover:transform hover:scale-105">
            <Phone size={28} className="mb-2" />
            <p className="font-medium">Tư vấn từ xa</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white flex flex-col items-center transition-transform hover:transform hover:scale-105">
            <Heart size={28} className="mb-2" />
            <p className="font-medium">Gói khám sức khỏe</p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom wave */}
    <div className="absolute bottom-0 left-0 right-0 z-10">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-auto">
        <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  </section>
);