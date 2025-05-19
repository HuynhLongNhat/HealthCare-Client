import { Users, UserCheck, Building, CalendarCheck } from "lucide-react";

export const StatsSection = () => (
  <section className="py-16 bg-gradient-to-b from-white to-blue-50">
    <div className="container mx-auto px-4">
      {/* Tiêu đề */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl font-bold text-gray-800">Siêu ấn tượng</span>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent hidden sm:block">
          HealthCare
        </h1>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
        <div className="text-center">
          <Users size={48} className="mx-auto mb-4 text-blue-600" />
          <div className="text-4xl font-bold text-gray-900 mb-2">150,000+</div>
          <p className="text-blue-600">Người dùng tin tưởng</p>
        </div>

        <div className="text-center">
          <UserCheck size={48} className="mx-auto mb-4 text-blue-600" />
          <div className="text-4xl font-bold text-gray-900 mb-2">2,000+</div>
          <p className="text-blue-600">Bác sĩ chuyên khoa</p>
        </div>

        <div className="text-center">
          <Building size={48} className="mx-auto mb-4 text-blue-600" />
          <div className="text-4xl font-bold text-gray-900 mb-2">200+</div>
          <p className="text-blue-600">Cơ sở y tế liên kết</p>
        </div>

        <div className="text-center">
          <CalendarCheck size={48} className="mx-auto mb-4 text-blue-600" />
          <div className="text-4xl font-bold text-gray-900 mb-2">500,000+</div>
          <p className="text-blue-600">Lượt đặt lịch</p>
        </div>
      </div>
    </div>
  </section>
);
