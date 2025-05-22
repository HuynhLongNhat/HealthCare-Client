import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, 
  Download, Calendar, Loader, TrendingUp
} from "lucide-react";
import { getAllSpecializations } from "@/api/doctor.api";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const SpecializationStatistic = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("year");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Lấy danh sách chuyên khoa
      const response = await getAllSpecializations();
      
      if (response && response.DT) {
        // Chuyển đổi dữ liệu từ API sang định dạng phù hợp
        const formattedStats = response.DT.map(spec => ({
          id: spec.id,
          name: spec.name,
          // Giả sử mỗi chuyên khoa có các trường thống kê như sau
          patientCount: spec.patientCount || 0,
          doctorCount: spec.doctorCount || 0,
          growthRate: spec.growthRate || 0,
          // Tạo dữ liệu giả cho biểu đồ theo tháng (nếu cần)
          monthlyData: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            patients: Math.floor(Math.random() * 100) + 10 // Thay bằng dữ liệu thực nếu có
          }))
        }));
        
        setStats(formattedStats);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching specialization statistics:", error);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!stats.length) return;
    
    // Tạo nội dung CSV
    const headers = "Tên chuyên khoa,Số bác sĩ\n"; // Chỉ có thể xuất thông tin cơ bản
    const csvContent = stats.reduce((acc, stat) => {
      return acc + `${stat.name},${stat.doctorCount || 0}\n`;
    }, headers);
    
    // Tạo link download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh-sach-chuyen-khoa-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tính toán các chỉ số tổng (chỉ có thể tính số bác sĩ)
  const totalDoctors = stats.reduce((sum, stat) => sum + (stat.doctorCount || 0), 0);

  // Tạo dữ liệu giả cho biểu đồ nếu không có dữ liệu thực
  const monthlyTrendData = Array.from({ length: 12 }, (_, month) => ({
    month: month + 1,
    doctors: Math.floor(Math.random() * 20) + 5 // Số bác sĩ giả định theo tháng
  }));

  // Top chuyên khoa theo số bác sĩ
  const topSpecializations = [...stats]
    .sort((a, b) => (b.doctorCount || 0) - (a.doctorCount || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Thống kê chuyên khoa
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
              Danh sách và thông tin các chuyên khoa y tế
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Xuất danh sách
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards - Chỉ hiển thị thông tin có sẵn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số chuyên khoa</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-blue-600"
            >
              <path d="M12 2v4" />
              <path d="m16.24 7.76 2.83-2.83" />
              <path d="M18 12h4" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="M12 18v4" />
              <path d="m7.76 16.24-2.83 2.83" />
              <path d="M6 12H2" />
              <path d="m7.76 7.76-2.83-2.83" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.length}</div>
            <p className="text-xs text-muted-foreground">
              Các chuyên khoa hiện có trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bác sĩ</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-green-600"
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
              <path d="M9 17v-5M12 17v-1M15 17v-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDoctors}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số bác sĩ toàn hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chuyên khoa phổ biến</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topSpecializations[0]?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Nhiều bác sĩ nhất: {topSpecializations[0]?.doctorCount || 0} bác sĩ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs - Điều chỉnh để phù hợp với dữ liệu có sẵn */}
      <Tabs defaultValue="distribution" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="distribution">Phân bố</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={chartType === "bar" ? "default" : "outline"} 
              size="icon" 
              onClick={() => setChartType("bar")}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={chartType === "pie" ? "default" : "outline"} 
              size="icon" 
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

       
        <TabsContent value="distribution" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng theo tháng </CardTitle>
              <CardDescription>
                {/* Biểu đồ mẫu - cần tích hợp API thống kê theo tháng */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Tháng', position: 'insideBottomRight', offset: -10 }}
                      tickFormatter={(month) => `T${month}`}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} bác sĩ`, 'Số lượng']}
                      labelFormatter={(month) => `Tháng ${month}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="doctors" 
                      name="Bác sĩ" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default SpecializationStatistic;