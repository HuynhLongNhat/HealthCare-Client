import React, { useMemo } from "react";
import {
  Building2,
  TrendingUp,
  Calendar,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ icon: Icon, title, value, trend, color, secondaryValue }) => {
  const isPositive = trend?.value >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {secondaryValue && (
          <span className="text-sm text-gray-400 mb-1">{secondaryValue}</span>
        )}
      </div>
    </motion.div>
  );
};

const ChartCard = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-sm col-span-full lg:col-span-2"
    >
      <h3 className="text-lg font-semibold mb-6">Tăng trưởng cơ sở y tế</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorGrowth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const ClinicStatistics = ({ clinics }) => {
  const stats = useMemo(() => {
    const totalClinics = clinics?.length || 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newClinics = clinics?.filter(clinic => {
      const createdDate = new Date(clinic.createdAt);
      return createdDate >= thirtyDaysAgo;
    }).length || 0;
    
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

  // Mock data for the chart
  const chartData = [
    { name: "T1", value: 40 },
    { name: "T2", value: 45 },
    { name: "T3", value: 55 },
    { name: "T4", value: 58 },
    { name: "T5", value: 65 },
    { name: "T6", value: 75 },
    { name: "T7", value: 85 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Thống kê tổng quan</h2>
        <div className="text-sm text-gray-500">Cập nhật lần cuối: Hôm nay</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Building2}
          title="Tổng số cơ sở y tế"
          value={stats.total}
          trend={{ value: 12 }}
          color="bg-indigo-500"
          secondaryValue="cơ sở"
        />
        <StatCard 
          icon={Calendar}
          title="Cơ sở mới (30 ngày)"
          value={stats.new}
          trend={{ value: stats.growthRate }}
          color="bg-emerald-500"
          secondaryValue="cơ sở mới"
        />
        <StatCard 
          icon={Users}
          title="Bác sĩ quản lý"
          value={stats.doctorsCount}
          trend={{ value: 5 }}
          color="bg-violet-500"
          secondaryValue="bác sĩ"
        />
        <StatCard 
          icon={Activity}
          title="Tỷ lệ phát triển"
          value={`${stats.growthRate}%`}
          trend={{ value: stats.growthRate }}
          color="bg-amber-500"
          secondaryValue="tăng trưởng"
        />
      </div>

      <ChartCard data={chartData} />
    </div>
  );
};

export default ClinicStatistics;