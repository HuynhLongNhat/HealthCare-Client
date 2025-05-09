import { Calendar, UserCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturesSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Tại sao chọn 77BookingCare?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Calendar size={48} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-3">Đặt Lịch Dễ Dàng</h3>
            <p className="text-gray-600">
              Đặt lịch khám chỉ với vài bước đơn giản, mọi lúc mọi nơi
            </p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <UserCheck size={48} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-3">Bác Sĩ Chuyên Khoa</h3>
            <p className="text-gray-600">
              Đội ngũ bác sĩ giàu kinh nghiệm từ các bệnh viện uy tín
            </p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Clock size={48} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-3">Tiết Kiệm Thời Gian</h3>
            <p className="text-gray-600">
              Không phải chờ đợi, chủ động lựa chọn thời gian khám
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);