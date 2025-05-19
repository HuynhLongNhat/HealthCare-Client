import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllHealthHandBook } from "@/api/doctor.api";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const HealthHandbookSection = () => {
  const navigate = useNavigate();
  const [handbooks , setHandbook] = useState([])
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 3;

  useEffect(() => {
   fetchAllHealthHandBook()
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerView, handbooks.length - itemsPerView)
    );
  };
  
  const fetchAllHealthHandBook = async () => {
    const res = await getAllHealthHandBook();
    if (res.EC === 0) {
       setHandbook(res.DT)
    }
  }
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Cẩm nang sức khỏe
            </h2>
          </div>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 font-medium text-lg flex items-center group"
            onClick={() => navigate("/cam-nang-suc-khoe")}
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
            aria-label="Previous articles"
          >
            <ChevronLeft size={28} className="text-gray-700" />
          </button>

          {/* Card Slider */}
          <div className="overflow-hidden px-4">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    startIndex * (100 / itemsPerView)
                  }%)`,
                }}
              >
                {handbooks.map((handbook) => (
                  <div
                    key={handbook.handbook.id}
                    className="w-1/3 flex-shrink-0 px-4 "
                  >
                    <Card
                      className="hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer hover:translate-y-[-5px]"
                      onClick={() =>
                        navigate(`/cam-nang-suc-khoe/${handbook.handbook.slug}`)
                      }
                    >
                      <div className="h-48 w-full overflow-hidden bg-gray-200 rounded-xl">
                        <Avatar className="w-full h-full rounded-none">
                          <AvatarImage
                            src={handbook.handbook.avatar}
                            className="w-full h-full object-cover rounded-none"
                          />
                          <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-300 text-white text-5xl font-semibold rounded-none">
                            {handbook.handbook.title.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <CardContent className="p-6 flex-grow">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                          {handbook.handbook.title}
                        </h3>
                      </CardContent>

                      <CardFooter className="px-6 pb-6 pt-0 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          <span>{handbook.doctor.DT.userData.full_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {moment(handbook.handbook.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nút Next */}
          <button
            onClick={handleNext}
            disabled={startIndex >= handbooks.length - itemsPerView}
            className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              startIndex >= handbooks.length - itemsPerView
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            }`}
            aria-label="Next articles"
          >
            <ChevronRight size={28} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};


export default HealthHandbookSection;