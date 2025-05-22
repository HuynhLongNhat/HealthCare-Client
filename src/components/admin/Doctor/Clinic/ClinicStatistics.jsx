import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  TrendingUp, 
  Calendar, 
  Activity,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, title, value, trend, color }) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <div className={`flex items-center mt-2 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp size={14} className={trend.positive ? 'rotate-0' : 'rotate-180'} />
                <span className="ml-1">{trend.value}% so với tháng trước</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ClinicStatistics = ({ clinics }) => {
  const stats = useMemo(() => {
    // Tổng số cơ sở
    const totalClinics = clinics?.length || 0;
    
    // Số cơ sở mới trong 30 ngày qua
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newClinics = clinics?.filter(clinic => {
      const createdDate = new Date(clinic.createdAt);
      return createdDate >= thirtyDaysAgo;
    }).length || 0;
    
    // Tính toán các bác sĩ duy nhất
    const uniqueDoctors = new Set();
    clinics?.forEach(clinic => {
      if (clinic.doctor_id) {
        uniqueDoctors.add(clinic.doctor_id);
      }
    });
    
    return {
      total: totalClinics,
      new: newClinics,
      doctorsCount: uniqueDoctors.size,
      growthRate: totalClinics > 0 ? Math.round((newClinics / totalClinics) * 100) : 0
    };
  }, [clinics]);

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê tổng quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Building2}
          title="Tổng số cơ sở y tế"
          value={stats.total}
          color="bg-blue-500"
        />
        <StatCard 
          icon={Calendar}
          title="Cơ sở mới (30 ngày)"
          value={stats.new}
          trend={{ positive: true, value: stats.growthRate }}
          color="bg-emerald-500"
        />
        <StatCard 
          icon={Users}
          title="Bác sĩ quản lý"
          value={stats.doctorsCount}
          color="bg-purple-500"
        />
        <StatCard 
          icon={Activity}
          title="Tỷ lệ phát triển"
          value={`${stats.growthRate}%`}
          color="bg-amber-500"
        />
      </div>
    </motion.div>
  );
};

export default ClinicStatistics;