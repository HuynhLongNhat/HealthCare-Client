import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllClinics } from "@/api/doctor.api";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const ClinicSection = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 3; // Hiển thị 3 card mỗi lần

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const res = await getAllClinics();
      if (res && res.EC === 0) {
        setClinics(res.DT);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerView, clinics.length - itemsPerView)
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 ml-5">Cơ sở y tế</h2>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 font-medium text-lg flex items-center group"
            onClick={() => navigate("/clinics")}
          >
            Xem tất cả 
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="relative">
          {/* Nút Previous */}
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              startIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            }`}
          >
            <ChevronLeft size={28} className="text-gray-700" />
          </button>

          {/* Danh sách card */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${startIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {clinics.map((clinic) => (
                <div key={clinic.id} className="w-1/3 flex-shrink-0 px-4">
                  <Card
                    className="hover:shadow-2xl transition-shadow overflow-hidden h-full flex flex-col cursor-pointer"
                    onClick={() => navigate(`/clinics/${clinic.id}`)}
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden rounded-xl">
                      {clinic.avatar ? (
                        <img
                          src={clinic.avatar}
                          alt={clinic.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xl"></span>
                      )}
                    </div>

                    <CardContent className="p-6 flex-grow">
                      <h3 className="font-semibold text-lg mb-2">{clinic.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={18} className="mr-2" />
                        <span>{clinic.address.split(",")[3]}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Nút Next */}
          <button
            onClick={handleNext}
            disabled={startIndex >= clinics.length - itemsPerView}
            className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              startIndex >= clinics.length - itemsPerView
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            }`}
          >
            <ChevronRight size={28} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClinicSection;