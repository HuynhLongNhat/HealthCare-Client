

import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllDoctors } from "@/api/doctor.api";

const DoctorSection = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 3;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.DT || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerView, doctors.length - itemsPerView)
    );
  };

  return (
    <section className="py-12 bg-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Bác sĩ </h2>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 font-medium text-lg flex items-center group"
            onClick={() => navigate("/doctors")}
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
          {/* Card Slider */}
           <div className="overflow-hidden px-2">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      startIndex * (100 / itemsPerView)
                    }%)`,
                  }}
                >
                  {doctors.map((doctor) => (
                    <div key={doctor.userData.id} className="w-1/3 flex-shrink-0 px-4 ">
                      <Card
                        className="hover:shadow-2xl transition-shadow overflow-hidden h-full flex flex-col cursor-pointer"
                        onClick={() => navigate(`/doctor/${doctor.userData.id}`)}
                      >
                        <div className="h-48 mt-3 flex items-center justify-center overflow-hidden rounded-xl">
                          {doctor?.userData?.profile_picture ? (
                            <img
                              src={doctor.userData.profile_picture}
                              alt="Avatar"
                              className="w-48 h-48 rounded-full border-2 border-blue-100 object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-48 h-48 rounded-full border-2 border-blue-100 flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-bold shadow-sm">
                              {doctor.userData?.full_name?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6 flex-grow">
                          <div className="text-center space-y-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {doctor.doctor.position}{" "}
                              {doctor?.userData?.full_name}
                            </h3>
                            <p className="text-blue-600 text-sm">
                              {doctor?.doctor?.specialization?.name ||
                                "Chuyên khoa chưa cập nhật"}
                            </p>
                          </div>

                          
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
             
            </div>
          </div>

          {/* Nút Next */}
          <button
            onClick={handleNext}
            disabled={startIndex >= doctors.length - itemsPerView}
            className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              startIndex >= doctors.length - itemsPerView
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

export default DoctorSection;
