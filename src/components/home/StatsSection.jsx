import { Users, UserCheck, Building, CalendarCheck } from "lucide-react";

export const StatsSection = () => (
  <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        Số liệu ấn tượng từ 77BookingCare
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <Users size={48} className="mx-auto mb-4 text-blue-200" />
          <div className="text-4xl font-bold mb-2">150,000+</div>
          <p className="text-blue-100">Người dùng tin tưởng</p>
        </div>

        <div className="text-center">
          <UserCheck size={48} className="mx-auto mb-4 text-blue-200" />
          <div className="text-4xl font-bold mb-2">2,000+</div>
          <p className="text-blue-100">Bác sĩ chuyên khoa</p>
        </div>

        <div className="text-center">
          <Building size={48} className="mx-auto mb-4 text-blue-200" />
          <div className="text-4xl font-bold mb-2">200+</div>
          <p className="text-blue-100">Cơ sở y tế liên kết</p>
        </div>

        <div className="text-center">
          <CalendarCheck size={48} className="mx-auto mb-4 text-blue-200" />
          <div className="text-4xl font-bold mb-2">500,000+</div>
          <p className="text-blue-100">Lượt đặt lịch</p>
        </div>
      </div>
    </div>
  </section>
);