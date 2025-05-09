import { Apple, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AppDownloadSection = () => (
  <section className="py-16 bg-blue-50">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h2 className="text-3xl font-bold mb-6">Tải ứng dụng 77BookingCare</h2>
          <p className="text-lg text-gray-700 mb-8">
            Đặt lịch khám bệnh nhanh chóng, theo dõi lịch sử khám và nhận
            thông báo từ bác sĩ mọi lúc mọi nơi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="bg-black text-white px-6 py-7 rounded-lg hover:bg-gray-800 transition-colors h-auto border-0"
            >
              <Apple size={24} className="mr-2" />
              <div className="text-left">
                <div className="text-xs">Tải về trên</div>
                <div className="font-semibold">App Store</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="bg-black text-white px-6 py-7 rounded-lg hover:bg-gray-800 transition-colors h-auto border-0"
            >
              <Smartphone size={24} className="mr-2" />
              <div className="text-left">
                <div className="text-xs">Tải về trên</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </Button>
          </div>
        </div>

        <div className="lg:w-1/2 lg:pl-16">
          <div className="relative w-[280px] h-[500px] mx-auto">
            <div className="absolute inset-0 bg-blue-800 rounded-[40px] overflow-hidden"></div>
            <div className="absolute inset-2 bg-white rounded-[36px] overflow-hidden"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);