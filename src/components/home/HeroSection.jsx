import logo1 from "../../../public/image/logo1.jpg";

export const HeroSection = () => (
  <section className="relative h-screen overflow-hidden  mt-16">
    {/* Background image - full screen */}
    <div className="absolute inset-0 z-0">
      <img
        src={logo1}
        alt="Medical background"
        className="w-full h-full object-cover"
      />
      {/* Dark overlay for better text visibility */}
   <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/20 to-white z-10"></div>
    </div>




    {/* Content centered vertically and horizontally */}
    <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
      <div className="max-w-5xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      Nền tảng y tế <span className="text-blue-200">chăm sóc sức khỏe</span> toàn diện
    </h1>
    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
      Đặt lịch khám bệnh, tư vấn sức khỏe trực tuyến với bác sĩ chuyên khoa uy tín
    </p>
      </div>
    </div>
  </section>
);