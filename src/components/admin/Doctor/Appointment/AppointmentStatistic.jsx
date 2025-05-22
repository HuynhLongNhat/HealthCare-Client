import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const statusLabels = {
  1: "Đã đặt",
  2: "Phê duyệt",
  3: "Đã hủy",
  4: "Từ chối",
  5: "Đã thanh toán",
};

const AppointmentStatistic = ({ appointments = [] }) => {
  // Tổng số lượng theo trạng thái
  const statusCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    appointments.forEach((apt) => {
      const status = apt.appointment?.status_id;
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  }, [appointments]);

  // Thống kê theo ngày (7 ngày gần nhất)
  const dailyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
      const count = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointment?.booking_time);
        return (
          aptDate.getDate() === d.getDate() &&
          aptDate.getMonth() === d.getMonth() &&
          aptDate.getFullYear() === d.getFullYear()
        );
      }).length;
      days.push({ date: label, count });
    }
    return days;
  }, [appointments]);

  // Thống kê theo tháng (12 tháng gần nhất)
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" });
      const count = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointment?.booking_time);
        return (
          aptDate.getMonth() === d.getMonth() &&
          aptDate.getFullYear() === d.getFullYear()
        );
      }).length;
      months.push({ month: label, count });
    }
    return months;
  }, [appointments]);

  return (
    <div className="space-y-6 mt-10">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Thống kê tổng số lịch hẹn theo trạng thái</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(statusCounts).map(([key, value]) => ({
              status: statusLabels[key],
              count: value,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Lịch hẹn theo ngày (7 ngày gần nhất)</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" name="Lịch hẹn/ngày" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Lịch hẹn theo tháng (12 tháng gần nhất)</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e42" name="Lịch hẹn/tháng" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentStatistic;