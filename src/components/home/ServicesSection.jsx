import { Stethoscope, Building2, Microscope, Shield, Smile, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ServicesSection = () => (
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">

    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-12">Dịch vụ y tế</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <Stethoscope size={64} className="text-blue-600" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-3">Khám chuyên khoa</h3>
            <p className="text-gray-600">
              Đặt lịch khám với bác sĩ chuyên khoa uy tín, được nhiều bệnh nhân tin tưởng.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
          <div className="h-48 bg-green-100 flex items-center justify-center">
            <Building2 size={64} className="text-green-600" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-3">Khám tổng quát</h3>
            <p className="text-gray-600">
              Gói khám sức khỏe toàn diện tại các bệnh viện và phòng khám uy tín.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
          <div className="h-48 bg-purple-100 flex items-center justify-center">
            <Microscope size={64} className="text-purple-600" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-3">Xét nghiệm y học</h3>
            <p className="text-gray-600">
              Đặt lịch xét nghiệm nhanh chóng với kết quả chính xác và tin cậy.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
          <div className="h-48 bg-red-100 flex items-center justify-center">
            <Shield size={64} className="text-red-600" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-3">Sức khỏe tinh thần</h3>
            <p className="text-gray-600">
              Dịch vụ tư vấn tâm lý, sức khỏe tinh thần với các chuyên gia hàng đầu.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
          <div className="h-48 bg-yellow-100 flex items-center justify-center">
            <Smile size={64} className="text-yellow-600" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-3">Khám nha khoa</h3>
            <p className="text-gray-600">
              Dịch vụ khám và điều trị răng miệng chất lượng cao với các chuyên gia hàng đầu.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
          <div className="h-48 bg-teal-100 flex items-center justify-center">
            <CalendarCheck size={64} className="text-teal-600" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-3">Gói phẫu thuật</h3>
            <p className="text-gray-600">
              Đặt lịch phẫu thuật với các bác sĩ giàu kinh nghiệm và cơ sở vật chất hiện đại.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);