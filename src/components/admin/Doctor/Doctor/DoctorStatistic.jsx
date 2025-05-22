import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllDoctors } from "@/api/doctor.api";
import { Loader, BarChart2 } from "lucide-react";
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

const DoctorStatistic = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const positions = [
    { value: 1, label: "Bác sĩ" },
    { value: 2, label: "Thạc sĩ" },
    { value: 3, label: "Tiến sĩ" },
    { value: 4, label: "Phó giáo sư" },
    { value: 5, label: "Giáo sư" },
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        setDoctors(response.DT);
        setLoading(false);
      } catch (err) {
        setError("Error fetching doctors");
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Chuẩn bị dữ liệu cho Recharts
  const chartData = positions.map((pos) => ({
    position: pos.label,
    count: doctors.filter((doctor) => doctor.doctor?.position === pos.label).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 mt-20">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Thống kê bác sĩ
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 my-2">
            Thống kê số lượng bác sĩ theo chức danh
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Số lượng bác sĩ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorStatistic;