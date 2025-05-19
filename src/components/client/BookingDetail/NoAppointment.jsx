import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, CalendarX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoAppointment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
      <div className=" rounded-xl p-6 sm:p-8 shadow-sm ">
        <div className="flex justify-center mb-4 text-red-500">
          <CalendarX className="h-12 w-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Không tìm thấy lịch khám
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Có thể bạn chưa đặt lịch hoặc lịch đã bị hủy. Vui lòng kiểm tra lại hoặc quay về trang trước.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default NoAppointment;
